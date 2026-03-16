import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from '../rest/controllers/transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';

@Module({
  providers: [TransactionService],
  controllers: [TransactionController],
  imports: [
    MongooseModule.forFeature([
      { name: 'Transaction', schema: Transaction }
    ])
  ]
})
export class TransactionModule { }
