import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Inversion } from '../../interfaces/inversion';



@Component({
  selector: 'app-inversion-show-modal',
  imports: [],
  template: `
    <p>
      inversion-show-modal works!
    </p>
  `,
  styles: ``
})
export class InversionShowModalComponent {
  @Input() inversion!: Inversion;
  @Output() close = new EventEmitter<void>();
}
