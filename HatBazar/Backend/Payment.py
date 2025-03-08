from fastapi import FastAPI, HTTPException, APIRouter, Depends, Request
from sqlmodel import select
from sslcommerz_lib import SSLCOMMERZ
import os
from uuid import uuid4
from models import PaymentTable, AccountTable
from Database import Database


class Payment:
    def __init__(self, paymentAmount = None, tran_id = None):
        self._paymentAmont = paymentAmount
        self._tran_id = tran_id
        self.__sslcz = SSLCOMMERZ({
            'store_id': os.getenv('SSLCOMMERZ_STORE_ID'),
            'store_pass': os.getenv('SSLCOMMERZ_STORE_PASS'),
            'issandbox': True
        })

    def makePayment(self, payment_amount, indicator):
        print(payment_amount)
        self._tran_id = uuid4()

        success_url = "http://127.0.0.1:8000/payment/successful" if indicator == "sales" else "http://127.0.0.1:8000/payment/invest-successful"
        failed_url = "http://127.0.0.1:8000/payment/failed" if indicator == "investment" else "http://127.0.0.1:8000/payment/invest-failed"

        data = {
            'total_amount': f"{payment_amount}",
            'currency': "BDT",
            'tran_id': f"{self._tran_id}",
            'success_url': success_url,  # if transaction is successful, user will be redirected here
            'fail_url': failed_url,  # if transaction is failed, user will be redirected here
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

        response = self.__sslcz.createSession(data)

        try:
            if response['status'] == 'SUCCESS':
                return {"url": response["GatewayPageURL"],
                        "tran_id" : self._tran_id
                        }
            else:
                raise HTTPException(status_code=400, detail="Failed to create payment session")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))



    def storePaymentInfos(self, payment_amount, tran_id, username):
        db_payment = PaymentTable(username=username, amount=payment_amount, tran_id=tran_id, indicator="sales")
        store_success = Database.write(db_payment)
        if not store_success:
            print(store_success)

        return {"order_number": {tran_id}}