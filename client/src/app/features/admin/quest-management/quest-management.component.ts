import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminQuest, QuestPayload, QuestService } from '../../../core/services/quest.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-quest-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quest-management.component.html',
  styleUrl: './quest-management.component.scss'
})
export class QuestManagementComponent implements OnInit {
  questService = inject(QuestService);
  private notifications = inject(NotificationService);
  private fb = inject(FormBuilder);

  types = ['daily', 'weekly', 'main', 'special'];
  ranks = ['E', 'D', 'C', 'B', 'A', 'S'];

  showForm = signal(false);
  editingId = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    type: ['daily', Validators.required],
    rank: ['E', Validators.required],
    targetAmount: [1, [Validators.required, Validators.min(1)]],
    rewardXp: [50, [Validators.required, Validators.min(0)]],
    rewardGold: [20, [Validators.required, Validators.min(0)]],
    isActive: [true]
  });

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.questService.loadAdminQuests().subscribe({
      error: () => this.notifications.showAlert('COULD NOT LOAD QUESTS', 'ERROR')
    });
  }

  openCreate() {
    this.editingId.set(null);
    this.form.reset({ title: '', description: '', type: 'daily', rank: 'E', targetAmount: 1, rewardXp: 50, rewardGold: 20, isActive: true });
    this.showForm.set(true);
  }

  openEdit(q: AdminQuest) {
    this.editingId.set(q._id);
    this.form.reset({
      title: q.title,
      description: q.description,
      type: q.type,
      rank: q.rank,
      targetAmount: q.targetAmount,
      rewardXp: q.rewardXp,
      rewardGold: q.rewardGold,
      isActive: q.isActive !== false
    });
    this.showForm.set(true);
  }

  cancel() {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue() as QuestPayload;
    const id = this.editingId();
    const request = id ? this.questService.updateQuest(id, payload) : this.questService.createQuest(payload);

    request.subscribe({
      next: () => {
        this.notifications.showAlert(id ? 'QUEST UPDATED' : 'QUEST CREATED', 'SUCCESS');
        this.cancel();
        this.refresh();
      },
      error: (err) => {
        const msg = err?.error?.message;
        this.notifications.showAlert(Array.isArray(msg) ? msg.join(', ') : msg || 'SAVE FAILED', 'ERROR');
      }
    });
  }

  toggleActive(q: AdminQuest) {
    this.questService.updateQuest(q._id, { isActive: !q.isActive }).subscribe({
      next: () => this.refresh(),
      error: () => this.notifications.showAlert('UPDATE FAILED', 'ERROR')
    });
  }

  remove(q: AdminQuest) {
    if (!confirm(`Delete quest "${q.title}"? Player progress on it will be deleted too.`)) return;
    this.questService.deleteQuest(q._id).subscribe({
      next: () => {
        this.notifications.showAlert('QUEST DELETED', 'SUCCESS');
        this.refresh();
      },
      error: () => this.notifications.showAlert('DELETE FAILED', 'ERROR')
    });
  }
}
