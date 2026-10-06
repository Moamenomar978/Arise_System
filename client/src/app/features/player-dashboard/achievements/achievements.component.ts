import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})
export class AchievementsComponent {
  achievements = [
    { id: '1', title: 'First Blood', description: 'Defeat your first monster', unlocked: true, icon: '⚔️' },
    { id: '2', title: 'Survivor', description: 'Survive a hidden dungeon', unlocked: true, icon: '🛡️' },
    { id: '3', title: 'Shadow Monarch', description: 'Extract your first shadow', unlocked: false, icon: '👤' },
    { id: '4', title: 'S-Rank Hunter', description: 'Reach S-Rank', unlocked: false, icon: '👑' }
  ];
}
