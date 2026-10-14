import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ReviewsService } from './reviews.service';

class CreateReviewDto {
  @IsInt() @Min(1) @Max(5) rating: number;
  @IsString() text: string;
  @IsOptional() @IsString() author?: string;
}

@Controller('api/products/:id/reviews')
export class ReviewsController {
  constructor(private service: ReviewsService) {}

  @Get()
  list(@Param('id') id: string) {
    return this.service.byProduct(id);
  }

  @Post()
  add(@Param('id') id: string, @Body() dto: CreateReviewDto) {
    return this.service.add(id, dto.rating, dto.text, dto.author || 'Anonymous');
  }
}
