import { AddressLike } from "ethers";

export type MessageResponse = {
  success: boolean,
  error?: Error | unknown,
}

export interface Unsubscribable {
  unsubscribe(): void;
}
export type ListMessagesOptions = {
  startTime?: Date;
  endTime?: Date;
  limit?: number;
}

export abstract class BaseClient {
  abstract instance: any

  abstract sendMessage(content: string, to: AddressLike | string): Promise<MessageResponse>;

  abstract receiveMessage(callback: any, to: string): void;

  abstract getMessageList(pagination: ListMessagesOptions): Promise<any[]>;
  
  abstract getContacts(): Promise<string[]>;

}