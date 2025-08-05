import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faGear, faWindowMaximize } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-topbar',
  imports: [FontAwesomeModule],
  template: `
    <div class="h-16 w-full bg-neutral-100 shadow-md text-lg flex items-center pl-2 pr-4 py-2 flex-shrink-0 sticky top-0 z-30">
      <div class="flex items-center justify-center -rotate-90 cursor-pointer hover:bg-neutral-200 rounded-lg w-7 h-7">
        <fa-icon [icon]="Toggle" class="text-neutral-700"></fa-icon>
      </div>
      <div class="w-full flex justify-end gap-2">
        <div class="relative flex items-center justify-center gap-1 cursor-pointer hover:bg-neutral-200 rounded-lg w-fit h-7 px-2">
          @if (notificationsCount) {
            <div class="absolute -top-1.5 -right-0.5 rounded-full h-4 min-w-4 px-1 bg-main text-[10px] text-white font-semibold text-center flex items-center justify-center">
              {{ notificationsCount < 100 ? notificationsCount : '99+' }}
            </div>
          }
          <fa-icon [icon]="Notifications" class="text-neutral-700"></fa-icon>
        </div>
        <div class="flex items-center justify-center cursor-pointer hover:bg-neutral-200 rounded-lg w-7 h-7">
          <fa-icon [icon]="Configuration" class="text-neutral-700"></fa-icon>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class TopbarComponent {
  notificationsCount = 28;

  Toggle = faWindowMaximize;
  Notifications = faBell;
  Configuration = faGear;
}