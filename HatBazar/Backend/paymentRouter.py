from fastapi import APIRouter, Depends
from Payment import Payment
from AuthHandler import AuthHandler



payment_router = APIRouter()

payment = Payment()

@payment_router.get("/")
def makePayment(payment_amount : float, current_user = Depends(AuthHandler.get_current_user)):
    
    return payment.makePayment(payment_amount)


@payment_router.get("/successful")
def payment_successful():
    payment.storePaymentInfos()
    return {"message": "Payment successful"}


@payment_router.get("/failed")
def payment_failed():
    return {"message": "Payment failed"}


@payment_router.get("/cancelled")
def payment_cancelled():
    return {"message": "Payment cancelled"}
