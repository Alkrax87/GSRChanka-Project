import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [NavbarComponent, FontAwesomeModule, ReactiveFormsModule],
  template: `
    <div class="w-full h-screen">
      <div class="relative h-screen">
        <!-- Background -->
        <img loading="lazy" class="absolute inset-0 w-full h-full object-cover z-0" src="https://www.pacuchaglamping.com/wp-content/uploads/2022/09/plaza-andahuaylas.jpeg" alt="MAIN-image">
        <div class="absolute bg-black inset-0 bg-opacity-70 z-10"></div>
        <!-- Top Content -->
        <div class="relative z-20">
          <app-navbar></app-navbar>
        </div>
        <div class="absolute flex justify-center items-center h-full inset-0 z-10">
          <div class="bg-white flex p-2 rounded-2xl shadow-md">
            <!-- Left Side -->
            <div class="content-center max-h-full w-72 rounded-md relative">
              <div class="relative flex items-center justify-center z-20">
                <img class="rounded-full z-10" src="https://pbs.twimg.com/profile_images/1223279373542993920/rtXA6v2o_200x200.jpg" alt="GSRCHANKA-logo">
              </div>
              <img loading="lazy" class="absolute rounded-xl inset-0 w-full h-full object-cover z-0" src="https://www.pacuchaglamping.com/wp-content/uploads/2022/09/plaza-andahuaylas.jpeg" alt="MAIN-image">
              <div class="absolute bg-black inset-0 rounded-xl bg-opacity-70 z-10"></div>
            </div>
            <!-- Right -->
            <div class="py-20 px-16 rounded-xl text-center">
              <h1 class="text-main font-bold text-3xl">Bienvenido!</h1>
              <p class="text-neutral-400 text-sm">Inicia sesión usando tu usuario y contraseña.</p>
              <!-- Form -->
               <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
                 <div class="flex flex-col gap-4 pt-8">
                   <div>
                     <label for="username" class="relative">
                       <input id="username" type="text" formControlName="username" placeholder="" autocomplete="false" class="bg-white text-gray-500 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none"/>
                       <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Usuario</span>
                     </label>
                   </div>
                   <div>
                     <label for="password" class="relative">
                       <input id="password" type="password" formControlName="password" placeholder="" autocomplete="false" class="bg-white text-gray-500 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none"/>
                       <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Contraseña</span>
                     </label>
                   </div>
                 </div>
                 <!-- Error -->
                 <p class="text-red-500 text-sm h-8 content-center">{{ errorMessage }}</p>
                 <!-- Button -->
                 <button type="submit" class="bg-main hover:bg-main-hover text-white shadow-sm w-full font-semibold px-4 py-3 rounded-full cursor-pointer outline-none">
                   <fa-icon [icon]="Login"></fa-icon> &nbsp;&nbsp;Ingresar
                 </button>
               </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  loginForm!: FormGroup;
  errorMessage: string = '';
  Login = faRightToBracket;

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    try {
      const userCredential = await this.authService.login(username, password);
      this.router.navigate(['/portal']);
    } catch (error: any) {
      this.errorMessage = 'El usuario o contraseña son incorrectos.';
    }
  }
}