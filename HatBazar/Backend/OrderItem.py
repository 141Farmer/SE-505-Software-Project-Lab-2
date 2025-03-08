from Database import Database
from sqlmodel import select
from models import ProductTable, DeliveryTable,  FarmTable, PaymentTable, AccountTable
from Delivery import Delivery


class OrderItem:
    def __init__(self, product_id= None, quantity= None):
        self._orderItem_id =  None
        self._product_id  = product_id
        self._delivery_id = None
        self._quantity = quantity
        self._subtotal = None

    def calculateSubtotal(self):
        query = select(ProductTable).where(ProductTable.id == self._product_id)
        product = Database.read_one(query)
        self._subtotal = product.unit_price * self._quantity
        return self._subtotal



    def manageDeliveryDetail(self, delivery_address):
        query = select(ProductTable).where(ProductTable.id == self._product_id)
        product_db = Database.read_one(query)
        query = select(FarmTable).where(FarmTable.id == product_db.farm_id)
        farm_db = Database.read_one(query)
        farm_address = farm_db.address
        delivery = Delivery(
            farm_address=farm_address, delivery_address=delivery_address, delivery_status="processing"
        )
        return delivery.confirmDelivery(orderItem_id=self._orderItem_id)
         

    def updateProduct(self):
        old_product = Database.read_one(select(ProductTable).where(ProductTable.id == self._product_id))
        old_product.stock_amount -= self._quantity
        Database.update(old_product)
        
    
    def updateFarmAccount(self, payment_id):
        payment_db = Database.read_one(select(PaymentTable).where(PaymentTable.id == payment_id))
        product_db = Database.read_one(select(ProductTable).where(ProductTable.id == self._product_id))
        farm_db = Database.read_one(select(FarmTable).where(FarmTable.id == product_db.farm_id))

        query = select(AccountTable).where(AccountTable.username == farm_db.username)
        old_account = Database.read_one(query=query)
        if not old_account:
            db_new_account = AccountTable(username=farm_db.username, balance_sales=self._subtotal, total_balance=self._subtotal)
            Database.write(db_new_account)
            return {"message": "Payment infos stored successfully."}

        
        old_account.balance_sales += self._subtotal
        old_account.total_balance += self._subtotal
        Database.update(old_account)                         


    
