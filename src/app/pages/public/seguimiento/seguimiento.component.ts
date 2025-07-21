import { Component } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

@Component({
  selector: 'app-seguimiento',
  imports: [NavbarComponent],
  template: `
    <div class="bg-main">
      <app-navbar></app-navbar>
    </div>
  `,
  styles: ``,
})
export class SeguimientoComponent {}
