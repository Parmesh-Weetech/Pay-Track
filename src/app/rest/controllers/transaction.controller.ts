import { Controller, Get, Query } from "@nestjs/common";
import { ListTransactionReqDTO } from "../dtos/request/transaction-list-req.dto";
import { TransactionListResponse } from "../dtos/response/transaction-response.dto";
import { TransactionService } from "../../transaction/transaction.service";
import { LogAround } from "src/app/common/logger/log-around";

@Controller({ path: 'transactions' })
export class TransactionController {

    constructor(private readonly transactionService: TransactionService) { }
    @Get()
    @LogAround({
        ignoreReturn: true
    })
    async listTransactions(
        @Query() query: ListTransactionReqDTO
    ): Promise<TransactionListResponse> {
        return await this.transactionService.listTransactions(query);
    }
}