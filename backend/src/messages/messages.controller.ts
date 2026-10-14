import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IsEmail, IsString } from 'class-validator';
import { Message, MessageDocument } from './message.schema';
import { AdminGuard } from '../auth/admin.guard';

class CreateMessageDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsString() message: string;
}

@Controller('api/messages')
export class MessagesController {
  constructor(@InjectModel(Message.name) private model: Model<MessageDocument>) {}

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.model.create(dto);
  }

  @UseGuards(AdminGuard)
  @Get()
  list() {
    return this.model.find().sort({ createdAt: -1 }).lean().exec();
  }
}
