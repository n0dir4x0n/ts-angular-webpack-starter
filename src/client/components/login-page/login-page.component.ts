import { Component } from '@angular/core'
import { AuthService } from '../../services/auth.service'

@Component({
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  public username
  public password

  constructor(
    private authService: AuthService,
  ) { }

  async login() {
    try {
      const authToken = await this.authService.login(this.username, this.password)
    } catch (error) {
      console.error(error)
    }
  }
}
