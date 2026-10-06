import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  users = [
    { id: '1', hunterName: 'Sung Jin-Woo', email: 'jinwoo@hunter.org', role: 'ADMIN', status: 'ACTIVE' },
    { id: '2', hunterName: 'Cha Hae-In', email: 'haein@hunter.org', role: 'USER', status: 'ACTIVE' },
    { id: '3', hunterName: 'Choi Jong-In', email: 'jongin@hunter.org', role: 'USER', status: 'ACTIVE' }
  ];

  editUser(id: string) {}
  banUser(id: string) {}
}
