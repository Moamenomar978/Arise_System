import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  registerForm = this.fb.group({
    hunterName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      const { hunterName, email, password } = this.registerForm.value;
      // The server's RegisterDto expects `username`, not `hunterName`
      this.authService.register({ username: hunterName, email, password }).subscribe({
        next: () => {
          this.notificationService.showAlert('HUNTER REGISTERED SUCCESSFULLY', 'SUCCESS');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          const msg = err?.error?.message;
          this.notificationService.showAlert(
            Array.isArray(msg) ? msg.join(', ') : msg || 'REGISTRATION FAILED',
            'ERROR'
          );
        }
      });
    }
  }
}
