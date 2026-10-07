import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuestProgressDocument = QuestProgress & Document;

@Schema({ timestamps: true })
export class QuestProgress {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Quest', required: true })
  questId: string;

  // Identifies the day / week the progress belongs to, so daily and weekly
  // quests reset on their own: '2026-10-06', '2026-W41' or 'once'.
  @Prop({ required: true, default: 'once' })
  periodKey: string;

  @Prop({ default: 0 })
  currentAmount: number;

  @Prop({ default: false })
  completed: boolean;
}

export const QuestProgressSchema = SchemaFactory.createForClass(QuestProgress);
QuestProgressSchema.index({ userId: 1, questId: 1, periodKey: 1 }, { unique: true });
