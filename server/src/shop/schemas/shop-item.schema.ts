import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShopItemDocument = ShopItem & Document;

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
}

export const ShopItemSchema = SchemaFactory.createForClass(ShopItem);
