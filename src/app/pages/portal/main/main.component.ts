import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { TopbarComponent } from "../../../components/topbar/topbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [CommonModule, SidebarComponent, TopbarComponent, RouterOutlet],
  template: `
  <div class="flex h-screen overflow-hidden">
    <app-sidebar></app-sidebar>
    <div class="flex flex-col flex-1 ml-64 h-full">
      <app-topbar></app-topbar>
      <div class="flex-1 overflow-y-auto">
       <router-outlet></router-outlet>
      </div>
    </div>
  </div>
  `,
  styles: ``,
})
export class MainComponent {}