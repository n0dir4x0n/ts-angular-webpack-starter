import { Component, OnInit } from '@angular/core'
import { UserService } from '../../services/user.service'

@Component({
  templateUrl: './user-list-page.component.html',
})
export class UserListPageComponent implements OnInit {
  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.fetchList()
  }

  get users() {
    return this.userService.users
  }
}
