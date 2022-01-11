import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>()

  type: string
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route
      .paramMap
      .pipe(takeUntil(this.onDestroy))
      .subscribe( (map: any) => {
        if (map && map.params && map.params.type) {
          this.type = map.params.type
        }
      })
  }

  ngOnDestroy() {
    this.onDestroy.next()
    this.onDestroy.complete()
  }
}
