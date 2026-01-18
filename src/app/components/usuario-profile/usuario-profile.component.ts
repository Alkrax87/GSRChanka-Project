import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-usuario-profile',
  imports: [FontAwesomeModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-xl w-96 shadow-xl overflow-hidden">
        <div class="relative">
          <img class="w-full h-32 max-h-32 object-cover" src="https://images.unsplash.com/photo-1548679847-1d4ff48016c7?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1vdW50YWluJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww" alt="">
          <div class="absolute top-20 w-full flex justify-center">
            <div class="bg-main w-24 h-24 rounded-full"></div>
          </div>
        </div>
        <div class="p-6 bg-white text-center pt-14 px-5 pb-5">
          <h2 class="text-xl font-semibold">{{ usuario.nombres }} {{ usuario.apellidos }}</h2>
          <p class="font-semibold text-sm text-main -mt-1">{{ '@' + usuario.usuario }}</p>
          <div class="text-neutral-500 text-sm mt-1 mb-4">
            <p><fa-icon [icon]="Phone"></fa-icon> {{ usuario.telefono }}</p>
            <p><fa-icon [icon]="Mail"></fa-icon> {{ usuario.correo }}</p>
          </div>
          <div class="flex justify-center gap-2">
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

  Phone = faPhone;
  Mail = faEnvelope;
}