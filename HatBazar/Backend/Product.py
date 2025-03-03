from Farm import Farm

class Product:

    def __init__(self, name, image, description, price, stockAmount, productionProcedure, farm: Farm, rating=None):
        self._product_id = None
        self._name = name
        self._image = image
        self._description = description
        self._price = price
        self._stockAmount = stockAmount
        self._productionProcedure = productionProcedure
        self._farm = farm
        self._rating = rating


    def rateProduct(self, rating):
        self.__rating = rating


    def updateProduct(self):
        pass