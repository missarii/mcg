import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private model: Model<ProductDocument>) {}

  list(search = '', inStockOnly = true) {
    const filter: any = {};
    if (inStockOnly) filter.soldOut = false;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    return this.model.find(filter).sort({ createdAt: -1 }).lean().exec();
  }

  topRated(limit = 3) {
    return this.model.find({ soldOut: false }).sort({ avgRating: -1 }).limit(limit).lean().exec();
  }

  async get(id: string) {
    const p = await this.model.findById(id).lean().exec();
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  create(dto: CreateProductDto) {
    return this.model.create(dto);
  }

  async update(id: string, dto: UpdateProductDto) {
    const p = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async remove(id: string) {
    const p = await this.model.findByIdAndDelete(id).exec();
    if (!p) throw new NotFoundException('Product not found');
    return { deleted: true };
  }
}
