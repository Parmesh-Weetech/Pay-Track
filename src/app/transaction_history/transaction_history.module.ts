import { Module } from '@nestjs/common';
import { TransactionHistoryService } from './transaction_history.service';
import { TransactionHistoryController } from '../rest/controllers/transaction-history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionHistory } from './schemas/transaction_history.schema';

@Module({
  providers: [TransactionHistoryService],
  controllers: [TransactionHistoryController],
  imports: [
    MongooseModule.forFeature([
      { name: 'TransactionHistory', schema: TransactionHistory }
    ])
  ]
})
export class TransactionHistoryModule { }
