from sqlmodel import select
from models import ProductTable, FarmTable
from Product import Product
from Database import Database
from fastapi import HTTPException
from schemas import GetProductResponse



class Marketplace:
    def __init__(self):
        pass

    
    def addProduct(self, product: Product, farm_id: int):
        db_product = ProductTable(farm_id=farm_id, product_name=product._name, product_image=product._image,
                                  unit_price=product._price, stock_amount=product._stockAmount, 
                                  production_procedure=product._productionProcedure)
        
        db_product = Database.write(db_product)
        product._product_id = db_product.id
        return product

    
    def deleteProduct(self, product_id: int):
        query = select(ProductTable).where(ProductTable.id == product_id)
        db_product = Database.read_one(query=query)
        if not db_product:
            raise ValueError("Product not found in the database")
        Database.delete(db_product)
        return {"message" : f"{db_product.product_name} deleted successfully."}


    def browseProducts(self):
        query = select(ProductTable)
        productList = Database.read_all(query=query)

        if not productList:
            raise HTTPException(status_code=404, detail="No product found!!")

        productResponseList = list()
        for product in productList:
            farm_query = select(FarmTable).where(FarmTable.id == product.farm_id)
            farm = Database.read_one(query=farm_query)
            farm_name = farm.username if farm else "Unknown"
            farm_addresss = farm.address if farm else "Unknown"
            productResponseList.append(GetProductResponse(
                product_id=product.id,
                product_name=product.product_name,
                product_image=product.product_image,
                rating=product.rating,
                unit_price=product.unit_price,
                stock_amount=product.stock_amount,
                farm_name=farm_name,
                farm_addresss=farm_addresss,
                production_procedure=product.production_procedure
            )
        )
            
        return productResponseList
        
    
    def updateProductInfo():
        pass


    def searchProducts(self):
        pass
