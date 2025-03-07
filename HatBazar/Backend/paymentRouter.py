from fastapi import FastAPI, HTTPException, APIRouter, Depends, Request
from fastapi.responses import RedirectResponse
from Payment import Payment
from AuthHandler import AuthHandler
from pydantic import BaseModel


payment_router = APIRouter(prefix="/payment", tags=["Payment"])


class GetPayment(BaseModel):
    payment_amount: float


payment = Payment()


@payment_router.post("/")
def makePayment(paymentReq: GetPayment, current_user = Depends(AuthHandler.get_current_user)):
    return payment.makePayment(paymentReq.payment_amount)

@payment_router.post("/storepaymentinfos")
def storePaymentInfos(paymentInfos: GetPayment, current_user = Depends(AuthHandler.get_current_user)):
    return payment.storePaymentInfos(paymentInfos.payment_amount, current_user.username)


@payment_router.post("/successful")
def payment_successful():
    return RedirectResponse(url="http://localhost:5173/payment-success", status_code=302)   #without status code = 302 error "method not allowed"


@payment_router.post("/failed")
def payment_failed():
    return RedirectResponse(url="http://localhost:5173/payment-failure", status_code=302)

@payment_router.post("/cancelled")
def payment_cancelled():
    return RedirectResponse(url="http://localhost:5173/payment-cancelled", status_code=302)