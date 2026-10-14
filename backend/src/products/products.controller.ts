import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Get()
  list(@Query('search') search = '', @Query('inStock') inStock = 'true') {
    return this.service.list(search, inStock !== 'false');
  }

  @Get('top-rated')
  topRated() {
    return this.service.topRated();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
