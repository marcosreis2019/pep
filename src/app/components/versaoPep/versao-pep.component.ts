import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import * as config from 'src/../package.json'
@Component({
  selector: 'versao-pep',
  templateUrl: './versao-pep.component.html'
})
export class VersaoPepComponent implements OnInit {
  constructor(private router: Router) {}
  public version = ''

  ngOnInit() {
    this.version = config.version
  }

  redirect() {
    this.router.navigate(['login'])
  }

  finish() {}
}
