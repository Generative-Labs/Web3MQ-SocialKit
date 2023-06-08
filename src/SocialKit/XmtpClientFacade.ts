import { Client, Conversation, DecodedMessage } from '@xmtp/xmtp-js';
import { BaseClient, ListMessagesOptions, Unsubscribable } from './BaseClient';
import { AddressLike, Wallet } from 'ethers';

export class XmtpClientFacade extends BaseClient {
  instance: Client
  conversation: Map<string, Conversation> = new Map()

  constructor(instance: Client) {
    super();
    this.instance = instance
  }
 
  static async init(id?: string) {
    const wallet = id ? new Wallet(id) : Wallet.createRandom();
    const client = await Client.create(wallet)
    return new XmtpClientFacade(client);
  }

  async sendMessage(content: string, to: string) {
    let convs
    if (this.conversation.get(to)) {
      convs = this.conversation.get(to)
    }
    convs = await this.instance.conversations.newConversation(to)
    this.conversation.set(to, convs)
    try {   
      const { error } = await convs.send(content)
      return {
        error,
        success: !!error
      }
    } catch (error) {
      return {
        error,
        success: false,
      }
    }
  }

  async receiveMessage(callback: any, to: string) {
    const convs = this.conversation.get(to)
    if (!convs) {
      throw new Error(`${to} conversation not exsisted`)
    }
    for await (const message of await convs.streamMessages()) {
      if (message.senderAddress === this.instance.address) {
        // This message was sent from me
        continue
      }
      console.log(`[${message.senderAddress}]: ${message.content}`)
      callback(message)
    }
  }
  
  async getMessageList(pagination: ListMessagesOptions) {
    const allMsg: DecodedMessage[] = []
    for (const conversation of await this.instance.conversations.list()) {
      const messagesInConversation = await conversation.messages(pagination)
      allMsg.push(...messagesInConversation)
    }
    return allMsg
  }

  async getContacts() {
    const convs = await this.instance.conversations.list()
    return convs.map(conv => conv.peerAddress)
  }
}
