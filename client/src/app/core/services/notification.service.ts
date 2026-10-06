import { Injectable, signal } from '@angular/core';

export interface SystemAlert {
  id: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  alerts = signal<SystemAlert[]>([]);

  showAlert(message: string, type: SystemAlert['type'] = 'INFO') {
    const alert: SystemAlert = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type
    };
    
    this.alerts.update(current => [...current, alert]);

    setTimeout(() => {
      this.removeAlert(alert.id);
    }, 4000);
  }

  removeAlert(id: string) {
    this.alerts.update(current => current.filter(a => a.id !== id));
  }
}
