import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoalService } from '../../../core/services/goal.service';
import { PlayerService } from '../../../core/services/player.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CreateGoalPayload, Goal, GoalDifficulty } from '../../../core/models/goal.model';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss'
})
export class GoalsComponent implements OnInit {
  goalService = inject(GoalService);
  private playerService = inject(PlayerService);
  private notifications = inject(NotificationService);
  private fb = inject(FormBuilder);

  difficulties: { value: GoalDifficulty; label: string; xp: number; gold: number }[] = [
    { value: 'easy', label: 'EASY', xp: 50, gold: 25 },
    { value: 'medium', label: 'MEDIUM', xp: 120, gold: 60 },
    { value: 'hard', label: 'HARD', xp: 250, gold: 125 },
    { value: 'epic', label: 'EPIC', xp: 500, gold: 250 }
  ];

  filter = signal<'ACTIVE' | 'COMPLETED'>('ACTIVE');
  showForm = signal(false);
  newStepTitles = signal<Record<string, string>>({});

  visibleGoals = computed(() =>
    this.goalService.goals().filter(g => (this.filter() === 'COMPLETED' ? g.completed : !g.completed))
  );

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(500)],
    difficulty: ['medium' as GoalDifficulty, Validators.required],
    deadline: [''],
    steps: this.fb.nonNullable.array([this.fb.nonNullable.control('', Validators.required)])
  });

  get stepControls() {
    return (this.form.controls.steps as FormArray).controls;
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.goalService.loadGoals().subscribe({
      error: () => this.notifications.showAlert('COULD NOT LOAD GOALS', 'ERROR')
    });
  }

  rewardOf(value: GoalDifficulty) {
    return this.difficulties.find(d => d.value === value)!;
  }

  isOverdue(goal: Goal) {
    return !!goal.deadline && !goal.completed && new Date(goal.deadline).getTime() < Date.now();
  }

  // ---------- creating a goal ----------

  openForm() {
    this.form.reset({ title: '', description: '', difficulty: 'medium', deadline: '' });
    (this.form.controls.steps as FormArray).clear();
    this.addStepField();
    this.showForm.set(true);
  }

  addStepField() {
    (this.form.controls.steps as FormArray).push(this.fb.nonNullable.control('', Validators.required));
  }

  removeStepField(index: number) {
    const steps = this.form.controls.steps as FormArray;
    if (steps.length > 1) steps.removeAt(index);
  }

  createGoal() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload: CreateGoalPayload = {
      title: v.title.trim(),
      description: v.description.trim() || undefined,
      difficulty: v.difficulty,
      deadline: v.deadline || undefined,
      steps: v.steps.map(s => s.trim()).filter(Boolean)
    };
    if (payload.steps.length === 0) {
      this.notifications.showAlert('ADD AT LEAST ONE STEP', 'WARNING');
      return;
    }
    this.goalService.createGoal(payload).subscribe({
      next: () => {
        this.notifications.showAlert('GOAL CREATED', 'SUCCESS');
        this.showForm.set(false);
        this.load();
      },
      error: err => this.showError(err, 'COULD NOT CREATE GOAL')
    });
  }

  // ---------- working on a goal ----------

  toggleStep(goal: Goal, stepId: string) {
    this.goalService.toggleStep(goal._id, stepId).subscribe({
      next: res => {
        if (res.reward) {
          this.notifications.showAlert(
            `GOAL COMPLETED! +${res.reward.xp} XP, +${res.reward.gold} GOLD`,
            'SUCCESS'
          );
          // refresh level / gold shown in the top bar
          this.playerService.loadPlayer().subscribe();
        }
        this.load();
      },
      error: err => this.showError(err, 'COULD NOT UPDATE STEP')
    });
  }

  setNewStepTitle(goalId: string, value: string) {
    this.newStepTitles.update(m => ({ ...m, [goalId]: value }));
  }

  addStep(goal: Goal) {
    const title = (this.newStepTitles()[goal._id] || '').trim();
    if (!title) return;
    this.goalService.addStep(goal._id, title).subscribe({
      next: () => {
        this.setNewStepTitle(goal._id, '');
        this.load();
      },
      error: err => this.showError(err, 'COULD NOT ADD STEP')
    });
  }

  deleteGoal(goal: Goal) {
    if (!confirm(`Delete the goal "${goal.title}"?`)) return;
    this.goalService.deleteGoal(goal._id).subscribe({
      next: () => {
        this.notifications.showAlert('GOAL DELETED', 'SUCCESS');
        this.load();
      },
      error: err => this.showError(err, 'COULD NOT DELETE GOAL')
    });
  }

  private showError(err: any, fallback: string) {
    const msg = err?.error?.message;
    this.notifications.showAlert(Array.isArray(msg) ? msg.join(', ') : msg || fallback, 'ERROR');
  }
}
