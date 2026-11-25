import crypto from "crypto";

import {
   generateMessageID,
   generateWAMessage,
   generateWAMessageContent,
   generateWAMessageFromContent
} from "../Utils/index.js";

import { jidNormalizedUser } from "../WABinary/index.js";

import type {
   AnyMessageContent,
   AlbumMessageContent
} from "../Types/Message.js";

export class Dugong {
   constructor(
      private readonly waUploadToServer: any,
      private readonly relayMessage: any,
      private readonly userJid: string
   ) {}

   async handleGroupStory(
      content: Extract<AnyMessageContent, { groupStatusMessage: any }>,
      jid: string
   ) {
      const storyData = content.groupStatusMessage;

      const waMsgContent = await generateWAMessageContent(
         storyData as AnyMessageContent,
         {
            upload: this.waUploadToServer
         }
      );

      const innerMsg = waMsgContent;

      const msgKey = Object.keys(innerMsg).find(
         key =>
            innerMsg[key as keyof typeof innerMsg] &&
            typeof innerMsg[key as keyof typeof innerMsg] === "object"
      );

      if (!msgKey) {
         throw new Error("Group status: media/text message tidak ditemukan");
      }

      const message = innerMsg[msgKey as keyof typeof innerMsg] as any;

      message.contextInfo = {
         ...(message.contextInfo || {}),
         isGroupStatus: true
      };

      if (msgKey === "imageMessage") {
         message.contextInfo.statusSourceType = 0;
      } else if (msgKey === "videoMessage") {
         message.contextInfo.statusSourceType = 1;
      } else if (msgKey === "audioMessage") {
         message.contextInfo.statusSourceType = 3;
      } else if (msgKey === "extendedTextMessage") {
         message.contextInfo.statusSourceType = 4;
      }

      const messageId = generateMessageID();

      await this.relayMessage(jid, innerMsg, {
         messageId
      });

      return {
         key: {
            remoteJid: jid,
            fromMe: true,
            id: messageId
         },
         message: innerMsg
      };
   }

   async handleAlbum(content: AlbumMessageContent, jid: string, quoted?: any) {
      const items = content.albumMessage;

      if (!Array.isArray(items) || items.length === 0) {
         throw new Error("Album: minimal 1 media diperlukan");
      }

      const expectedImageCount = items.filter(item => "image" in item).length;

      const expectedVideoCount = items.filter(item => "video" in item).length;

      const album = await generateWAMessageFromContent(
         jid,
         {
            messageContextInfo: {
               messageSecret: crypto.randomBytes(32)
            },

            albumMessage: {
               expectedImageCount,
               expectedVideoCount
            }
         },
         {
            userJid: jidNormalizedUser(this.userJid),
            quoted
         }
      );

      await this.relayMessage(jid, album.message, {
         messageId: album.key.id
      });

      for (let item of items) {
         if (
            content.contextInfo &&
            Object.keys(content.contextInfo).length > 0 &&
            !item.contextInfo
         ) {
            item = {
               ...item,
               contextInfo: content.contextInfo
            };
         }

         const media = await generateWAMessage(jid, item, {
            upload: this.waUploadToServer,
            userJid: jidNormalizedUser(this.userJid)
         });

         media.message!.messageContextInfo = {
            messageSecret: crypto.randomBytes(32),

            messageAssociation: {
               associationType: 1,
               parentMessageKey: album.key
            }
         };

         await this.relayMessage(jid, media.message!, {
            messageId: media.key.id!
         });
      }

      return album;
   }
}
