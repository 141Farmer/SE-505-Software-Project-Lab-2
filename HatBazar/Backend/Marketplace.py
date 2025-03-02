from sqlmodel import select
from models import ProductTable
from Product import Product
from Database import Database



class Marketplace:
    def __init__(self):
        query = select(ProductTable)
        self.__productList = Database.read(query=query).all()

    
    def addProduct(self, product: Product):
        self.__productList.append(product)


    
    def deleteProduct(self, product: Product):
        if product in self.__productList:
            print("Yes the product is in the list and will be deleted.")
            self.__productList.remove(product)
        else:
            print("Product not found!!")


    def browseProducts(self):
        for product in self.__productList:
            print(product._name)


    def searchProducts(self):
        pass


alo = Product(name="Alo", description="Very good alo", price=30, stockAmount=30, productionProcedure="Emnitei hoice")
market = Marketplace()
market.addProduct(alo)
market.addProduct(Product(name="Potol", description="Very good alo", price=30, stockAmount=30, productionProcedure="Emnitei hoice"))
market.addProduct(Product(name="Morich", description="Very good alo", price=30, stockAmount=30, productionProcedure="Emnitei hoice"))
market.browseProducts()
market.deleteProduct(alo)
market.browseProducts()