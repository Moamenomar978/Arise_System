import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AchievementDocument = Achievement & Document;

@Schema({ timestamps: true })
export class Achievement {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  // Id of the achievement in the catalog (achievements.catalog.ts)
  @Prop()
  code: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  icon: string;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
// One unlock per player per achievement (old documents without a code are ignored)
AchievementSchema.index(
  { userId: 1, code: 1 },
  { unique: true, partialFilterExpression: { code: { $type: 'string' } } },
);
