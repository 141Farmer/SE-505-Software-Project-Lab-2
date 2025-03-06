
from fastapi.responses import RedirectResponse

class Payment:
    def __init__(self):
        self._payment_amount = None
        self._tran_id = None

    def makePayment(self, paymentAmount, tran_id):
        self._payment_amount = paymentAmount
        self._tran_id = tran_id

        