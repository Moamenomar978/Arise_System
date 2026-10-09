import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShopItemDocument = ShopItem & Document;

export const SHOP_EFFECTS = ['heal', 'xp', 'statpoint', 'pardon', 'streakfreeze', 'none'] as const;

@Schema({ timestamps: true })
export class ShopItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  imageUrl: string;

  @Prop({ default: '🎁' })
  icon: string;

  // heal       -> restores `effectValue` HP (9999 = full)
  // xp         -> gives `effectValue` XP
  // statpoint  -> gives `effectValue` stat points
  // pardon     -> gets the player out of the Penalty Zone
  // streakfreeze -> adds `effectValue` streak freezes
  // none       -> just goes to the inventory (cosmetic / collectible)
  @Prop({ enum: SHOP_EFFECTS, default: 'none' })
  effectType: string;

  @Prop({ default: 0 })
  effectValue: number;
}

export const ShopItemSchema = SchemaFactory.createForClass(ShopItem);
