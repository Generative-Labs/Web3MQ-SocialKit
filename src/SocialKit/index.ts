
import { BaseClient } from './BaseClient'
import { Web3mqClientFacade } from './Web3mqClientFacade'
import { XmtpClientFacade } from './XmtpClientFacade'
import { Wallet, randomBytes, hexlify } from 'ethers'

export type ClientType = 'web3mq' | 'xmtp' | 'walletconnect'

export class SocialClient {
  static clientType: ClientType
  client: any = null

  static create(type: ClientType) {
    SocialClient.clientType = type
    return SocialClient
  }

  static async init(id?: string): Promise<BaseClient> {
    if (SocialClient.clientType === 'xmtp') {
      return XmtpClientFacade.init(id)
    } else if (SocialClient.clientType === 'web3mq') {
      return Web3mqClientFacade.init(id)
    } else {
      // todo
      return XmtpClientFacade.init(id)
    }
  }

}
