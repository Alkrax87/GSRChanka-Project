import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  template: `
    <div class="w-64 bg-main h-[100vh] p-5 fixed left-0 top-0 text-white z-50">
      <p>sidebar works!</p>
    </div>
  `,
  styles: ``,
})
export class SidebarComponent {}