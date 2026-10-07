import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestDocument = Quest & Document;

export const QUEST_TYPES = ['daily', 'weekly', 'main', 'special'] as const;
export const QUEST_RANKS = ['E', 'D', 'C', 'B', 'A', 'S'] as const;

@Schema({ timestamps: true })
export class Quest {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  // daily  -> resets every day
  // weekly -> resets every week
  // main   -> one-time story quest
  // special-> one-time hidden / boss quest
  @Prop({ required: true, enum: QUEST_TYPES })
  type: string;

  @Prop({ enum: QUEST_RANKS, default: 'E' })
  rank: string;

  @Prop({ required: true, default: 1 })
  targetAmount: number;

  @Prop({ required: true, default: 0 })
  rewardXp: number;

  @Prop({ required: true, default: 0 })
  rewardGold: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const QuestSchema = SchemaFactory.createForClass(Quest);
