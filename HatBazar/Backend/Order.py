

class Order:
    def __init__(self):
        self._order_id = None
        self._orderItems = list()
        self._totalCost = 0
        self._payment_id= None



    def calculateTotalCost(self, ):
        for orderItem in self._orderItems:
            self._totalCost += orderItem.calculateSubtotal()

        return self._totalCost

    def addOrderItem(self, oderItems):
        self._orderItems.append(oderItems)

