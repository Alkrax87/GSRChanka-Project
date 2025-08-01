import { Routes } from '@angular/router';
import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MainComponent } from './pages/portal/main/main.component';
import { HomeComponent } from './pages/portal/home/home.component';
import { UsuarioComponent } from './pages/portal/usuario/usuario.component';
import { LandingComponent } from './pages/public/landing/landing.component';
import { LoginComponent } from './pages/public/login/login.component';
import { TramitesComponent } from './pages/public/tramites/tramites.component';
import { SeguimientoComponent } from './pages/public/seguimiento/seguimiento.component';

const redirectLoggedIn = () => redirectLoggedInTo(['portal/home']);
const redirectUnauthorizedUser = () => redirectUnauthorizedTo(['login']);

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'tramite', component: TramitesComponent },
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
      { path: 'home', component: HomeComponent },
      { path: 'usuario', component: UsuarioComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
