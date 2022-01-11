import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { NgModule, LOCALE_ID, Component } from '@angular/core'
import { registerLocaleData } from '@angular/common'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import ptBr from '@angular/common/locales/pt'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { PepStoreModule } from './_store/store.module'
import { AuthService } from './_store/_modules/auth/auth.service'
import { HomeGuard } from './guards/home/home.guard'
import { BrowserModule } from '@angular/platform-browser'
import { APP_BASE_HREF } from '@angular/common'
import { PacienteComponentModule } from './pages/paciente/paciente.module'
import { AngularToastifyModule, ToastService } from 'angular-toastify'
registerLocaleData(ptBr)

@NgModule({
  declarations: [AppComponent],
  imports: [
    NoopAnimationsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    PepStoreModule,
    AngularToastifyModule
  ],
  providers: [
    PacienteComponentModule,
    AuthService,
    HomeGuard,
    ToastService,
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
