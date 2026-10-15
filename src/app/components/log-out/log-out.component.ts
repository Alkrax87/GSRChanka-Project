import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { faArrowRightFromBracket, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-log-out',
  imports: [FontAwesomeModule],
  template: `
    <div class="modal">
      <div class="card-modal w-96">
        <div class="flex justify-between">
          <h2 class="card-title">Cerrar Sesión</h2>
          <div class="flex items-center cursor-pointer hover:text-neutral-600" (click)="cancel.emit()">
            <fa-icon [icon]="X"></fa-icon>
          </div>
        </div>
        <p class="text-neutral-500 text-center text-sm">
          ¿Estás seguro que quieres cerrar sesión?
        </p>
        <div class="flex justify-center gap-2">
          <button (click)="cancel.emit()" class="btn btn-cancel">Cancelar</button>
          <button (click)="onLogOut()" class="btn bg-red-600 hover:bg-red-500 text-white">
            <fa-icon [icon]="LogOut"></fa-icon> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class LogOutComponent {
  @Output() cancel = new EventEmitter<void>();

  private authService = inject(AuthService);

  LogOut = faArrowRightFromBracket;
  X = faTimes;

  onLogOut() { this.authService.logOut() }
}