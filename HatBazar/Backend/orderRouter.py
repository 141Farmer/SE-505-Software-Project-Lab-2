from pydantic import BaseModel
from fastapi import APIRouter, Depends
from typing import List, Optional
from sqlmodel import select
from AuthHandler import AuthHandler
from Database import Database
from models import OrderTable, UserTable, ProductTable, PaymentTable, OrderItemTable, DeliveryTable
from OrderItem import OrderItem
from Order import Order

order_router = APIRouter(prefix='/order', tags=['Order'])



class Product(BaseModel):
    product_id: int
    quantity: int

class OrderRequest(BaseModel):
    delivery_address: str
    tran_id: str
    products: List[Product]

@order_router.post("/")
async def receive_order(order: OrderRequest, current_user = Depends(AuthHandler.get_current_user)):
    
    order_items  = [(product.product_id, product.quantity) for product in order.products] 
    delivery_adddress = order.delivery_address
    tran_id = order.tran_id

    query = select(UserTable).where(UserTable.username == current_user.username)
    user_id = Database.read_one(query).id

    payment_id_query = select(PaymentTable).where(PaymentTable.tran_id == tran_id)
    payment_id = Database.read_one(query=payment_id_query).id

    order_object = Order()
    for order_item in order_items:
        order_item_object = OrderItem(order_item[0], order_item[1])
        order_object.addOrderItem(order_item_object)

    order_db = OrderTable(user_id=user_id, payment_id=payment_id, total_cost=order_object.calculateTotalCost())
    order_db_entry = Database.write(order_db)
    order_object._order_id = order_db_entry.id


    for orderItem in order_object._orderItems:
        orderItem_db = OrderItemTable(
            order_id=order_db_entry.id,
            product_id=orderItem._product_id,
            product_quantity=orderItem._quantity,
            item_price=orderItem._subtotal
        )
        orderItem_db_entry = Database.write(orderItem_db)

        orderItem._orderItem_id = orderItem_db_entry.id
        orderItem.manageDeliveryDetail(delivery_adddress)

        orderItem.updateProduct()
        orderItem.updateFarmAccount(payment_id)


    print(order_items)
    print(delivery_adddress)
    return {"message" : "Order successfull"}

