# HatBazar

HatBazar is an agricultural e-commerce platform designed to connect consumers directly with farmers, enabling the purchase of agricultural products without intermediaries. The application also fosters community engagement and supports agricultural investment, making it a comprehensive ecosystem for all stakeholders in the agricultural value chain.

## Features

- **Direct Agricultural Marketplace:**  
  Consumers can browse and purchase agricultural products directly from farmers.

- **Community Section:**  
  Both consumers and farmers can post thoughts, questions, and participate in discussions to share knowledge and experiences.

- **Investment Section:**  
  Farmers can create investment offers for their agricultural initiatives, and users can invest in these offers to support local agriculture.

- **Secure Payment:**  
  Integrated with SSLCOMMERZ for safe and seamless online transactions.

- **Notifications:**  
  FastAPI Mailer is used for real-time notifications and updates via email.

- **Robust Authentication:**  
  Utilizes JWT (JSON Web Tokens) for secure user authentication and authorization.

## Tech Stack

| Layer      | Technology      |
|------------|----------------|
| Frontend   | React          |
| Backend    | FastAPI        |
| Payment    | SSLCOMMERZ     |
| Mail/Notif | FastAPI Mailer |
| Auth       | JWT            |

## Getting Started

### Prerequisites

- Node.js (for frontend)
- Python 3.8+ (for backend)
- npm or yarn
- pip

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/141Farmer/SE-505-Software-Project-Lab-2.git
cd SE-505-Software-Project-Lab-2/HatBazar
```

#### 2. Frontend (React)

```bash
cd Frontend
npm install
# or
yarn install
npm start
# or
yarn start
```

#### 3. Backend (FastAPI)

```bash
cd ../Backend
pip install -r requirements.txt
uvicorn main:app --reload
```

> ⚠️ You may need to set up environment variables for mailer, database, payment gateway, and JWT secret keys. Refer to the project's `/Official-Documents` for proposal and timeline details.

### Payment Integration (SSLCOMMERZ)

- Configure your SSLCOMMERZ credentials in the backend environment.
- Follow prompts in the application to complete secure payments.

### Mail Notification

- Set up FastAPI Mailer settings in the backend for transactional and notification emails.

## Usage

- Sign up as a consumer or farmer.
- Farmers list products and post investment offers.
- Consumers browse, purchase products, and invest in offers.
- All users can join the community section for Q&A and discussions.

## Folder Structure

```
HatBazar/
├── Backend/          # FastAPI backend server
├── Frontend/         # React frontend app
├── node_modules/
├── package.json
├── package-lock.json
```

## License

This project is for academic and demonstration purposes.

