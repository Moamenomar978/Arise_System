import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

Chart.register(...registerables);

interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalQuests: number;
  totalCompletions: number;
  totalGoals: number;
  goalsCompleted: number;
  inPenaltyZone: number;
  averageLevel: number;
  rankDistribution: Record<string, number>;
  activeByDay: { date: string; count: number }[];
  signupsByDay: { date: string; count: number }[];
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private notifications = inject(NotificationService);

  @ViewChild('growthChart') growthChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rankChart') rankChartRef!: ElementRef<HTMLCanvasElement>;

  stats = signal<AdminStats | null>(null);
  newThisWeek = signal(0);

  private charts: Chart[] = [];

  ngOnInit() {
    this.api.get<AdminStats>('/admin/stats').subscribe({
      next: s => {
        this.stats.set(s);
        this.newThisWeek.set(s.signupsByDay.reduce((sum, d) => sum + d.count, 0));
        // wait for the canvases to be rendered
        setTimeout(() => this.drawCharts(s));
      },
      error: () => this.notifications.showAlert('COULD NOT LOAD ANALYTICS', 'ERROR')
    });
  }

  ngOnDestroy() {
    this.charts.forEach(c => c.destroy());
  }

  private drawCharts(s: AdminStats) {
    if (!this.growthChartRef || !this.rankChartRef) return;

    const axis = {
      x: { ticks: { color: '#e0e0e0' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { beginAtZero: true, ticks: { color: '#e0e0e0', precision: 0 }, grid: { color: 'rgba(255,255,255,0.1)' } }
    };
    const legend = { labels: { color: '#e0e0e0', font: { family: 'Rajdhani' } } };

    this.charts.push(
      new Chart(this.growthChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: s.activeByDay.map(d => d.date.slice(5)),
          datasets: [
            {
              label: 'Active Hunters',
              data: s.activeByDay.map(d => d.count),
              borderColor: '#ffd700',
              backgroundColor: 'rgba(255,215,0,0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'New Hunters',
              data: s.signupsByDay.map(d => d.count),
              borderColor: '#00d4ff',
              backgroundColor: 'rgba(0,212,255,0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: { responsive: true, plugins: { legend }, scales: axis }
      })
    );

    const ranks = ['E', 'D', 'C', 'B', 'A', 'S'];
    this.charts.push(
      new Chart(this.rankChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: ranks.map(r => `${r}-Rank`),
          datasets: [
            {
              label: 'Hunters',
              data: ranks.map(r => s.rankDistribution[r] ?? 0),
              backgroundColor: 'rgba(255,215,0,0.5)',
              borderColor: '#ffd700',
              borderWidth: 1
            }
          ]
        },
        options: { responsive: true, plugins: { legend }, scales: axis }
      })
    );
  }
}
