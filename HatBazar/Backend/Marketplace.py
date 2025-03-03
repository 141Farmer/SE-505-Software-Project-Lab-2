from sqlmodel import select
from models import ProductTable
from Product import Product
from Database import Database
from fastapi import HTTPException



class Marketplace:
    def __init__(self):         #lagbe na. Eita pass kore dileoy
        query = select(ProductTable)
        self.__productList = Database.read_all(query=query)

    
    def addProduct(self, product: Product, farm_id: int):
        db_product = ProductTable(farm_id=farm_id, product_name=product._name, product_image=product._image,
                                  unit_price=product._price, stock_amount=product._stockAmount, 
                                  production_procedure=product._productionProcedure)
        
        db_product = Database.write(db_product)
        print("product id from db_product: ", db_product.id)
        product._product_id = db_product.id
        # self.__productList.append(product)        #Dorker nai
        return product


    
    def deleteProduct(self, product: Product):    #sesh hoy nai
        query = select(ProductTable).where(ProductTable.product_name == product._name)   #better find using id as it is unique
        db_product = Database.read_one(query=query)
        if not db_product:
            raise ValueError("Product not found in the database")
        Database.delete(db_product)
        self.__productList.remove(product)
        if product in self.__productList:
            print("Yes the product is in the list and will be deleted.")
            self.__productList.remove(product)
        else:
            print("Product not found!!")


    def browseProducts(self):
        if not self.__productList:
            raise HTTPException(status_code=404, detail="No product found!!")
    
        print("Available Products:")
        list_of_product_info = list()
        for product in self.__productList:
            list_of_product_info.append(f"Name: {product.product_name}, Price: {product.unit_price}, Stock: {product.stock_amount}")

        return list_of_product_info

    def searchProducts(self):
        pass


# alo = Product(name="Alo", image="/url/alo", description="Very good alo", price=30, stockAmount=30, productionProcedure="Emnitei hoice")
# market = Marketplace()
# market.addProduct(alo, 7)
# # market.addProduct(Product(name="Potol", image="/url/potol" description="Very good alo", price=30, stockAmount=30, productionProcedure="Emnitei hoice"))
# # market.addProduct(Product(name="Morich", description="Very good alo", price=30, stockAmount=30, productionProcedure="Emnitei hoice"))
# market.browseProducts()
# market.deleteProduct(alo)
# market.browseProducts()