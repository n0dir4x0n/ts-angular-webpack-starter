import { Routes } from '@angular/router'
import { AboutPageComponent } from './components/about-page/about-page.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { HomePageComponent } from './components/home-page/home-page.component'
import { LoginPageComponent } from './components/login-page/login-page.component'
import { UserItemPageComponent } from './components/user-item-page/user-item-page.component'
import { UserListPageComponent } from './components/user-list-page/user-list-page.component'
import { AuthGuard } from './services/auth.guard'

export const routes: Routes = [
  {
    component: LoginPageComponent,
    path: 'login',
  },
  {
    component: DashboardComponent,
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        component: AboutPageComponent,
        path: 'about',
      },
      {
        component: HomePageComponent,
        path: '',
      },
      {
        path: 'users',
        children: [
          {
            component: UserListPageComponent,
            path: '',
          },
          {
            component: UserItemPageComponent,
            path: 'create',
          },
        ],
      },
    ],
  },
]
