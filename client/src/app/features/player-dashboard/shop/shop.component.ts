import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../core/services/player.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  playerService = inject(PlayerService);
  notificationService = inject(NotificationService);

  items = [
    { id: '1', name: 'Health Potion', desc: 'Restores 500 HP', price: 100, icon: '💊' },
    { id: '2', name: 'Mana Potion', desc: 'Restores 300 MP', price: 150, icon: '🧪' },
    { id: '3', name: 'Return Stone', desc: 'Escape any dungeon', price: 1000, icon: '💎' },
    { id: '4', name: "Knight's Sword", desc: '+20 Strength', price: 5000, icon: '🗡️' }
  ];

  buyItem(item: any) {
    const player = this.playerService.player();
    if (player && player.gold >= item.price) {
      this.notificationService.showAlert(`Purchased ${item.name}`, 'SUCCESS');
      // Typically would call api.post('/shop/buy') here
    } else {
      this.notificationService.showAlert('Not enough gold', 'ERROR');
    }
  }
}
