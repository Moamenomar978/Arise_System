import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../core/services/player.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ShopItem, ShopService } from '../../../core/services/shop.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  playerService = inject(PlayerService);
  shopService = inject(ShopService);
  notificationService = inject(NotificationService);

  ngOnInit() {
    this.shopService.loadItems().subscribe({
      error: () => this.notificationService.showAlert('COULD NOT LOAD THE SHOP', 'ERROR')
    });
    this.playerService.loadPlayer().subscribe();
  }

  buyItem(item: ShopItem) {
    this.shopService.purchase(item._id).subscribe({
      next: () => {
        this.notificationService.showAlert(`Purchased ${item.name}`, 'SUCCESS');
        // refresh gold, HP, streak freezes and the inventory
        this.playerService.loadPlayer().subscribe();
      },
      error: err => {
        const msg = err?.error?.message;
        this.notificationService.showAlert(Array.isArray(msg) ? msg.join(', ') : msg || 'PURCHASE FAILED', 'ERROR');
      }
    });
  }
}
