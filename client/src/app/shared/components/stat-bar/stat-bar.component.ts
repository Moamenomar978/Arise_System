import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-bar.component.html',
  styleUrl: './stat-bar.component.scss'
})
export class StatBarComponent {
  @Input() label!: string;
  @Input() value!: number;
  @Input() max!: number;
  @Input() color: string = '#00d4ff';

  get percentage(): number {
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }
}
