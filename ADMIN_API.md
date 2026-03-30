# Bank Admin API Documentation

## Admin Dashboard

**GET** `/api/admin/dashboard`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No body Needed
```
### Response (200 OK)

```http
{
  "users": 5,
  "agents": 2,
  "loans": 7,
  "pendingLoans": 0,
  "draftLoans": 3,
  "approvedLoans": 3,
  "rejectedLoans": 1,
  "homeLoans": 3,
  "personalLoans": 1,
  "educationLoans": 0,
  "businessLoans": 1,
  "vehicleLoans": 0
}
```

### Error Response (500 Internal Server error)

```http
{
  "message": "Server error"
}
```

## Get All Loans

**GET** ` /api/admin/loans`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No body Needed
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
      "userId": "USR0001"
    },
    "...": "..."
  }
]
```
### Error Response (500 Internal Server error)

```http
{
  "message": "Server error"
}
```

## Get draft Loans

**GET** ` /api/admin/loans?status=draft`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No body Needed
```
### Response (200 OK)

```http
[
  {
    "userObjectId": {
      "_id": "69a034ad4c789227ce41330a",
      "name": "User2",
      "userId": "USR0002"
    },
    "agentId": {
      "_id": "69bd0e97f30336efaee5a4cb",
      "name": "Agent..."
    },
    "status": "draft"
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

## Get pending Loans

**GET** ` /api/admin/loans?status=pending`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No body Needed
```
### Response (200 OK)

```http
[
  {
    "userObjectId": {
      "_id": "699fed0474e0522950c7fde6",
      "name": "User1...",
      "userId": "USR0001"
    },
    "status": "pending"
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

## Get Approved Loans

**GET** ` /api/admin/loans?status=approved`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No body Needed
```
### Response (200 OK)

```http
[
  {
    "userObjectId": {
      "_id": "699fed0474e0522950c7fde6",
      "name": "User1...",
      "userId": "USR0001"
    },
    "status": "approved"
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

## Get Rejected Loans

**GET** ` /api/admin/loans?status=rejected`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No body Needed
```
### Response (200 OK)

```http
[
  {
    "userObjectId": {
      "_id": "699fed0474e0522950c7fde6",
      "name": "User1...",
      "userId": "USR0001"
    },
    "status": "rejected"
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

## Get Home Loans

**GET** ` /api/admin/loans?loanType=Home%20Loan`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No body Needed
```
### Response (200 OK)

```http
[
  {
    "_id": "69a14b6042d252708a5b01d5",
    "loanId": "LOAN0003",
    "userObjectId": {
      "_id": "699fed0474e0522950c7fde6",
      "name": "User1...",
      "userId": "USR0001"
    },
    "loan-type": "Home Loan"
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

## Get Personal Loans

**GET** ` /api/admin/loans?loanType=Personal%20Loan`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No body Needed
```
### Response (200 OK)

```http
[
  {
    "_id": "69b5051143bfd732729e8258",
    "loanId": "LOAN0007",
    "userObjectId": {
      "_id": "69aeb8da08bd3b5d93d0ca7a",
      "name": "Sam",
      "userId": "USR0003"
    },
    "loan-type": "Personal Loan"
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

## Get Education Loans

**GET** ` /api/admin/loans?loanType=Education%20Loan`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No body Needed
```
### Response (200 OK)

```http
[
    "message": "No loans found",
]
```
### Error Response (500 Internal Server error)

```http
{
  "message": "Server error"
}
```

## Get Business Loans

**GET** ` /api/admin/loans?loanType=Business%20Loan`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No body Needed
```
### Response (200 OK)

```http
[
  {
    "_id": "69b25020448d74aa1f263c2b",
    "loanId": "LOAN0005",
    "userObjectId": {
      "_id": "69afec0f3aab80c84c6ba09b",
      "name": "User..",
      "userId": "USR0004"
    },
    "loan-type": "Business Loan"
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

## Get Vehicle Loans

**GET** ` /api/admin/loans?loanType=Vehicle%20Loan`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No body Needed
```
### Response (200 OK)

```http
[
    "message": "No loans found",
]
```
### Error Response (500 Internal Server error)

```http
{
  "message": "Server error"
}
```

## Create Agent

**POST** ` /api/admin/create-agent`

### Headers

```http
Content-type: application/json,
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
{
 "name": "Agent...",
 "email": "agent123@example.com",
 "phone": "9876543210",
 "location": "Guntur",
 "pincode": "522002"
}
```
### Response (200 OK)

```http
{
  "message": "Agent created successfully",
  "agent": {
    "id": "69bcff06f30336efaee5a3fe",
    "name": "Agent...",
    "email": "agent123@example.com",
    "phone": "9876543210",
    "location": "Guntur",
    "pincode": "522002",
    "agentId": "AGT0003",
    "role": "agent"
  },
  "password": "9_HX2l)D#(su"
}
```
### Error Response (500 Internal Server error)

```http
{
  "message": "Server error"
}
```

## Get All Agents

**GET** ` /api/admin/agents`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No Body Needed
```
### Response (200 OK)

```http
[
  {
    "_id": "699fd764dd531d0dcaf9ab66",
    "name": "Agent 1",
    "email": "agent@bank.com",
    "role": "agent",
    "createdBy": "699ef3399e1cdb38eec7210d",
    "isDeleted": false,
    "isActive": true,
    "location": "Brodipet, Guntur",
    "phone": "+918341791657",
    "pincode": "522004",
    "agentId": "AGT0001",
    "firebaseUid": "75Ut6olvzEZ9WNwVhmbA7U5LrYB3",
    ...
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

## Get All Users

**GET** ` /api/admin/users`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
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
    "phone": "+918888888888",
    "aadharNumber": "777788889999",
    "address": "Brodipet 6/13, Guntur",
    "panNumber": "EJPA458H2",
    "firebaseUid": "SkdkJZgwBFS68ZO7ATzot1R2s382"
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

## Get Deactivate User

**PATCH** ` /api/admin/deactivate/:id`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No Body Needed
```
### Response (200 OK)

```http
{
  "message": "User deactivated successfully"
}
```
### Error Response (404 )

```http
{
  "message": "User not found"
}
```
### Error Response (400 )

```http
{
  "message": "Cannot deactivate admin"
}
```

## Get Activate User

**PATCH** ` /api/admin/activate/:id`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No Body Needed
```
### Response (200 OK)

```http
{
  "message": "User activated successfully"
}
```
### Error Response (404 )

```http
{
  "message": "User not found"
}
```
### Error Response (400 )

```http
{
  "message": "Cannot modify admin"
}
```

## Get Agent Details

**GET** ` /api/admin/agent/:id/details`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No Body Needed
```
### Response (200 OK)

```http
{
  "totalUsers": 3,
  "totalLoans": 3,
  "approvedLoans": 2,
  "approvalRate": "66.7",
  "users": [
    {
      "_id": "69aeb8da08bd3b5d93d0ca7a",
      "name": "Sam",
      "email": "sam@gmail.com",
      "phone": "+919876543210",
      "panNumber": "EIJP786H2",
      "aadharNumber": "111122223333",
      "address": "AT. Agraharam, Guntur",
      "role": "user",
      "isActive": true,
      "userId": "USR0003"
    },
    ...
  ]
}
```
### Error Response (500 )

```http
{
  "message": "Server error"
}
```

## Delete Agent

**DELETE** ` /api/admin/agents/:id`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No Body Needed
```
### Response (200 OK)

```http
{
  "message": "Agent deleted successfully"
}
```
### Error Response (404 )

```http
{
  "message": "Agent not found"
}
```
### Error Response (500 )

```http
{
  "message": "Server error"
}
```

## Reset Agent Password

**PATCH** ` /api/admin/agents/:id/reset-password`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No Body Needed
```
### Response (200 OK)

```http
{
  "message": "Password reset successfully",
  "newPassword": "8byv3dad@A1"
}
```
### Error Response (404 )

```http
{
  "message": "Agent not found"
}
```
### Error Response (500 )

```http
{
  "message": "Server error"
}
```

## Admin Profile

**GET** ` /api/admin/profile`

### Headers

```http
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
No Body Needed
```
### Response (200 OK)

```http
{
  "_id": "699ef3399e1cdb38eec7210d",
  "name": "Admin",
  "email": "admin@bank.com",
  "role": "admin",
  "createdBy": null,
  "isActive": true,
  "createdAt": "2026-02-25T13:03:53.277Z",
  "updatedAt": "2026-03-09T07:40:27.523Z",
  "isDeleted": false,
  "phone": "+919999999999",
  "firebaseUid": "YRq1lXjVsoMtNPzxxMYv3dI0nWf1"
}
```
### Error Response (404 )

```http
{
  "message": "Admin not found"
}
```
### Error Response (500 )

```http
{
  "message": "Server error"
}
```

## Update Admin Profile

**PUT** ` /api/admin/profile`

### Headers

```http
Content-type: application/json
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
{
 "name": "Admin..",
 "email": "Admin@bank.com"
}
```
### Response (200 OK)

```http
{
  "message": "Profile updated successfully"
}
```
### Error Response (404 )

```http
{
  "message": "Admin not found"
}
```
### Error Response (500 )

```http
{
  "message": "Server error"
}
```

## Change Admin Password

**PATCH** ` /api/admin/change-password`

### Headers

```http
Content-type: application/json
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
{
 "currentPassword": "admin@123",
 "newPassword": "Admin@123"
}
```
### Response (200 OK)

```http
{
  "message": "Password changed successfully"
}
```
### Error Response (400 )

```http
{
  "message": "Current password incorrect"
}
```
### Error Response (500 )

```http
{
  "message": "Server error"
}
```

## Assign Agent to Loan

**PATCH** ` /api/admin/loans/:loanId/assign-agent`

### Headers

```http
Content-type: application/json
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cC...>
```

### Request Body

```http
{
"agentId": "69bd0e97f30336efaee5a4cb"
}

```
### Response (200 OK)

```http
{
  "message": "Loan assigned successfully",
  "loan": {
    "createdBy": null,
    "_id": "69a034d84c789227ce413323",
    "loanId": "LOAN0002",
    "userId": "USR0002",
    "userObjectId": {
      "_id": "69a034ad4c789227ce41330a",
      "name": "User2",
      "userId": "USR0002"
    },
    "agentId": {
      "_id": "69bd0e97f30336efaee5a4cb",
      "name": "Agent...",
      "agentId": "AGT0004"
    }
  }
}
```
### Error Response (400 )

```http
{
  "message": "Agent ID is required"
}
```
### Error Response (404 )

```http
{
  "message": "Loan not found"
}
```

