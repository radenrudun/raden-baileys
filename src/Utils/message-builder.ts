import type {
   AnyMessageContent,
   CarouselCard,
   CarouselMessageOptions,
   InteractiveMessageButton,
   InteractiveMessageOptions,
   ListMessageOptions,
   NativeFlowButton
} from "../Types/Message";

export class MessageBuilder {
   private content: Record<string, any> = {};

   // ============================================================
   // TEXT
   // ============================================================

   static text(text: string) {
      return new MessageBuilder().text(text);
   }

   text(text: string) {
      this.content.text = text;
      return this;
   }

   // ============================================================
   // FOOTER
   // ============================================================

   footer(footer: string) {
      this.content.footer = footer;
      return this;
   }

   // ============================================================
   // NATIVE FLOW
   // ============================================================

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

   // ============================================================
   // LIST
   // ============================================================

   list(options: ListMessageOptions) {
      this.content.list = options;
      return this;
   }

   // ============================================================
   // INTERACTIVE MESSAGE
   // ============================================================

   interactive(title: string) {
      this.content.interactiveMessage = {
         title,
         buttons: []
      } satisfies InteractiveMessageOptions;

      return this;
   }

   header(text: string) {
      if (!this.content.interactiveMessage) {
         throw new Error(
            "MessageBuilder.header() requires interactive() first"
         );
      }

      this.content.interactiveMessage.header = text;

      return this;
   }

   interactiveFooter(text: string) {
      if (!this.content.interactiveMessage) {
         throw new Error(
            "MessageBuilder.interactiveFooter() requires interactive() first"
         );
      }

      this.content.interactiveMessage.footer = text;

      return this;
   }

   interactiveButton(button: InteractiveMessageButton) {
      if (!this.content.interactiveMessage) {
         throw new Error(
            "MessageBuilder.interactiveButton() requires interactive() first"
         );
      }

      this.content.interactiveMessage.buttons.push(button);

      return this;
   }

   interactiveQuickReply(id: string, text: string) {
      return this.interactiveButton({
         id,
         text
      });
   }

   interactiveCtaUrl(text: string, url: string) {
      return this.interactiveButton({
         name: "cta_url",
         buttonParamsJson: JSON.stringify({
            display_text: text,
            url
         })
      });
   }

   interactiveCtaCopy(text: string, code: string) {
      return this.interactiveButton({
         name: "cta_copy",
         buttonParamsJson: JSON.stringify({
            display_text: text,
            copy_code: code
         })
      });
   }

   interactiveCtaCall(text: string, phoneNumber: string) {
      return this.interactiveButton({
         name: "cta_call",
         buttonParamsJson: JSON.stringify({
            display_text: text,
            phone_number: phoneNumber
         })
      });
   }

   // ============================================================
   // CAROUSEL
   // ============================================================

   carousel(options: CarouselMessageOptions) {
      this.content.carousel = options;
      return this;
   }

   // ============================================================
   // BUILD
   // ============================================================

   build(): AnyMessageContent {
      return this.content as AnyMessageContent;
   }
}
