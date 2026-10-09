import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GoalDocument = Goal & Document;

export const GOAL_DIFFICULTIES = ['easy', 'medium', 'hard', 'epic'] as const;

@Schema({ timestamps: true })
export class Goal {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ enum: GOAL_DIFFICULTIES, default: 'medium' })
  difficulty: string;

  @Prop({ type: Date })
  deadline?: Date;

  @Prop({
    type: [{ title: { type: String, required: true }, done: { type: Boolean, default: false } }],
    default: [],
  })
  steps: { _id?: any; title: string; done: boolean }[];

  @Prop({ default: false })
  completed: boolean;

  @Prop({ type: Date })
  completedAt?: Date;

  // Reward actually paid when the goal was completed
  @Prop({ default: 0 })
  rewardXp: number;

  @Prop({ default: 0 })
  rewardGold: number;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
