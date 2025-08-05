import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-log-out',
  imports: [],
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
          <button (click)="onCancel()" class="hover:bg-neutral-50 border border-neutral-200 rounded-lg px-5 py-1.5 font-semibold">
            Cancel
          </button>
          <button (click)="onLogOut()" class="bg-main hover:bg-opacity-80 text-white rounded-lg px-5 py-1.5 font-semibold">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class LogOutComponent {
  constructor(private authService: AuthService) {}

  @Output() cancel = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }

  onLogOut() {
    this.authService.logOut();
  }
}