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
import { roleGuard } from './guards/role.guard';
import { DashboardComponent } from './pages/portal/dashboard/dashboard.component';

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
      { path: 'usuarios', component: UsuariosComponent, canActivate: [roleGuard], data: { allowedRoles: ['SUPERADMIN'] } },
      { path: 'areas', component: AreasComponent, canActivate: [roleGuard], data: { allowedRoles: ['SUPERADMIN'] } },
      { path: 'obras', component: ObrasComponent, canActivate: [roleGuard], data: { allowedRoles: ['SUPERADMIN'] } },
      { path: 'dashboard', component: DashboardComponent, canActivate: [roleGuard], data: { allowedRoles: ['SUPERADMIN', 'BOSS'] } },
      { path: 'documentos', component: DocumentosComponent, canActivate: [roleGuard], data: { allowedRoles: ['SUPERADMIN', 'BOSS', 'OPERATOR'] } },
      { path: 'tramites', component: TramitesComponent, canActivate: [roleGuard], data: { allowedRoles: ['SUPERADMIN', 'BOSS', 'OPERATOR'] } },
      { path: 'seguimiento', component: HomeComponent, canActivate: [roleGuard], data: { allowedRoles: ['SUPERADMIN', 'BOSS', 'OPERATOR'] } },
    ],
  },
  { path: '**', redirectTo: '' },
];