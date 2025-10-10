import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-usuario-profile',
  imports: [FontAwesomeModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-xl w-96 shadow-xl overflow-hidden">
        <div class="relative">
          <img class="w-full h-32 max-h-32 object-cover" src="https://images.unsplash.com/photo-1548679847-1d4ff48016c7?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1vdW50YWluJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww" alt="">
          <div class="absolute top-20 w-full flex justify-center">
            <img class="w-24" src="https://avatar.iran.liara.run/public" />
          </div>
        </div>
        <div class="p-6 bg-white text-center pt-14 px-5 pb-5">
          <h2 class="text-xl font-semibold">{{ usuario.nombres }} {{ usuario.apellidos }}</h2>
          <p class="font-semibold text-sm text-neutral-600 -mt-1">{{ '@' + usuario.usuario }}</p>
          <div class="flex justify-center gap-2 mt-5">
            <button type="button" (click)="close.emit()" class="bg-main hover:bg-main-hover px-4 py-2 text-white rounded-full">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class UsuarioProfileComponent {
  @Input() usuario!: Usuario;
  @Output() close = new EventEmitter<void>();
}