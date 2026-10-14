import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ required: true }) productId: string;
  /** Variant ObjectId string. Empty/absent = base product. */
  @Prop({ default: '' }) variantId: string;
  /** Variant SKU snapshot for readable orders. */
  @Prop({ default: '' }) sku: string;
  @Prop({ required: true }) name: string;
  @Prop({ default: '' }) image: string;
  /** Server-validated unit price (never trust the client). */
  @Prop({ required: true }) price: number;
  @Prop({ required: true, min: 1 }) quantity: number;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) email: string;
  @Prop({ required: true }) phone: string;
  @Prop({ required: true }) address: string;
  @Prop({ required: true }) city: string;
  @Prop({ default: '' }) note: string;
  @Prop({ type: [OrderItemSchema], required: true }) items: OrderItem[];
  @Prop({ required: true }) total: number;
  @Prop({ default: 'placed' }) status: string;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
