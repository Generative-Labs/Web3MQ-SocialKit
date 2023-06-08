import { WalletType, Client } from '@web3mq/client';
import { AddressLike, Wallet } from 'ethers'
import { BaseClient, ListMessagesOptions, MessageResponse } from './BaseClient';

export class Web3mqClientFacade extends BaseClient {
  instance: Client;

  constructor(instance: Client) {
    super()
    this.instance = instance
  }
  sendMessage(content: string, to: AddressLike): Promise<MessageResponse> {
    throw new Error('Method not implemented.');
  }
  receiveMessage(callback: any, to: string): void {
    throw new Error('Method not implemented.');
  }
  getMessageList(pagination: ListMessagesOptions): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  getContacts(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  static async init(id?: string) {
    const wallet = id ? new Wallet(id) : Wallet.createRandom()
    const address = wallet.address
    const didType: WalletType = 'eth' // or 'starknet'
    
    const bestEndpointUrl = await Client.init({
      connectUrl: '', //
      app_key: 'app_key', // temporary authorization key obtained by applying, will be removed in future testnets and mainnet
    });
    const fastUrl = await Client.init({
      connectUrl: bestEndpointUrl, // takes in a valid endpoint url as input, when this paramter is given, client will always connect to that specific node.
      app_key: 'app_key', // Appkey applied from our team
    });

   
    const { userid, userExist } = await Client.register.getUserInfo({
        did_value: address,
        did_type: didType,
    });

    if (!userExist) {
      const registerRes = await Client.register.register({
        didValue: address,
        didType: didType,
        userid,
        avatar_url: `https://cdn.stamp.fyi/avatar/${address}?s=300`,
        mainPublicKey: '',
        signature: ''
      });
    }

    await Client.register.login({
      mainPrivateKey: '',
      mainPublicKey: '',
      didType: didType,
      didValue: address,
      userid,
      password: '',
    })

    const instance = Client.getInstance({
      PrivateKey: '',
      PublicKey: '',
      userid,
    })
    return new Web3mqClientFacade(instance)
  }
}