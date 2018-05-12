import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { rpcMethods } from '../../common/constants'
import { RpcService } from './rpc.service'

@Injectable()
export class AuthService {
  private _authenticated = false

  constructor(
    private router: Router,
    private rpcService: RpcService,
  ) { }

  get authenticated() {
    return this._authenticated
  }

  async redirectToLogin() {
    return this.router.navigate(['/login'])
  }

  async login(username, password) {
    return this.rpcService.request(rpcMethods.authTokens.create, {
      username, password,
    })
  }
}
