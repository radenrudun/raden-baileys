import type {
   AnyMessageContent,
   CarouselMessageOptions,
   InteractiveMessageButton,
   InteractiveMessageOptions,
   ListMessageOptions,
   ListMessageSection,
   NativeFlowButton
} from "../Types/Message";
import { PollBuilder } from "./poll-builder";
import { CarouselBuilder } from "./carousel-builder";

export class InteractiveMessageBuilder {
   private options: InteractiveMessageOptions;

   constructor(title: string) {
      this.options = {
         title,
         buttons: []
      };
   }

   body(text: string) {
      this.options.title = text;
      return this;
   }

   header(text: string) {
      this.options.header = text;
      return this;
   }

   footer(text: string) {
      this.options.footer = text;
      return this;
   }

   button(button: InteractiveMessageButton) {
      this.options.buttons.push(button);
      return this;
   }

   buttons(buttons: InteractiveMessageButton[]) {
      this.options.buttons.push(...buttons);
      return this;
   }

   quickReply(id: string, text: string) {
      return this.button({
         id,
         text
      });
   }

   ctaUrl(text: string, url: string) {
      return this.button({
         name: "cta_url",
         buttonParamsJson: JSON.stringify({
            display_text: text,
            url
         })
      });
   }

   ctaCopy(text: string, code: string) {
      return this.button({
         name: "cta_copy",
         buttonParamsJson: JSON.stringify({
            display_text: text,
            copy_code: code
         })
      });
   }

   ctaCall(text: string, phoneNumber: string) {
      return this.button({
         name: "cta_call",
         buttonParamsJson: JSON.stringify({
            display_text: text,
            phone_number: phoneNumber
         })
      });
   }

   messageParamsJson(params: string | Record<string, unknown>) {
      this.options.messageParamsJson =
         typeof params === "string" ? params : JSON.stringify(params);

      return this;
   }

   messageVersion(version: number) {
      this.options.messageVersion = version;
      return this;
   }

   build(): AnyMessageContent {
      return {
         interactiveMessage: this.options
      };
   }
}

class ListMessageBuilder {
   private options: ListMessageOptions;
   private currentSection?: ListMessageSection;

   constructor(title: string) {
      this.options = {
         title,
         text: "",
         buttonText: "",
         sections: []
      };
   }

   text(text: string) {
      this.options.text = text;
      return this;
   }

   footer(footer: string) {
      this.options.footer = footer;
      return this;
   }

   button(text: string) {
      this.options.buttonText = text;
      return this;
   }

   section(title: string) {
      const section: ListMessageSection = {
         title,
         rows: []
      };

      this.options.sections.push(section);
      this.currentSection = section;

      return this;
   }

   row(id: string, title: string, description?: string) {
      if (!this.currentSection) {
         throw new Error("ListMessageBuilder.row() requires section() first");
      }

      this.currentSection.rows.push({
         id,
         title,
         description
      });

      return this;
   }

   build(): AnyMessageContent {
      return {
         list: this.options
      };
   }
}

export class MessageBuilder {
   private content: Record<string, any> = {};

   static text(text: string) {
      return new MessageBuilder().text(text);
   }

   text(text: string) {
      this.content.text = text;
      return this;
   }

   footer(footer: string) {
      this.content.footer = footer;
      return this;
   }

   button(button: NativeFlowButton) {
      if (!this.content.buttons) {
         this.content.buttons = [];
      }

      this.content.buttons.push(button);
      return this;
   }

   quickReply(id: string, text: string) {
      return this.button({
         id,
         text
      });
   }

   ctaUrl(text: string, url: string) {
      return this.button({
         name: "cta_url",
         buttonParamsJson: JSON.stringify({
            display_text: text,
            url
         })
      });
   }

   ctaCopy(text: string, code: string) {
      return this.button({
         name: "cta_copy",
         buttonParamsJson: JSON.stringify({
            display_text: text,
            copy_code: code
         })
      });
   }

   ctaCall(text: string, phoneNumber: string) {
      return this.button({
         name: "cta_call",
         buttonParamsJson: JSON.stringify({
            display_text: text,
            phone_number: phoneNumber
         })
      });
   }

   static list(title: string) {
      return new ListMessageBuilder(title);
   }

   static interactive(title: string) {
      return new InteractiveMessageBuilder(title);
   }

   static carousel(options: CarouselMessageOptions): MessageBuilder;
   static carousel(): CarouselBuilder;
   static carousel(options?: CarouselMessageOptions) {
      if (options) {
         return new MessageBuilder().carousel(options);
      }

      return new CarouselBuilder();
   }

   carousel(options: CarouselMessageOptions) {
      this.content.carousel = options;
      return this;
   }

   static poll(name: string) {
      return new PollBuilder(name);
   }

   build(): AnyMessageContent {
      return this.content as AnyMessageContent;
   }
}
