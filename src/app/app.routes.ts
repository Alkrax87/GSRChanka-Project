import { Routes } from '@angular/router';
import { MainComponent } from './pages/portal/main/main.component';
import { HomeComponent } from './pages/portal/home/home.component';
import { UsuarioComponent } from './pages/portal/usuario/usuario.component';
import { LandingComponent } from './pages/public/landing/landing.component';
import { LoginComponent } from './pages/public/login/login.component';
import { TramitesComponent } from './pages/public/tramites/tramites.component';
import { SeguimientoComponent } from './pages/public/seguimiento/seguimiento.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'tramite', component: TramitesComponent },
  { path: 'seguimiento', component: SeguimientoComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'portal',
    component: MainComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'usuario', component: UsuarioComponent },
    ],
  },
];
