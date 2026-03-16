import { OrderSchema } from "../../order/schemas/order.schema";

export class OrderList {
    items: OrderSchema[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}