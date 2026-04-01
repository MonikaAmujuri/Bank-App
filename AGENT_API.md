# Bank Agent API Documentation

## Agent Dashboard

**GET** `/api/agent/dashboard`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...>
```

### Request Body

```http
No body Needed
```
### Response (200 OK)

```http
{
  "totalUsers": 2,
  "totalLoans": 3,
  "draftLoans": 1,
  "pendingLoans": 0,
  "approvedLoans": 1,
  "rejectedLoans": 1,
  "homeLoans": 2,
  "personalLoans": 0,
  "educationLoans": 0,
  "vehicleLoans": 0,
  "businessLoans": 0,
  "recentLoans": [
    {
      "_id": "69b5016743bfd732729e80b6",
      "loanId": "LOAN0006"
    },
    ...
  ]
}
```
### Error Response (500 Internal Server error)

```http
{
  "message": "Server error"
}
```

## Create User

**POST** `/api/users/create-user`

### Headers

```http
Content-Type: application/json
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...>
```

### Request Body

```http
{
 "name": "User.",
 "email": "user12@example.com",
 "phone": "9876543210",
 "panNumber": "ABCDE1234F",
 "aadharNumber": "123412341234",
 "address": "Guntur, Andhra Pradesh"
}
```
### Response (200 OK)

```http
{
  "message": "User created successfully",
  "user": {
    "id": "69bcefb6f30336efaee5a07e",
    "userId": "USR0005",
    "name": "User.",
    "email": "user12@example.com",
    "phone": "9876543210",
    "panNumber": "ABCDE1234F",
    "aadharNumber": "123412341234",
    "address": "Guntur, Andhra Pradesh",
    "role": "user"
  },
  "password": "4GUC6FMAFg3x"
}
```
### Error Response (500 Internal Server error)

```http
{
  "message": "Server error"
}
```
### Error Response (400)

```http
{
  "message": "Email already exists"
}
```

## Get Agent Users

**GET** `/api/agent/users`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...>
```

### Request Body

```http
No Body Needed
```
### Response (200 OK)

```http
[
  {
    "_id": "699fed0474e0522950c7fde6",
    "name": "User1",
    "email": "user1@bank.com",
    "role": "user",
    "createdBy": "699fd764dd531d0dcaf9ab66",
    "isDeleted": false,
    "isActive": true,
    "userId": "USR0001",
    "...": "..."
  },
  ...
]
```
### Error Response (500 Internal Server error)

```http
{
  "message": "Server error"
}
```
### Error Response (404)

```http
{
  "message": "Agent not found"
}
```

## Get Agent Users

**GET** `/api/agent/users`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...>
```

### Request Body

```http
No Body Needed
```
### Response (200 OK)

```http
[
  {
    "_id": "699fed0474e0522950c7fde6",
    "name": "User1",
    "email": "user1@bank.com",
    "role": "user",
    "createdBy": "699fd764dd531d0dcaf9ab66",
    "isDeleted": false,
    "isActive": true,
    "userId": "USR0001",
    "...": "..."
  },
  ...
]
```
### Error Response (500 Internal Server error)

```http
{
  "message": "Server error"
}
```
### Error Response (404)

```http
{
  "message": "User not found"
}
```

## Get Active Users

**GET** `/api/agent/users?status=active`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...>
```

### Request Body

```http
No Body Needed
```
### Response (200 OK)

```http
[
  {
    "_id": "699fed0474e0522950c7fde6",
    "name": "User1",
    "email": "user1@bank.com",
    "role": "user",
    "createdBy": "699fd764dd531d0dcaf9ab66",
    "isDeleted": false,
    "isActive": true,
    "userId": "USR0001",
    "...": "..."
  },
  ...
]
```
### Error Response (500 Internal Server error)

```http
{
  "message": "Server error"
}
```
### Error Response (404)

```http
{
  "message": "User not found"
}
```

## Get InActive Users

**GET** `/api/agent/users?status=inactive`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...>
```

### Request Body

```http
No Body Needed
```
### Response (200 OK)

```http
[
  {
    "_id": "69a034ad4c789227ce41330a",
    "name": "User2",
    "email": "user2@bank.com",
    "role": "user",
    "createdBy": "699fd764dd531d0dcaf9ab66",
    "isDeleted": true,
    "isActive": false,
    "userId": "USR0002",
    "...": "..."
  },
  ...
]
```
### Error Response (500 Internal Server error)

```http
{
  "message": "Server error"
}
```
### Error Response (404)

```http
{
  "message": "User not found"
}
```

## Get Agent Loans

**GET** `/api/agent/loans`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...>
```

### Request Body

```http
No Body Needed
```
### Response (200 OK)

```http
[
  {
    "createdBy": null,
    "_id": "699feebf74e0522950c7fdfb",
    "loanId": "LOAN0001",
    "userId": "USR0001",
    "userObjectId": {
      "_id": "699fed0474e0522950c7fde6",
      "name": "User1",
      "isDeleted": false,
      "userId": "USR0001"
    },
    "...": "..."
  },
  ...
]
```
### Error Response (500 Internal Server error)

```http
{
  "message": "Server error"
}
```
### Error Response (404)

```http
{
  "message": "Loans not found"
}
```