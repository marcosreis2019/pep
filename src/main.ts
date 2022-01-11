import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { default as localForage, getAllDataFromLocalForage } from 'ngrx-store-persist'
import { AppModule } from './app/app.module'
import { environment as env } from './environments/environment'
import { KEYS_TO_LOCAL_STORAGE } from './app/_store/store.models'

if (env.production) {
  enableProdMode()
}

getAllDataFromLocalForage({
  driver: localForage.INDEXEDDB,
  keys: KEYS_TO_LOCAL_STORAGE
}).then(() => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err))
})
// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err))
