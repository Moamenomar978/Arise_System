import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PenaltyDocument = Penalty & Document;

@Schema({ timestamps: true })
export class Penalty {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ default: false })
  resolved: boolean;
}

export const PenaltySchema = SchemaFactory.createForClass(Penalty);
