import { Component, EventEmitter, OnInit, Output, Input, OnDestroy } from '@angular/core'

import { SubSink } from 'subsink'

@Component({
  selector: 'block-historico-central',
  templateUrl: './block-historico-central.component.html',
  styleUrls: ['./block-historico-central.component.scss']
})
export class BlockHistoricoCentralComponent implements OnInit, OnDestroy {
  @Output() event = new EventEmitter<any>()
  @Input() list: any[] = []

  value: string
  listErrorMsg: string
  filterActived: string

  subs$ = new SubSink()

  constructor() {
    this.value = ''
  }

  ngOnInit() {
    this.filterActived = 'Últimos 18 meses'
    console.log('historicos carregados:', this.list);
  }

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }

  /**
   *
   * @param especialidades
   */
  showEspecialidades(especialidades) {
    return especialidades
      ? especialidades
          .map(item => {
            return item.descricao
          })
          .join(', ')
      : ''
  }
}
