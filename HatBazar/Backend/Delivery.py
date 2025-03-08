from sqlmodel import select
from Database import Database
from models import UserTable, DeliveryTable

class Delivery:
    def __init__(self, farm_address = None, delivery_address = None, delivery_status = None):
        self._deliveryID  = None
        self._delivery_address = delivery_address
        self._farm_address = farm_address
        self._delivery_status = delivery_status







    def confirmDelivery(self, orderItem_id):
        delivery_db = DeliveryTable(
            order_item_id=orderItem_id,
            farm_address=self._farm_address,
            delivery_address=self._delivery_address,
            delivery_status=self._delivery_status
        )
        delivery_db_entry = Database.write(delivery_db)
        self._deliveryID = delivery_db_entry.id
        return delivery_db_entry
        




    def trackDelivery(self):
        pass
