import { OrderItemProps } from "@/providers/order";

export function calculateTotalOrders(orders: OrderItemProps[]){
    return orders.reduce((acc, atual)=>{
        const itemTotal = parseFloat(atual.product.price) * parseFloat(atual.amount);
        return acc + itemTotal
    } ,0)
}