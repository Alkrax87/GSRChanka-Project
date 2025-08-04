import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-usuario',
  imports: [RouterOutlet],
  template: `
    <p>
      usuario works!
    </p>
    <router-outlet></router-outlet>
  `,
  styles: ``
})
export class UsuarioComponent {

}
