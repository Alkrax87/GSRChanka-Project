import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-log-out',
  imports: [FontAwesomeModule],
  template: `
    <div class="bg-black bg-opacity-70 fixed inset-0 z-50 flex justify-center items-center select-none">
      <div class="bg-white p-5 rounded-xl w-full max-w-md">
        <h3 class="text-lg font-semibold">
          ¿Estás seguro que quieres cerrar sesión?
        </h3>
        <p class="text-neutral-500 text-sm mt-2 mb-4">
          Tu sesión se cerrará y volverás a la página de inicio.
        </p>
        <div class="flex justify-end gap-2">
          <button (click)="onCancel()" class="bg-neutral-100 hover:bg-neutral-200/75 px-4 py-2 rounded-full">Cancelar</button>
          <button (click)="onLogOut()" class="bg-main hover:bg-main-hover text-white flex items-center gap-2 px-4 py-2 rounded-full">
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

  onCancel() { this.cancel.emit() }

  onLogOut() { this.authService.logOut() }
}