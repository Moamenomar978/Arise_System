import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rank-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rank-badge.component.html',
  styleUrl: './rank-badge.component.scss'
})
export class RankBadgeComponent {
  @Input() rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' = 'E';
}
