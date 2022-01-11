import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeGuard } from './guards/home/home.guard'

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginComponentModule)
  },
  {
    path: 'rest/version',
    loadChildren: () => import('./pages/versao/versao.module').then(m => m.VersaoModule)
  },
  {
    path: 'rest/ping',
    loadChildren: () => import('./pages/ping/ping.module').then(m => m.PingModule)
  },
  {
    path: 'not-found',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule)
  },
  {
    path: ':empresa/home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeComponentModule),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/paciente',
    loadChildren: () =>
      import('./pages/paciente/paciente.module').then(m => m.PacienteComponentModule),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/especialidades',
    loadChildren: () =>
      import('./pages/especialidade/especialidade.module').then(m => m.EspecialidadeModule),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/local',
    loadChildren: () => import('./pages/local/local.module').then(m => m.LocalModule),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/classificacao',
    loadChildren: () =>
      import('./pages/classificacao/classificacao.module').then(m => m.ClassificacaoModule),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/cronograma',
    loadChildren: () =>
      import('./pages/cronograma/cronograma.module').then(m => m.CronogramaModule),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/tipo_servico',
    loadChildren: () =>
      import('./pages/tipo-servico/tipo-servico.module').then(m => m.TipoServicoModule),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/termos',
    loadChildren: () => import('./pages/termos/termos.module').then(m => m.TermoModule),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/agendamento',
    loadChildren: () =>
      import('./pages/agendamento/agendamento.module').then(m => m.AgendamentoModule),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/painel',
    loadChildren: () => import('./pages/painel/painel.module').then(m => m.PainelComponentModule),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/painel-historico',
    loadChildren: () => import('./pages/painel-historico/painel-historico.module').then(m => m.PainelHistoricoComponentModule),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/finish',
    loadChildren: () => import('./pages/finish/finish.module').then(m => m.FinishModule)
  },
  {
    path: ':empresa/print',
    loadChildren: () => import('./pages/print/print.module').then(m => m.PrintModule)
  },
  {
    path: ':empresa/documentos',
    loadChildren: () => import('./pages/documentos/documentos.module').then(m => m.DocumentosModule)
  },
  {
    path: ':empresa/operadoras',
    loadChildren: () => import('./pages/operadora/operadora.module').then(m => m.OperadoraModule)
  },
  {
    path: ':empresa/usuarios',
    loadChildren: () => import('./pages/usuario/usuario.module').then(m => m.UsuarioModule)
  },
  {
    path: ':empresa/onboarding',
    loadChildren: () => import('./pages/onboarding/onboarding.module').then(m => m.OnboardingModule)
  },
  {
    path: 'documento/:documentId',
    loadChildren: () =>
      import('./pages/usuario-documento/usuario-documento.module').then(
        m => m.UsuarioDocumentoComponentModule
      )
  },
  {
    path: ':empresa/documentos',
    loadChildren: () => import('./pages/print/print.module').then(m => m.PrintModule)
  },
  {
    path: ':empresa/relatorio-geral',
    loadChildren: () =>
      import('./pages/relatorios/relatorio-geral/relatorio-geral.module').then(
        m => m.RelatorioGeralComponentModule
      ),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/relatorio-geral-historico',
    loadChildren: () =>
      import('./pages/relatorios/relatorio-geral-historico/relatorio-geral-historico.module').then(
        m => m.RelatorioGeralHistoricoComponentModule
      ),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/print-exames',
    loadChildren: () =>
      import('./pages/print/print-exames/print-exames.module').then(
        m => m.PrintExamesComponentModule
      ),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/print-referencia',
    loadChildren: () =>
      import('./pages/print/print-referencia/print-referencia.module').then(
        m => m.PrintReferenciaComponentModule
      ),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/relatorio-atendimento',
    loadChildren: () =>
      import('./pages/relatorios/relatorio-atendimento/relatorio-atendimento.module').then(
        m => m.RelatorioAtendimentoComponentModule
      ),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/relatorio-agendamento',
    loadChildren: () =>
      import('./pages/relatorios/relatorio-agendamento/relatorio-agendamento.module').then(
        m => m.RelatorioAgendamentoComponentModule
      ),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/relatorio-agendamento-evento',
    loadChildren: () =>
      import('./pages/relatorio-agendamento-evento/relatorio-agendamento-evento.module').then(
        m => m.RelatorioAgendamentoEventoComponentModule
      ),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/relatorio-faturamento',
    loadChildren: () =>
      import('./pages/relatorios/relatorio-faturamento/relatorio-faturamento.module').then(
        m => m.RelatorioFaturamentoComponentModule
      ),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/relatorio-emespera',
    loadChildren: () =>
      import('./pages/relatorios/relatorio-emespera/relatorio-emespera.module').then(
        m => m.RelatorioEmEsperaComponentModule
      ),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/relatorio-diaslivres',
    loadChildren: () =>
      import('./pages/relatorios/relatorio-diaslivres/relatorio-diaslivres.module').then(
        m => m.RelatorioDiasLivresComponentModule
      ),
    canActivate: [HomeGuard]
  },
  {
    path: ':empresa/relatorio-exames',
    loadChildren: () =>
      import('./pages/relatorios/relatorio-exames/relatorio-exames.module').then(
        m => m.RelatorioExamesComponentModule
      ),
    canActivate: [HomeGuard]
  },
  {
    path: 'audio',
    loadChildren: () => import('./pages/audio/audio.module').then(m => m.AudioModule)
  },
  { path: '**', redirectTo: 'login' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
