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
  @Output() progress = new EventEmitter<{ id: string; amount: number }>();

  onComplete() {
    this.complete.emit(this.quest.id);
  }

  onAddProgress(value: string) {
    const amount = Math.floor(Number(value));
    if (!amount || amount < 1) return;
    this.progress.emit({ id: this.quest.id, amount });
  }

  percent(obj: { current: number; target: number }) {
    return obj.target ? Math.min(100, Math.round((obj.current / obj.target) * 100)) : 0;
  }
}
