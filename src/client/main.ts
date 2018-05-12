import 'reflect-metadata'
import 'zone.js'

import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { RootModule } from './root.module'

if (process.env.NODE_ENV === 'production') {
  enableProdMode()
}

platformBrowserDynamic().bootstrapModule(RootModule)
