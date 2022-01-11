import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import * as config from 'src/../package.json'
@Component({
  selector: 'versao',
  templateUrl: './versao.component.html',
  styleUrls: ['./versao.component.scss']
})
export class VersaoComponent implements OnInit, OnDestroy {
  constructor(private router: Router) {}
  version = ''

  ngOnInit() {
    this.version = config.version
  }

  ngOnDestroy() {}

  redirect() {
    this.router.navigate(['login'])
  }

  finish() {}
}
