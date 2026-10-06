import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements AfterViewInit {
  @ViewChild('growthChart') growthChartRef!: ElementRef;

  ngAfterViewInit() {
    new Chart(this.growthChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Active Hunters',
          data: [12, 19, 15, 25, 22, 30, 45],
          borderColor: '#ffd700',
          backgroundColor: 'rgba(255,215,0,0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#e0e0e0', font: { family: 'Rajdhani' } } }
        },
        scales: {
          x: { ticks: { color: '#e0e0e0' }, grid: { color: 'rgba(255,255,255,0.1)' } },
          y: { ticks: { color: '#e0e0e0' }, grid: { color: 'rgba(255,255,255,0.1)' } }
        }
      }
    });
  }
}
