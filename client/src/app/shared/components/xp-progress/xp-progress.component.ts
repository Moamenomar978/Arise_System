import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-xp-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './xp-progress.component.html',
  styleUrl: './xp-progress.component.scss'
})
export class XpProgressComponent {
  @Input() xp: number = 0;
  @Input() maxXp: number = 100;
  @Input() level: number = 1;

  get percentage(): number {
    return Math.min(100, Math.max(0, (this.xp / this.maxXp) * 100));
  }

  get strokeDashoffset(): number {
    const circumference = 2 * Math.PI * 45; // r=45
    return circumference - (this.percentage / 100) * circumference;
  }
}
