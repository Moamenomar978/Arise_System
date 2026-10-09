import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api.service';

export interface ShopItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  effectType: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private api = inject(ApiService);

  items = signal<ShopItem[]>([]);

  loadItems() {
    return this.api.get<ShopItem[]>('/shop/items').pipe(tap(list => this.items.set(list)));
  }

  purchase(itemId: string) {
    return this.api.post<{ success: boolean; item: ShopItem; remainingGold: number }>(
      `/shop/purchase/${itemId}`,
      {}
    );
  }
}
