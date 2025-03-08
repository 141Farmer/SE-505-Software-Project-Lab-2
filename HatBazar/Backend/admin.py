from fastapi import FastAPI
from sqlmodel import create_engine
from sqladmin import Admin, ModelView

# Import all models from the model module
from models import (
    UserTable, FarmTable, ProductTable, PostTable, CommentTable, 
    VoteTable, InvestmentOfferTable, InvestmentBidTable, InvestmentTable
)

# Function to setup admin panel
def setup_admin(app: FastAPI, engine):
    # Create Admin instance
    admin = Admin(app, engine)

    # Create ModelView classes for each model
    class UserAdmin(ModelView, model=UserTable):
        column_list = [
            UserTable.id, UserTable.username, UserTable.fullname, 
            UserTable.email, UserTable.phone, UserTable.updated_at
        ]
        column_searchable_list = [UserTable.username, UserTable.email, UserTable.fullname]
        column_sortable_list = [UserTable.id, UserTable.username, UserTable.updated_at]
        column_details_exclude_list = [UserTable.hashed_password]
        can_create = True
        can_edit = True
        can_delete = True
        name = "User"
        name_plural = "Users"
        icon = "fa-solid fa-user"

    class FarmAdmin(ModelView, model=FarmTable):
        column_list = [
            FarmTable.id, FarmTable.username, FarmTable.farm_description, 
            FarmTable.address, FarmTable.employee_count, FarmTable.updated_at
        ]
        column_searchable_list = [FarmTable.username, FarmTable.address]
        column_sortable_list = [FarmTable.id, FarmTable.username, FarmTable.employee_count]
        can_create = True
        can_edit = True
        can_delete = True
        name = "Farm"
        name_plural = "Farms"
        icon = "fa-solid fa-tractor"

    class ProductAdmin(ModelView, model=ProductTable):
        column_list = [
            ProductTable.id, ProductTable.farm_id, ProductTable.product_name,
            ProductTable.unit_price, ProductTable.stock_amount, ProductTable.rating
        ]
        column_searchable_list = [ProductTable.product_name]
        column_sortable_list = [
            ProductTable.id, ProductTable.farm_id, ProductTable.unit_price, 
            ProductTable.stock_amount, ProductTable.rating
        ]
        can_create = True
        can_edit = True
        can_delete = True
        name = "Product"
        name_plural = "Products"
        icon = "fa-solid fa-box"

    class PostAdmin(ModelView, model=PostTable):
        column_list = [
            PostTable.id, PostTable.user_name, PostTable.post_title,
            PostTable.upvote_count, PostTable.downvote_count, PostTable.posted_time
        ]
        column_searchable_list = [PostTable.post_title, PostTable.user_name]
        column_sortable_list = [
            PostTable.id, PostTable.upvote_count, PostTable.downvote_count, PostTable.posted_time
        ]
        can_create = True
        can_edit = True
        can_delete = True
        name = "Post"
        name_plural = "Posts"
        icon = "fa-solid fa-clipboard"

    class CommentAdmin(ModelView, model=CommentTable):
        column_list = [
            CommentTable.id, CommentTable.post_id, CommentTable.user_name,
            CommentTable.comment_text, CommentTable.commented_time
        ]
        column_searchable_list = [CommentTable.user_name, CommentTable.comment_text]
        column_sortable_list = [CommentTable.id, CommentTable.post_id, CommentTable.commented_time]
        can_create = True
        can_edit = True
        can_delete = True
        name = "Comment"
        name_plural = "Comments"
        icon = "fa-solid fa-comment"

    class VoteAdmin(ModelView, model=VoteTable):
        column_list = [
            VoteTable.id, VoteTable.post_id, VoteTable.user_name, VoteTable.value
        ]
        column_searchable_list = [VoteTable.user_name]
        column_sortable_list = [VoteTable.id, VoteTable.post_id, VoteTable.value]
        can_create = True
        can_edit = True
        can_delete = True
        name = "Vote"
        name_plural = "Votes"
        icon = "fa-solid fa-thumbs-up"

    class InvestmentOfferAdmin(ModelView, model=InvestmentOfferTable):
        column_list = [
            InvestmentOfferTable.id, InvestmentOfferTable.farm_id, InvestmentOfferTable.user_name,
            InvestmentOfferTable.offer_investment_principle, InvestmentOfferTable.offer_investment_rate,
            InvestmentOfferTable.offer_creation_time
        ]
        column_searchable_list = [InvestmentOfferTable.user_name]
        column_sortable_list = [
            InvestmentOfferTable.id, InvestmentOfferTable.farm_id, 
            InvestmentOfferTable.offer_investment_principle, 
            InvestmentOfferTable.offer_creation_time
        ]
        can_create = True
        can_edit = True
        can_delete = True
        name = "Investment Offer"
        name_plural = "Investment Offers"
        icon = "fa-solid fa-handshake"

    class InvestmentBidAdmin(ModelView, model=InvestmentBidTable):
        column_list = [
            InvestmentBidTable.id, InvestmentBidTable.investment_offer_id, 
            InvestmentBidTable.user_id, InvestmentBidTable.user_name,
            InvestmentBidTable.bid_investment_principle, InvestmentBidTable.bid_investment_rate,
            InvestmentBidTable.bid_creation_time
        ]
        column_searchable_list = [InvestmentBidTable.user_name]
        column_sortable_list = [
            InvestmentBidTable.id, InvestmentBidTable.investment_offer_id, 
            InvestmentBidTable.bid_investment_principle, 
            InvestmentBidTable.bid_creation_time
        ]
        can_create = True
        can_edit = True
        can_delete = True
        name = "Investment Bid"
        name_plural = "Investment Bids"
        icon = "fa-solid fa-gavel"

    class InvestmentAdmin(ModelView, model=InvestmentTable):
        column_list = [
            InvestmentTable.id, InvestmentTable.farm_id, InvestmentTable.user_id,
            InvestmentTable.investment_principle, InvestmentTable.investment_rate,
            InvestmentTable.investment_duration_month, InvestmentTable.investment_creation_time
        ]
        column_searchable_list = [InvestmentTable.transaction_id]
        column_sortable_list = [
            InvestmentTable.id, InvestmentTable.farm_id, InvestmentTable.user_id,
            InvestmentTable.investment_principle, InvestmentTable.investment_creation_time
        ]
        can_create = True
        can_edit = True
        can_delete = True
        name = "Investment"
        name_plural = "Investments"
        icon = "fa-solid fa-money-bill"

    # Register all model views with the admin
    admin.add_view(UserAdmin)
    admin.add_view(FarmAdmin)
    admin.add_view(ProductAdmin)
    admin.add_view(PostAdmin)
    admin.add_view(CommentAdmin)
    admin.add_view(VoteAdmin)
    admin.add_view(InvestmentOfferAdmin)
    admin.add_view(InvestmentBidAdmin)
    admin.add_view(InvestmentAdmin)
    
    return admin