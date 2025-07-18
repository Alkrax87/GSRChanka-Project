import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="w-screen h-screen bg-neutral-800 flex justify-center items-center">
      <!-- Left -->
      <div class="bg-cyan-500 flex justify-center items-center w-full max-w-sm h-[480px] rounded-xl p-10">
        <img src="https://placehold.co/200x200" alt="MAIN-logo" />
      </div>
      <!-- Right -->
      <div class="bg-white w-full max-w-sm rounded-xl p-10 relative -left-5">
        <h1 class="text-center text-3xl font-semibold">Bienvenido!</h1>
        <p class="text-neutral-400 text-center text-sm">Inicia sesión en tu cuenta</p>
        @if (errorMessage) {
          <div class="bg-red-100 text-red-500 flex gap-2 text-xs px-2 py-1 my-4">
            <p class="">{{ errorMessage }}</p>
            <button (click)="!errorMessage = ''">&times;</button>
          </div>
        }
        <!-- Form -->
        <form [formGroup]="loginForm" (ngSubmit)="loginUser()">
          <div class="flex flex-col gap-4 mt-4 mb-6">
            <div>
              <label for="username" class="text-neutral-600 block text-xs">Usuario</label>
              <input id="username" type="text" formControlName="username" autocomplete="off"
                class="outline-neutral-200 focus:outline-cyan-500 border-neutral-200 text-neutral-800 duration-300 border rounded-2xl w-full py-2 px-3"
              >
            </div>
            <div>
              <label for="password" class="text-neutral-600 block text-xs">Contraseña</label>
              <input id="password" type="password" formControlName="password" autocomplete="off"
                class="outline-neutral-200 focus:outline-cyan-500 border-neutral-200 text-neutral-800 duration-300 border rounded-2xl w-full py-2 px-3"
              >
            </div>
          </div>
          <div>
            <button [disabled]="loginForm.invalid"
              class="hover:bg-opacity-90 text-white w-full font-semibold py-3 rounded-2xl duration-300"
              [ngClass]="{'bg-cyan-500': !loginForm.invalid, 'bg-neutral-200': loginForm.invalid}"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder) {
    this.loginForm = fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async loginUser() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor ingresa sus credenciales correctamente.';
    }

    console.log('user: ', this.loginForm.value.username);
    console.log('password: ', this.loginForm.value.password);
  }
}