import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from '../rest/controllers/product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: Product }
    ])
  ]
})
export class ProductModule { }
