import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/topbar/topbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [SidebarComponent, TopbarComponent, RouterOutlet],
  template: `
    <div class="min-h-screen bg-background">
      <app-sidebar [isOpen]="sidebarIsOpen"[mobileOpen]="mobileSidebarOpen" (closeMobile)="mobileSidebarOpen = false"></app-sidebar>
      <div class="min-h-screen transition-[padding] duration-300 ease-out" [class.md:pl-56]="sidebarIsOpen" [class.md:pl-16]="!sidebarIsOpen">
        <app-topbar [sidebarOpen]="sidebarIsOpen" (toggleSidebar)="toggleSidebar()"></app-topbar>
        <main class="min-w-0 overflow-x-hidden">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: ``,
})
export class MainComponent {
  private document = inject(DOCUMENT);

  sidebarIsOpen = true;
  mobileSidebarOpen = false;

  toggleSidebar(): void {
    if (this.document.defaultView?.matchMedia('(min-width: 768px)').matches) {
      this.sidebarIsOpen = !this.sidebarIsOpen;
      return;
    }

    this.sidebarIsOpen = true;
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
  }
}