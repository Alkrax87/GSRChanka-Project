import { Component } from '@angular/core';

@Component({
  selector: 'app-topbar',
  imports: [],
  template: `
    <div class="h-16 w-full bg-neutral-800 text-white flex items-center p-5 flex-shrink-0 sticky top-0 z-50">
      <p>topbar works!</p>
    </div>
  `,
  styles: ``,
})
export class TopbarComponent {}