import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { rpcMethods } from '../../common/constants'
import { ICBuffer } from '../../libs/icjs/ICBuffer'
import { ICCipher } from '../../libs/icjs/ICCipher'
import { ICCipherKey } from '../../libs/icjs/ICCipherKey'

@Injectable()
export class RpcService {
  private createSessionPromise
  private sessionId
  private dh

  constructor(
    private http: HttpClient,
  ) {
    this.createSessionPromise = this.createSession()
  }

  async createSession() {
    const cipherKey = new ICCipherKey()
    const { id, publicKey } = await this.request(rpcMethods.sessions.create, {
      publicKey: cipherKey.getPublicKey().toHex(),
    }, false)
    console.log('ID and publicKey ', id, '\n' , publicKey)
    this.sessionId = id
    this.dh = ICCipherKey.dh(cipherKey.getPrivateKey().toHex(), publicKey)
    console.log('dh of client ', this.dh)
  }

  async request(method: string, params: object, secure = true) {
    if (!secure) {
      return this.http.post<any>('rpc', { method, params }).toPromise()
    }
    const body = ICCipher.encrypt(this.dh, JSON.stringify({ method, params }))
    console.log('\n Body ', body)
    const response = await this.http.post<any>('rpc', body, {
      headers: {
        Authorization: `Bearer: ${this.sessionId}`,
      },
      responseType: 'arraybuffer' as 'json',
    }).toPromise()
    return response.data
  }
}
