import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { IsArray, IsEmail, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Order, OrderDocument } from './order.schema';
import { Product, ProductDocument } from '../products/product.schema';
import { AdminGuard } from '../auth/admin.guard';

class OrderItemDto {
  @IsString() productId: string;
  @IsOptional() @IsString() variantId?: string;
  @IsNumber() @Min(1) quantity: number;
  // Legacy clients may still send name/price — they are IGNORED for validation.
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsNumber() price?: number;
}

class CreateOrderDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsString() phone: string;
  @IsString() address: string;
  @IsString() city: string;
  @IsOptional() @IsString() note?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto) items: OrderItemDto[];
}

@Controller('api/orders')
export class OrdersController {
  constructor(
    @InjectModel(Order.name) private orders: Model<OrderDocument>,
    @InjectModel(Product.name) private products: Model<ProductDocument>,
  ) {}

  /**
   * Variant-safe checkout:
   * - re-reads price/stock from MongoDB (never trusts client)
   * - atomically decrements ONLY the purchased variant (or base stock)
   * - fails the whole order with 400 if any line lacks stock (prevents overselling)
   */
  @Post()
  async create(@Body() dto: CreateOrderDto) {
    if (!dto.items?.length) throw new BadRequestException('Order must contain at least one item.');

    const validatedItems: Array<{
      productId: string; variantId: string; sku: string;
      name: string; image: string; price: number; quantity: number;
    }> = [];

    for (const item of dto.items) {
      if (!Types.ObjectId.isValid(item.productId)) {
        throw new BadRequestException(`Invalid product id: ${item.productId}`);
      }
      const qty = Math.floor(item.quantity);
      if (!qty || qty < 1) throw new BadRequestException('Quantity must be at least 1.');

      const product = await this.products.findById(item.productId).exec();
      if (!product) throw new BadRequestException(`Product not found: ${item.productId}`);

      const variantId = (item.variantId || '').trim();
      if (product.variants?.length) {
        // Product HAS variants → a variant is required
        const variant = product.variants.find((v: any) => String(v._id) === variantId);
        if (!variantId || !variant) {
          throw new BadRequestException(`Please select a valid variant for "${product.name}".`);
        }
        if (variant.soldOut || (variant.stock ?? 0) < qty) {
          throw new BadRequestException(`"${variant.name}" only has ${variant.stock} left in stock.`);
        }
        // Atomic decrement — only succeeds if stock is still sufficient (concurrency-safe)
        const updated = await this.products.findOneAndUpdate(
          { _id: product._id, 'variants._id': (variant as any)._id, 'variants.stock': { $gte: qty } },
          {
            $inc: { 'variants.$.stock': -qty },
            $set: { 'variants.$.soldOut': (variant.stock - qty) <= 0 },
          },
          { new: true },
        ).exec();
        if (!updated) {
          throw new BadRequestException(`"${variant.name}" just sold out. Please adjust your cart.`);
        }
        validatedItems.push({
          productId: String(product._id), variantId: String((variant as any)._id),
          sku: variant.sku || '', name: `${product.name} — ${variant.name}`,
          image: variant.image || product.image, price: variant.price, quantity: qty,
        });
      } else {
        // Legacy single product — base stock path (unchanged behavior)
        if (product.soldOut || (product.stock ?? 0) < qty) {
          throw new BadRequestException(`"${product.name}" only has ${product.stock} left in stock.`);
        }
        const updated = await this.products.findOneAndUpdate(
          { _id: product._id, stock: { $gte: qty } },
          { $inc: { stock: -qty } },
          { new: true },
        ).exec();
        if (!updated) throw new BadRequestException(`"${product.name}" just sold out.`);
        if ((updated.stock ?? 0) <= 0) {
          await this.products.updateOne({ _id: product._id }, { $set: { soldOut: true } }).exec();
        }
        validatedItems.push({
          productId: String(product._id), variantId: '', sku: '',
          name: product.name, image: product.image, price: product.price, quantity: qty,
        });
      }
    }

    const total = validatedItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const order = await this.orders.create({
      name: dto.name, email: dto.email, phone: dto.phone,
      address: dto.address, city: dto.city, note: dto.note || '',
      items: validatedItems, total,
    });
    return order;
  }

  @UseGuards(AdminGuard)
  @Get()
  list() {
    return this.orders.find().sort({ createdAt: -1 }).lean().exec();
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.orders.findByIdAndUpdate(id, { status: body.status }, { new: true }).exec();
  }
}

