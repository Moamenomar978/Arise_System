import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-penalty-zone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './penalty-zone.component.html',
  styleUrl: './penalty-zone.component.scss'
})
export class PenaltyZoneComponent {
  constructor(private router: Router) {}

  survive() {
    this.router.navigate(['/dashboard']);
  }
}
