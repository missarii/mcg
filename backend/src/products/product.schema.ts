import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: true })
export class ProductVariant {
  @Prop({ required: true, trim: true }) name: string;
  /** Unique per-product SKU, e.g. "PENCIL-5MM" */
  @Prop({ required: true, trim: true }) sku: string;
  @Prop({ default: '' }) image: string;
  @Prop({ required: true, min: 0 }) price: number;
  @Prop({ required: true, min: 0, default: 0 }) stock: number;
  @Prop({ default: '' }) description: string;
  @Prop({ default: false }) soldOut: boolean;
}
export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true }) name: string;
  @Prop({ default: 'https://via.placeholder.com/300' }) image: string;
  @Prop({ required: true }) description: string;
  @Prop({ required: true, min: 0 }) price: number;
  /** Base stock — used when the product has NO variants. */
  @Prop({ required: true, min: 0, default: 0 }) stock: number;
  @Prop({ default: false }) soldOut: boolean;
  @Prop({ default: '' }) badge: string;
  @Prop({ default: 0 }) avgRating: number;
  /** Embedded variants. Empty array = legacy single-product behavior. */
  @Prop({ type: [ProductVariantSchema], default: [] }) variants: Types.DocumentArray<ProductVariant>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

