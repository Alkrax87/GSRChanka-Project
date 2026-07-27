import { Routes } from '@angular/router';
import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MainComponent } from './pages/portal/main/main.component';
import { HomeComponent } from './pages/portal/home/home.component';
import { LandingComponent } from './pages/public/landing/landing.component';
import { LoginComponent } from './pages/public/login/login.component';
import { SeguimientoComponent } from './pages/public/seguimiento/seguimiento.component';
import { UsuariosComponent } from './pages/portal/usuarios/usuarios.component';
import { TramitesComponent } from './pages/portal/tramites/tramites.component';
import { DocumentosComponent } from './pages/portal/documentos/documentos.component';
import { AreasComponent } from './pages/portal/dependencias/areas/areas.component';
import { ObrasComponent } from './pages/portal/dependencias/obras/obras.component';

const redirectLoggedIn = () => redirectLoggedInTo(['portal/home']);
const redirectUnauthorizedUser = () => redirectUnauthorizedTo(['login']);

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'seguimiento', component: SeguimientoComponent },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedIn },
  },
  {
    path: 'portal',
    component: MainComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedUser },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      // Admin
      { path: 'usuarios', component:  UsuariosComponent},
      { path: 'areas', component:  AreasComponent },
      { path: 'obras', component:  ObrasComponent },
      // User
      { path: 'documentos', component:  DocumentosComponent},
      { path: 'tramites', component: TramitesComponent },
      { path: 'seguimiento', component: HomeComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];