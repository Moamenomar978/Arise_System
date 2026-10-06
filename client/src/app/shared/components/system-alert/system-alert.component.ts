import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-alert.component.html',
  styleUrls: ['./system-alert.component.scss']
})
export class SystemAlertComponent {
  public notificationService = inject(NotificationService);
}
