import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FontAwesomeModule],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: ``,
})
export class AppComponent {
  Gear = faGear;
  title = 'GSRChanka-Project';
}
