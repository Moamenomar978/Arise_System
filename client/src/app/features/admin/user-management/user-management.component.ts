import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUser, AdminUserService } from '../../../core/services/admin-user.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  adminUsers = inject(AdminUserService);
  private authService = inject(AuthService);
  private notifications = inject(NotificationService);

  search = signal('');

  filteredUsers = computed(() => {
    const q = this.search().trim().toLowerCase();
    const list = this.adminUsers.users();
    if (!q) return list;
    return list.filter(u => u.hunterName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.adminUsers.loadUsers().subscribe({
      error: () => this.notifications.showAlert('COULD NOT LOAD USERS', 'ERROR')
    });
  }

  isMe(user: AdminUser) {
    return user.id === this.authService.currentUser()?.id;
  }

  resetProgress(user: AdminUser) {
    const ok = confirm(
      `Reset ${user.hunterName}'s progress?\n\nLevel, XP, gold, stats and rank go back to the starting values. This cannot be undone.`
    );
    if (!ok) return;
    this.adminUsers.resetProgress(user.id).subscribe({
      next: () => {
        this.notifications.showAlert(`${user.hunterName.toUpperCase()} HAS BEEN RESET`, 'SUCCESS');
        this.load();
      },
      error: err => this.showError(err, 'RESET FAILED')
    });
  }

  deleteUser(user: AdminUser) {
    const ok = confirm(
      `Delete ${user.hunterName} (${user.email})?\n\nThe account, player profile, quest progress and goals will be permanently deleted.`
    );
    if (!ok) return;
    this.adminUsers.deleteUser(user.id).subscribe({
      next: () => {
        this.notifications.showAlert(`${user.hunterName.toUpperCase()} DELETED`, 'SUCCESS');
        this.load();
      },
      error: err => this.showError(err, 'DELETE FAILED')
    });
  }

  private showError(err: any, fallback: string) {
    const msg = err?.error?.message;
    this.notifications.showAlert(Array.isArray(msg) ? msg.join(', ') : msg || fallback, 'ERROR');
  }
}
