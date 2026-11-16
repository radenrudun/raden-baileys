import type {
   AnyMessageContent,
   CarouselCard,
   CarouselMessageOptions,
   InteractiveMessageButton
} from "../Types/Message";

export class CarouselBuilder {
   private options: CarouselMessageOptions;
   private currentCard?: CarouselCard;

   constructor() {
      this.options = {
         cards: []
      };
   }

   card(title?: string) {
      const card: CarouselCard = {
         title,
         buttons: []
      };

      this.options.cards.push(card);
      this.currentCard = card;

      return this;
   }

   body(text: string) {
      this.requireCard();
      this.currentCard!.body = text;
      return this;
   }

   footer(text: string) {
      this.requireCard();
      this.currentCard!.footer = text;
      return this;
   }

   image(url: string) {
      this.requireCard();
      this.currentCard!.image = {
         url
      };
      return this;
   }

   video(url: string) {
      this.requireCard();
      this.currentCard!.video = {
         url
      };
      return this;
   }

   button(id: string, text: string) {
      this.requireCard();

      if (!this.currentCard!.buttons) {
         this.currentCard!.buttons = [];
      }

      this.currentCard!.buttons.push({
         id,
         text
      });

      return this;
   }

   buttons(buttons: InteractiveMessageButton[]) {
      this.requireCard();

      if (!this.currentCard!.buttons) {
         this.currentCard!.buttons = [];
      }

      this.currentCard!.buttons.push(...buttons);

      return this;
   }

   messageVersion(version: number) {
      this.options.messageVersion = version;
      return this;
   }

   carouselCardType(type: "HSCROLL_CARDS" | "ALBUM_IMAGE") {
      this.options.carouselCardType = type;
      return this;
   }

   build(): AnyMessageContent {
      if (this.options.cards.length === 0) {
         throw new Error(
            "CarouselBuilder requires at least one card"
         );
      }

      return {
         carousel: this.options
      };
   }

   private requireCard() {
      if (!this.currentCard) {
         throw new Error(
            "CarouselBuilder requires card() before configuring a card"
         );
      }
   }
}