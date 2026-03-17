import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
require('dotenv').config();

import { User as UserMongooseSchema, UserSchema as UserDocument } from "../src/app/user/schemas/user.schema";
import { Product as ProductMongooseSchema, ProductSchema as ProductDocument } from "../src/app/product/schemas/product.schema";
import { Cart as CartMongooseSchema, CartSchema as CartDocument } from "../src/app/cart/schemas/cart.schema";
import { Order as OrderMongooseSchema, OrderSchema as OrderDocument } from "../src/app/order/schemas/order.schema";
import { Transaction as TransactionMongooseSchema, TransactionSchema as TransactionDocument } from "../src/app/transaction/schemas/transaction.schema";
import { TransactionHistory as TransactionHistoryMongooseSchema, TransactionHistorySchema as TransactionHistoryDocument } from "../src/app/transaction_history/schemas/transaction_history.schema";
import { SeedCart, SeedOrder, SeedProduct, SeedTransaction, SeedUser } from "./type";
import { UserStatus } from "../src/app/user/types/user-status";
import { CartStatus } from "../src/app/cart/types/cart-status";
import { OrderStatus } from "../src/app/order/types/order-status";
import { PaymentStatus } from "../src/app/order/types/payment-status";
import { PaymentMethod } from "../src/app/transaction/types/payment-method";
import { TransactionStatus } from "../src/app/transaction/types/transaction-status";

const MONGO_URL = process.env.MONGO_URL;

const BATCH = 5000;
const TOTAL = 100000;
const HISTORY_PER_TRANSACTION = 1;

const UserModel =
    mongoose.models.User ?? mongoose.model<UserDocument>("User", UserMongooseSchema);
const ProductModel =
    mongoose.models.Product ?? mongoose.model<ProductDocument>("Product", ProductMongooseSchema);
const CartModel =
    mongoose.models.Cart ?? mongoose.model<CartDocument>("Cart", CartMongooseSchema);
const OrderModel =
    mongoose.models.Order ?? mongoose.model<OrderDocument>("Order", OrderMongooseSchema);
const TransactionModel =
    mongoose.models.Transaction ?? mongoose.model<TransactionDocument>("Transaction", TransactionMongooseSchema);
const TransactionHistoryModel =
    mongoose.models.TransactionHistory ??
    mongoose.model<TransactionHistoryDocument>("TransactionHistory", TransactionHistoryMongooseSchema);

async function seedUsers() {
    console.log("Seeding users...");
    const existing = await UserModel.countDocuments();
    if (existing >= TOTAL) {
        console.log(`Users already at ${existing}, skipping.`);
        return;
    }
    const remaining = TOTAL - existing;

    for (let i = 0; i < remaining; i += BATCH) {
        const users: SeedUser[] = [];
        const batchSize = Math.min(BATCH, remaining - i);

        for (let j = 0; j < batchSize; j++) {
            const uniqueId = existing + i + j;
            users.push({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: `user_${uniqueId}@example.com`,
                status: faker.helpers.arrayElement(Object.values(UserStatus))
            });
        }

        await UserModel.insertMany(users, { ordered: false });
        console.log(`Inserted users: ${existing + i + batchSize}`);
    }
}

async function seedProducts() {
    console.log("Seeding products...");
    const existing = await ProductModel.countDocuments();
    if (existing >= TOTAL) {
        console.log(`Products already at ${existing}, skipping.`);
        return;
    }
    const remaining = TOTAL - existing;

    const categories = ["electronics", "fashion", "home", "books"];

    for (let i = 0; i < remaining; i += BATCH) {
        const products: SeedProduct[] = [];
        const batchSize = Math.min(BATCH, remaining - i);

        for (let j = 0; j < batchSize; j++) {
            products.push({
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.number.int({ min: 50, max: 5000 }),
                category: faker.helpers.arrayElement(categories),
                isAvailable: faker.datatype.boolean()
            });
        }

        await ProductModel.insertMany(products);
        console.log(`Inserted products: ${existing + i + batchSize}`);
    }
}

async function seedOrdersTransactions() {
    console.log("Seeding orders + transactions...");
    const existingOrders = await OrderModel.countDocuments();
    const existingTransactions = await TransactionModel.countDocuments();
    const existingHistories = await TransactionHistoryModel.countDocuments();
    if (existingOrders >= TOTAL && existingTransactions >= TOTAL) {
        console.log(`Orders at ${existingOrders}, transactions at ${existingTransactions}, skipping.`);
        return;
    }
    const remainingOrders = Math.max(0, TOTAL - existingOrders);
    const remainingTransactions = Math.max(0, TOTAL - existingTransactions);
    const remainingHistories = Math.max(0, TOTAL - existingHistories);
    const remaining = Math.max(remainingOrders, remainingTransactions);

    const users = await UserModel.find()
        .select("_id")
        .lean();
    const products = await ProductModel.find()
        .select("_id price")
        .lean();

    if (users.length === 0 || products.length === 0) {
        console.log("Users or products missing; skipping orders/transactions.");
        return;
    }

    for (let i = 0; i < remaining; i += BATCH) {
        const orders: SeedOrder[] = [];
        const transactions: SeedTransaction[] = [];
        const histories: Array<{
            transactionId: mongoose.Types.ObjectId;
            previousState: string;
            newState: string;
            changedBy: string;
            reason: string;
        }> = [];
        const batchSize = Math.min(BATCH, remaining - i);

        for (let j = 0; j < batchSize; j++) {

            const user = faker.helpers.arrayElement(users);

            const items = Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() => {
                const product = faker.helpers.arrayElement(products);
                const quantity = faker.number.int({ min: 1, max: 5 });

                return {
                    productId: product._id,
                    quantity,
                    price: product.price,
                    subTotal: product.price * quantity
                };
            });

            const totalPrice = items.reduce((sum, i) => sum + i.subTotal, 0);

            const orderId = new mongoose.Types.ObjectId();
            const transactionId = new mongoose.Types.ObjectId();
            const transactionStatus = faker.helpers.arrayElement(Object.values(TransactionStatus));

            if (existingOrders + i + j < TOTAL) {
                orders.push({
                    _id: orderId,
                    userId: user._id,
                    items,
                    orderNumber: faker.string.uuid(),
                    orderStatus: faker.helpers.arrayElement(Object.values(OrderStatus)),
                    paymentStatus: faker.helpers.arrayElement(Object.values(PaymentStatus)),
                    totalPrice
                });
            }

            if (existingTransactions + i + j < TOTAL) {
                transactions.push({
                    _id: transactionId,
                    orderId,
                    userId: user._id,
                    transactionNumber: faker.string.uuid(),
                    paymentMethod: faker.helpers.arrayElement(Object.values(PaymentMethod)),
                    transactionStatus,
                    totalAmount: totalPrice,
                    history: [
                        {
                            transactionId,
                            previousState: TransactionStatus.PENDING,
                            newState: transactionStatus,
                            changedBy: "system",
                            reason: "status updated"
                        }
                    ]
                });
            }

            if (existingHistories + histories.length < TOTAL) {
                for (let h = 0; h < HISTORY_PER_TRANSACTION; h++) {
                    if (existingHistories + histories.length >= TOTAL) break;
                    histories.push({
                        transactionId,
                        previousState: TransactionStatus.PENDING,
                        newState: transactionStatus,
                        changedBy: "system",
                        reason: "status updated"
                    });
                }
            }
        }

        if (orders.length > 0) {
            await OrderModel.insertMany(orders, { ordered: false });
        }
        if (transactions.length > 0) {
            await TransactionModel.insertMany(transactions, { ordered: false });
        }
        if (histories.length > 0) {
            await TransactionHistoryModel.insertMany(histories, { ordered: false });
        }

        const ordersInserted = Math.min(existingOrders + i + batchSize, TOTAL);
        const txInserted = Math.min(existingTransactions + i + batchSize, TOTAL);
        const historyInserted = Math.min(existingHistories + i + batchSize, TOTAL);
        console.log(`Inserted orders: ${ordersInserted}, transactions: ${txInserted}, histories: ${historyInserted}`);
    }
}

async function seedCarts() {
    console.log("Seeding carts...");
    const existing = await CartModel.countDocuments();
    if (existing >= TOTAL) {
        console.log(`Carts already at ${existing}, skipping.`);
        return;
    }
    const remaining = TOTAL - existing;

    const users = await UserModel.find()
        .select("_id")
        .lean();
    const products = await ProductModel.find()
        .select("_id price")
        .lean();

    if (users.length === 0 || products.length === 0) {
        console.log("Users or products missing; skipping carts.");
        return;
    }

    for (let i = 0; i < remaining; i += BATCH) {
        const carts: SeedCart[] = [];
        const batchSize = Math.min(BATCH, remaining - i);

        for (let j = 0; j < batchSize; j++) {
            const user = faker.helpers.arrayElement(users);

            const items = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() => {
                const product = faker.helpers.arrayElement(products);
                const quantity = faker.number.int({ min: 1, max: 3 });

                return {
                    productId: product._id,
                    quantity,
                    price: product.price
                };
            });

            const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

            carts.push({
                userId: user._id,
                items,
                totalItem: items.length,
                totalPrice,
                status: faker.helpers.arrayElement(Object.values(CartStatus))
            });
        }

        await CartModel.insertMany(carts, { ordered: false });

        console.log(`Inserted carts: ${existing + i + batchSize}`);
    }
}

async function seedTransactionHistories() {
    console.log("Backfilling transaction histories if needed...");
    const existing = await TransactionHistoryModel.countDocuments();
    if (existing >= TOTAL) {
        console.log(`Transaction histories already at ${existing}, skipping.`);
        return;
    }
    const remaining = TOTAL - existing;
    const existingIds = new Set<string>(
        (await TransactionHistoryModel.distinct("transactionId")).map(String)
    );
    const transactions = await TransactionModel.find()
        .select("_id transactionStatus")
        .limit(TOTAL)
        .lean();
    if (transactions.length === 0) {
        console.log("No transactions found; skipping transaction history backfill.");
        return;
    }

    const histories: Array<{
        transactionId: mongoose.Types.ObjectId;
        previousState: string;
        newState: string;
        changedBy: string;
        reason: string;
    }> = [];

    for (const tx of transactions) {
        if (histories.length >= remaining) break;
        if (existingIds.has(String(tx._id))) continue;
        histories.push({
            transactionId: tx._id,
            previousState: TransactionStatus.PENDING,
            newState: tx.transactionStatus ?? TransactionStatus.PENDING,
            changedBy: "system",
            reason: "status updated"
        });
    }

    if (histories.length > 0) {
        await TransactionHistoryModel.insertMany(histories, { ordered: false });
        console.log(`Inserted transaction histories: ${existing + histories.length}`);
    }
}

async function run() {
    await mongoose.connect(MONGO_URL!);

    console.log("MongoDB connected");

    await seedUsers();
    await seedProducts();
    await seedOrdersTransactions();
    await seedCarts();
    await seedTransactionHistories();

    console.log("Seeding completed");

    await mongoose.disconnect();
}

run();
