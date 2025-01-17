# FROKER Backend Assignment
This is a sample backend for a money lending platform, similar to Slice and KreditBee.

## Tech Stack
- Node.js
- Express.js
- Mongoose (MongoDB)
- Postman (for testing APIs)
- JSON Web Tokens

## Installation and Deployment
 ```bash
  npm i
```
```bash
  npm start
```


## Features

### 1. Sign Up
 The user's registration is approved or rejected based on user's age and monthly salary. Status regarding account creation and JWT token is sent if application is approved.
#### API endpoint : ``` POST /signup```
#### Request Body :
```json
{
    name:"name", email:"email@domain.com",
    pass:"password", phone:"000000000",
    salary:"0000" , dob:"YYYY-MM-DD"
}
```
#### Response :
```json
{
    status:"account created successfully",
    token:"JWT token"
}
```
![App Screenshot](./screenshots/signin_success.png)

### 2. Log In
The user's credentials are matched against the one in the database. Response is generated accordingly. 
#### API endpoint : ``` POST /login```
#### Request Body :
```json
{
    email:"email@domain.com",
    pass:"password"
}
```
#### Response :
```json
{
    status:"logged in successfully",
    token:"JWT token"
}
```
![App Screenshot](./screenshots/login_success.png)

### 3. Show User Data
JWT token is authenticated and user's account information is sent in response.
#### API endpoint : ``` GET /user```
#### Request Header :
```json
{[
    'authorization':'Bearer JWT'
]}
```
#### Response :
```json
{
    email:"email@domain.com",
    phone:"000000000",
    salary:"0000" ,
    ppa:"0000"
    dob:"YYYY-MM-DD" , dor:"YYYY-MM-DD"
}
```
![App Screenshot](./screenshots/user_success.png)

### 3. Borrow Money
JWT token is authenticated and monthly installments and Purchase Power Amount is generated based on amount and years borrowed. 
#### API endpoint : ```POST /borrow```
#### Request Header :
```json
{[
    'authorization':'Bearer JWT'
]}
```
#### Request Body :
```json
{
    borrow:"00000" , years:"0"
}
```
#### Response :
```json
{
    ppa: 0000,
    month: 0000
}
```
![App Screenshot](./screenshots/borrow_success.png)