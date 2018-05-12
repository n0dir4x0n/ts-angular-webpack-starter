import { Component } from '@angular/core'
import { UserService } from '../../services/user.service'

@Component({
  templateUrl: './user-item-page.component.html',
})
export class UserItemPageComponent {
  constructor(
    private userService: UserService,
  ) { }
}
