import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBuilding, faEnvelope, faHammer, faListOl, faPhone, faTag, faTimes, faUser, faUserShield, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { DependenciasService } from '../../services/dependencias.service';
import { Dependencia } from '../../interfaces/dependencia';

@Component({
  selector: 'app-usuario-profile',
  imports: [FaIconComponent],
  template: `
    <div class="modal">
      <div class="card-modal w-96 overflow-hidden">
        <div class="relative -mt-6 -ml-6 -mr-6">
          <img class="w-full h-24 max-h-24 object-cover" src="https://images.unsplash.com/photo-1548679847-1d4ff48016c7?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1vdW50YWluJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww" alt="Background">
          <div class="absolute cursor-pointer text-neutral-200 hover:text-neutral-100 right-3 top-3"  (click)="close.emit()">
            <fa-icon [icon]="X"></fa-icon>
          </div>
          <div class="absolute top-12 w-full flex justify-center">
            <div class="bg-main text-white text-4xl flex items-center justify-center min-w-24 w-24 h-24 rounded-full">
              @switch (usuario.rol) {
                @case ('SUPERADMIN') { <fa-icon [icon]="Super"></fa-icon> }
                @case ('BOSS') { <fa-icon [icon]="Boss"></fa-icon> }
                @case ('OPERATOR') { <fa-icon [icon]="Operator"></fa-icon> }
              }
            </div>
          </div>
        </div>
        <div class="bg-white text-center pt-10">
          <h2 class="text-xl font-semibold">{{ usuario.nombres }} {{ usuario.apellidos }}</h2>
          <p class="font-semibold text-sm text-main -mt-1">{{ '@' + usuario.usuario }}</p>
          <div class="text-neutral-500 text-sm flex flex-col gap-1 mt-1">
            @if (mapDependencia(usuario.dependenciaId)?.esArea) {
              <p><fa-icon [icon]="Area"></fa-icon> {{ mapDependencia(usuario.dependenciaId)?.nombre }}</p>
            } @else if (mapDependencia(usuario.dependenciaId)?.esArea === false) {
              <p><fa-icon [icon]="Obra"></fa-icon> {{ mapDependencia(usuario.dependenciaId)?.nombre }}</p>
            } @else {
              <p>Sin Asignar</p>
            }
            <p><fa-icon [icon]="Phone"></fa-icon> {{ usuario.telefono }}</p>
            <p><fa-icon [icon]="Mail"></fa-icon> {{ usuario.correo }}</p>
          </div>
          <hr class="my-4">
          <div class="flex gap-2">
            <div class="w-full bg-main/10 rounded-2xl p-2">
              <div class="flex gap-1 text-main text-xs font-semibold items-center justify-center">
                <fa-icon [icon]="Counter"></fa-icon> Contador
              </div>
              <p class="font-bold text-xl text-neutral-700">{{ usuario.contador }}</p>
            </div>
            <div class="w-full bg-main/10 rounded-2xl p-2">
              <div class="flex gap-1 text-main text-xs font-semibold items-center justify-center">
                <fa-icon [icon]="Tag"></fa-icon> Abreviatura
              </div>
              <p class="font-bold text-xl text-neutral-700">{{ usuario.abreviatura }}</p>
            </div>
          </div>
        </div>
        <div class="flex justify-center gap-2">
          <button type="button" (click)="close.emit()" class="btn-main">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class UsuarioProfileComponent {
  @Input() usuario!: Usuario;
  @Output() close = new EventEmitter<void>();

  private dependencias = inject(DependenciasService).dependencias;

  Super = faUserShield;
  Boss = faUserTie;
  Operator = faUser;
  Area = faBuilding;
  Obra = faHammer;
  Phone = faPhone;
  Mail = faEnvelope;
  Counter = faListOl;
  Tag = faTag;
  X = faTimes;

  mapDependencia(dependenciaId: string): Dependencia | undefined {
    return this.dependencias().find(dependencia => dependencia.id === dependenciaId);
  }
}