from sqlmodel import select
from User import User
from models import FarmTable, UserTable
from Database import Database

class Farm(User):

    def __init__(self, user: User, farmDescription, address, employeeCount):
        super().__init__(user._username, user._fullname, user._email, user._phoneNumber, user._profile_photo_url, user._hashedPassword)      # awakward karon same user diye user kamne initiate hoy?? think it
        self.__farmDescription = farmDescription
        self.__address = address
        self.__employeeCount = employeeCount
        
        query = select(UserTable).where(UserTable.username == user._username)
        db_user = Database.read_one(query=query)
        db_farm = FarmTable(username=db_user.username, farm_description=farmDescription, address=address, employee_count=employeeCount)
        Database.write(db_farm)
        
        

    def updateFarmDetails(self):
        pass

    
    def listProducts(self):             #check is it available in Marketplace(named addProduct())
        pass


    def withdrawMoney(self):                #check is it available in Payment Class or not
        pass


    def manageInvestmentOffer(self):        #check is it available in Investment class or not
        pass



# farm = Farm(User("kibria30", "Md kibria Hossen Roni", "kibria8007@gmail.com", "01727396969", "http://127.0.0.1:8000/static/profile_images/kibria30_5822a15d-8d37-4b00-89d3-ad441b073df6.jpg"), "Kolakhet", "Gramerbari, Tangail", 20)