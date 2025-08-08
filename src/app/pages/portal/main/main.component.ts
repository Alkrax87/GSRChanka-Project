import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [CommonModule, SidebarComponent, TopbarComponent, RouterOutlet],
  template: `
    <div class="flex h-screen">
      <app-sidebar (sidebarStatus)="changeSideBarStatus($event)"></app-sidebar>
      <div class="w-full duration-300" [ngClass]="{ 'pl-64': sidebarIsOpen, 'pl-12': !sidebarIsOpen }">
        <app-topbar></app-topbar>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: ``,
})
export class MainComponent {
  sidebarIsOpen: boolean = true;

  changeSideBarStatus(status: boolean) {
    this.sidebarIsOpen = status;
  }
}