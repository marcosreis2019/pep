import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { LoginComponent } from './login.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { RouterTestingModule } from '@angular/router/testing'
import { PepStoreModule } from '../../_store/store.module'
import { AngularToastifyModule, ToastService } from 'angular-toastify'

describe('LoginComponent', () => {
  let component: LoginComponent
  let fixture: ComponentFixture<LoginComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        PepStoreModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AngularToastifyModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [ToastService]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have ngOnInit method', () => {
    expect(component.ngOnInit).toBeTruthy()
  })

  it('should have changePassword method', () => {
    expect(component.changePassword).toBeTruthy()
  })

  it('should have title', () => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('.pep-title').innerHTML).toMatch('PEP')
  })

  it('should have subtitle', () => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('.pep-subtitle').innerHTML).toMatch(
      'Bem vindo, faça login para continuar.'
    )
  })

  it('should have image', () => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('.pep-login-img').src).toMatch('assets/imgs/fg-login.svg')
  })

  it('should have input login with placeholder', () => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('#usuario').placeholder).toMatch('Usuário')
  })

  it('should have input password with placeholder', () => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('#current-password').placeholder).toMatch('Senha')
  })

  it('should have login button', () => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('#login-button').innerHTML).toMatch('Login')
  })

  it('should have version', () => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('.versao-login .no-selection').innerHTML).toMatch('Versão')
    expect(compiled.querySelector('versao-pep')).toBeTruthy()
  })
})
