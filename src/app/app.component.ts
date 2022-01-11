import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private sub$: Subscription
  toastConfig = {
    position: 'top-right',
    transition: 'bounce',
    autoClose: '6000',
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    pauseOnHover: true,
    pauseOnVisibilityChange: true,
    iconLibrary: 'none'
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.sub$.unsubscribe()
  }
}
