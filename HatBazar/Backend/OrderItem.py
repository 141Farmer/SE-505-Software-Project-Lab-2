from fastapi import BackgroundTasks
from Database import Database
from sqlmodel import select
from models import ProductTable, UserTable, FarmTable, PaymentTable, AccountTable
from Delivery import Delivery
from Notification import Notification


class OrderItem:
    def __init__(self, product_id=None, quantity=None):
        self._orderItem_id = None
        self._product_id = product_id
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
    
    def updateFarmAccount(self, payment_id, background_tasks: BackgroundTasks):
        payment_db = Database.read_one(select(PaymentTable).where(PaymentTable.id == payment_id))
        product_db = Database.read_one(select(ProductTable).where(ProductTable.id == self._product_id))
        farm_db = Database.read_one(select(FarmTable).where(FarmTable.id == product_db.farm_id))
        user_db = Database.read_one(select(UserTable).where(UserTable.username == farm_db.username))
        
        content = f'''We're thrilled to inform you that your products have been purchased on HATBAZAR! Here are the details of your recent sales:

- **Product Name**: {product_db.product_name}
- **Quantity Sold**: {self._quantity}
- **Total Earnings**: {product_db.unit_price*self._quantity}

This is a fantastic achievement and a testament to the quality of your organic produce. Keep up the great work, and continue to inspire others in our farming community!

If you have more products to list, now is the perfect time to update your inventory and attract even more customers.

Thank you for being a valued member of HATBAZAR. Together, we're growing a greener future!'''
        
        notification = Notification("🎉 Congratulations! Your Products Have Been Sold!", content)
        
        # Send and store notification
        notification.sendNotification(background_tasks, user_db.email, "🎉 Congratulations! Your Products Have Been Sold!")
        notification.storeNotification(user_db.email)
        
        # Update account
        query = select(AccountTable).where(AccountTable.username == farm_db.username)
        old_account = Database.read_one(query=query)
        if not old_account:
            db_new_account = AccountTable(username=farm_db.username, balance_sales=self._subtotal, total_balance=self._subtotal)
            Database.write(db_new_account)
            return {"message": "Payment infos stored successfully."}
        
        old_account.balance_sales += self._subtotal
        old_account.total_balance += self._subtotal
        Database.update(old_account)
        return {"message": "Account updated successfully."}