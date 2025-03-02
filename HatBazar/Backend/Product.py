

class Product:

    def __init__(self, name, description, price, stockAmount, productionProcedure, rating=None):
        self._name = name
        self.__description = description
        self.__price = price
        self.__stockAmount = stockAmount
        self.__productionProcedure = productionProcedure
        self.__rating = rating


    def rateProduct(self, rating):
        self.__rating = rating


    def updateProduct(self):
        pass