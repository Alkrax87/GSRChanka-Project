import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleRight, faHouse } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-breadcrumb',
  imports: [FontAwesomeModule],
  template: `
    <div class="text-neutral-400 flex gap-1 items-center text-xs">
      <fa-icon [icon]="Home"></fa-icon>
      <fa-icon [icon]="Arrow"></fa-icon>
      <span>{{ path }}</span>
    </div>
  `,
  styles: ``,
})
export class BreadcrumbComponent {
  @Input() path!: string;

  Home = faHouse;
  Arrow = faAngleRight;
}