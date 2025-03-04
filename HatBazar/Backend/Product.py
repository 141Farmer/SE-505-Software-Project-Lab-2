from Farm import Farm

class Product:

    def __init__(self, name, package_detail, image, price, stockAmount, productionProcedure, farmName, farmAddress, rating=None):
        self._product_id = None
        self._name = name
        self._package_detail = package_detail
        self._image = image
        self._price = price
        self._stockAmount = stockAmount
        self._productionProcedure = productionProcedure
        self._farmName = farmName
        self._farmAddress = farmAddress
        self._rating = rating


    def rateProduct(self, rating):
        self.__rating = rating
        

    def updateProduct(self):
        pass