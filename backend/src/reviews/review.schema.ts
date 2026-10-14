import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true, index: true })
  productId: Types.ObjectId;
  @Prop({ required: true, min: 1, max: 5 }) rating: number;
  @Prop({ required: true }) text: string;
  @Prop({ default: 'Anonymous' }) author: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
