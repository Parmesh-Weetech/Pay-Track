import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { UserModule } from "../user/user.module";
import { CartModule } from "../cart/cart.module";
import { OrderModule } from "../order/order.module";
import { ProductModule } from "../product/product.module";
import { TransactionModule } from "../transaction/transaction.module";
import { TransactionHistoryModule } from "../transaction_history/transaction_history.module";

@Module({
    imports: [
        UserModule,
        CartModule,
        OrderModule,
        ProductModule,
        TransactionModule,
        TransactionHistoryModule
    ]
})
export class RestModule { }