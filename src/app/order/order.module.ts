import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { OrderController } from '../rest/controllers/order.controller';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: Order }
    ])
  ]
})
export class OrderModule { }
