import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from '../rest/controllers/cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';

@Module({
  providers: [CartService],
  controllers: [CartController],
  imports: [
    MongooseModule.forFeature([
      { name: 'Cart', schema: Cart }
    ])
  ]
})
export class CartModule { }
