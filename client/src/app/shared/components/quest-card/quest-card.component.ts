import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quest } from '../../../core/models/quest.model';
import { RankBadgeComponent } from '../rank-badge/rank-badge.component';

@Component({
  selector: 'app-quest-card',
  standalone: true,
  imports: [CommonModule, RankBadgeComponent],
  templateUrl: './quest-card.component.html',
  styleUrl: './quest-card.component.scss'
})
export class QuestCardComponent {
  @Input() quest!: Quest;
  @Output() complete = new EventEmitter<string>();

  onComplete() {
    this.complete.emit(this.quest.id);
  }
}
