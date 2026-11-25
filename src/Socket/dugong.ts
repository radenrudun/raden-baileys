import { generateMessageID, generateWAMessageContent } from "../Utils/index.js";

import type { AnyMessageContent } from "../Types/Message.js";

export class Dugong {
   constructor(
      private readonly waUploadToServer: any,
      private readonly relayMessage: any
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
}
