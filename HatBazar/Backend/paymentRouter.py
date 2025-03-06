from fastapi import FastAPI, HTTPException, APIRouter, Depends, Request
from sslcommerz_lib import SSLCOMMERZ
from fastapi.responses import RedirectResponse
import os
from Payment import Payment
from uuid import uuid4
from AuthHandler import AuthHandler
from pydantic import BaseModel


payment_router = APIRouter()

sslcz = SSLCOMMERZ({
    'store_id': os.getenv('SSLCOMMERZ_STORE_ID'),
    'store_pass': os.getenv('SSLCOMMERZ_STORE_PASS'),
    'issandbox': True
})


class GetPaymentRequest(BaseModel):
    payment_amount: float

payment = Payment()

@payment_router.post("/")
def redirect_to_gateway(paymentReq: GetPaymentRequest, current_user = Depends(AuthHandler.get_current_user)):#paymentAmount: float, current_user = Depends(AuthHandler.get_current_user)):

    payment_amount = paymentReq.payment_amount

    tran_id = uuid4()
    data = {
        'total_amount': f"{payment_amount}",
        'currency': "BDT",
        'tran_id': f"{tran_id}",
        'success_url': "http://127.0.0.1:8000/payment/successful",  # if transaction is successful, user will be redirected here
        'fail_url': "http://127.0.0.1:8000/payment/failed",  # if transaction is failed, user will be redirected here
        'cancel_url': "http://127.0.0.1:8000/payment/cancelled",  # after user cancels the transaction, will be redirected here
        'emi_option': "0",
        'cus_name': "test",
        'cus_email': "kibria8007@gmail.com",
        'cus_phone': "01700000000",
        'cus_add1': "customer address",
        'cus_city': "Dhaka",
        'cus_country': "Bangladesh",
        'shipping_method': "NO",
        'multi_card_name': "",
        'num_of_item': 1,
        'product_name': "Test",
        'product_category': "Test Category",
        'product_profile': "general",
    }

    try:
        response = sslcz.createSession(data)
        if response['status'] == 'SUCCESS':
            return RedirectResponse(url=response["GatewayPageURL"])
        else:
            raise HTTPException(status_code=400, detail="Failed to create payment session")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




# @payment_router.get("/")
# def redirect_to_gateway():
#     # paymentAmount: float

#     tran_id = uuid4()
#     data = {
#         'total_amount': f"{10000}",
#         'currency': "BDT",
#         'tran_id': f"{tran_id}",
#         'success_url': "http://127.0.0.1:8000/payment/successful",  # if transaction is successful, user will be redirected here
#         'fail_url': "http://127.0.0.1:8000/payment/failed",  # if transaction is failed, user will be redirected here
#         'cancel_url': "http://127.0.0.1:8000/payment/cancelled",  # after user cancels the transaction, will be redirected here
#         'emi_option': "0",
#         'cus_name': "test",
#         'cus_email': "kibria8007@gmail.com",
#         'cus_phone': "01700000000",
#         'cus_add1': "customer address",
#         'cus_city': "Dhaka",
#         'cus_country': "Bangladesh",
#         'shipping_method': "NO",
#         'multi_card_name': "",
#         'num_of_item': 1,
#         'product_name': "Test",
#         'product_category': "Test Category",
#         'product_profile': "general",
#     }

#     try:
#         response = sslcz.createSession(data)
#         if response['status'] == 'SUCCESS':
#             return RedirectResponse(url=response["GatewayPageURL"])
#         else:
#             raise HTTPException(status_code=400, detail="Failed to create payment session")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


@payment_router.post("/successful")
def payment_successful():
    return RedirectResponse(url="http://localhost:5173/confirm-order", status_code=302)   #without status code = 302 error "method not allowed"


@payment_router.post("/failed")
def payment_failed():
    return {"message": "Payment failed"}

@payment_router.post("/cancelled")
def payment_cancelled():
    return {"message": "Payment cancelled"}