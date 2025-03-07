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

    def makePayment(self, payment_amount):
        print(payment_amount)
        self._tran_id = uuid4()
        data = {
            'total_amount': f"{payment_amount}",
            'currency': "BDT",
            'tran_id': f"{self._tran_id}",
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

        response = self.__sslcz.createSession(data)
        
        try:
            if response['status'] == 'SUCCESS':
                return {"url": response["GatewayPageURL"]}
            else:
                raise HTTPException(status_code=400, detail="Failed to create payment session")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))



    def storePaymentInfos(self, payment_amount, username):
        db_payment = PaymentTable(username=username, amount=payment_amount, tran_id=self._tran_id, indicator="sales")
        store_success = Database.write(db_payment)
        if not Database.write(db_payment):
            print(store_success)

        # query = select(AccountTable).where(AccountTable.username == username)
        # old_account = Database.read_one(query=query)
        # if not old_account:
        #     db_new_account = AccountTable(username=username, balance_sales=payment_amount, total_balance=payment_amount)
        #     Database.write(db_new_account)
        #     return {"message": "Payment infos stored successfully."}

        
        # old_account.balance_sales += payment_amount
        # old_account.total_balance += payment_amount
        # Database.update(old_account)                          #eita eihane hobe na order er sathe hobe

        return {"order_number": {self._tran_id}}