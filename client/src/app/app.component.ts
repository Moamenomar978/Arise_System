import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SystemAlertComponent } from './shared/components/system-alert/system-alert.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SystemAlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
}
