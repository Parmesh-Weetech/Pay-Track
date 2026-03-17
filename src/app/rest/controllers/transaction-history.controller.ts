import { Controller, Get, Param, Query } from "@nestjs/common";
import { LogAround } from "src/app/common/logger/log-around";
import { TransactionHistoryService } from "src/app/transaction_history/transaction_history.service";
import { ListTransactionHistoryReqDTO } from "../dtos/request/transaction-history-list-req.dto";
import { TransactionHistoryListResponse, TransactionHistoryResponse } from "../dtos/response/transaction-history-res.dto";

@Controller({ path: 'transaction-history' })
export class TransactionHistoryController {
    constructor(private readonly transactionHistoryService: TransactionHistoryService) { }
    @Get()
    @LogAround({
        ignoreReturn: true
    })
    async listTransactionHistories(
        @Query() query: ListTransactionHistoryReqDTO
    ): Promise<TransactionHistoryListResponse> {
        return await this.transactionHistoryService.listTransactionHistories(query);
    }

    @Get(':historyId')
    @LogAround({
        ignoreReturn: true
    })
    async getTransactionHistoryDetails(
        @Param('historyId') historyId: string,
    ): Promise<TransactionHistoryResponse> {
        return await this.transactionHistoryService.getTransactionHistoryDetails(
            historyId
        )
    }
}