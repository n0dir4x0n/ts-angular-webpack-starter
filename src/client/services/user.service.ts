import { Injectable } from '@angular/core'
import { rpcMethods } from '../../common/constants'
import { RpcService } from './rpc.service'

@Injectable()
export class UserService {
  private _users: any[]

  constructor(
    private rpcService: RpcService,
  ) { }

  get users() {
    return this._users
  }

  async fetchList() {
    this._users = await this.rpcService.request(rpcMethods.users.getList, {})
  }
}
