import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';
import { Product, ProductDocument } from '../products/product.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviews: Model<ReviewDocument>,
    @InjectModel(Product.name) private products: Model<ProductDocument>,
  ) {}

  byProduct(productId: string) {
    return this.reviews.find({ productId }).sort({ createdAt: -1 }).lean().exec();
  }

  async add(productId: string, rating: number, text: string, author = 'Anonymous') {
    const review = await this.reviews.create({ productId, rating, text, author });
    const all = await this.reviews.find({ productId }).lean().exec();
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await this.products.findByIdAndUpdate(productId, { avgRating: avg }).exec();
    return review;
  }
}
