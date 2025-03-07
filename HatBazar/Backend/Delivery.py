from sqlmodel import select
from Database import Database
from models import UserTable

class Delivery:
    def __init__(self, deliveryAddress = None, farmAddress = None):
        self._deliveryAddress = deliveryAddress
        self._farmAddress = None


    def confirmDelivery(self, username):
        query = select(UserTable).where(UserTable.username == username)
        




    def trackDelivery(self):
        pass
