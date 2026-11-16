import type { AnyMessageContent, PollMessageOptions } from "../Types/Message";

export class PollBuilder {
   private pollOptions: PollMessageOptions;

   constructor(name: string) {
      this.pollOptions = {
         name,
         values: [],
         selectableCount: 1
      };
   }

   options(values: string[]) {
      this.pollOptions.values.push(...values);
      return this;
   }

   option(value: string) {
      this.pollOptions.values.push(value);
      return this;
   }

   selectableCount(count: number) {
      this.pollOptions.selectableCount = count;
      return this;
   }

   messageSecret(secret: Uint8Array) {
      this.pollOptions.messageSecret = secret;
      return this;
   }

   toAnnouncementGroup(enabled = true) {
      this.pollOptions.toAnnouncementGroup = enabled;
      return this;
   }

   build(): AnyMessageContent {
      return {
         poll: this.pollOptions
      };
   }
}