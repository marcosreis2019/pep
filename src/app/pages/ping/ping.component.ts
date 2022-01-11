import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
@Component({
  selector: 'ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.scss']
})
export class PingComponent implements OnInit {
  constructor(private router: Router) {}
  public ping: any = ''

  ngOnInit() {}

  Ping() {}
}
