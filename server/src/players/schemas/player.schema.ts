import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({ timestamps: true })
export class Player {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  currentXP: number;

  @Prop({ default: 'E' })
  rank: string;

  @Prop({ default: 100 })
  hp: number;

  @Prop({ default: 100 })
  maxHp: number;

  @Prop({ default: 0 })
  gold: number;

  @Prop({ default: 0 })
  statPoints: number;

  @Prop({ type: Object, default: { strength: 1, agility: 1, intelligence: 1, perception: 1, vitality: 1 } })
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    perception: number;
    vitality: number;
  };

  @Prop({ default: false })
  inPenaltyZone: boolean;

  // When the player pressed "enter" in the penalty zone (starts the timer)
  @Prop({ type: Date })
  penaltyStartedAt?: Date;

  // ----- streak -----
  @Prop({ default: 0 })
  streak: number;

  @Prop({ default: 0 })
  bestStreak: number;

  // Local date ("YYYY-MM-DD") of the last day a daily quest was completed
  @Prop({ default: '' })
  lastActiveDate: string;

  // Each freeze protects the streak (and HP) for one missed day
  @Prop({ default: 0 })
  streakFreezes: number;

  // ----- shop -----
  @Prop({ default: 0 })
  purchases: number;

  @Prop({
    type: [{ itemId: String, name: String, icon: String, quantity: { type: Number, default: 1 } }],
    default: [],
  })
  inventory: { itemId: string; name: string; icon?: string; quantity: number }[];
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
