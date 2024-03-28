# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## Database Schema
## Users Table Schema

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id          | SERIAL    | PRIMARY KEY | Unique identifier for each user |
| first_name  | VARCHAR(100) |             | First name of the user |
| last_name   | VARCHAR(100) |             | Last name of the user |
| password    | VARCHAR   |             | Encrypted password for the user |

## Products Table Schema

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id          | SERIAL    | PRIMARY KEY | Unique identifier for each product |
| name        | VARCHAR(64) | NOT NULL | Name of the product |
| price       | INTEGER   | NOT NULL | Price of the product |

## Orders Table Schema

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id          | SERIAL    | PRIMARY KEY | Unique identifier for each order |
| status      | VARCHAR(15) | NOT NULL | Status of the order (e.g., 'open', 'complete') |
| user_id     | INT       | REFERENCES users (id) ON DELETE CASCADE | Foreign key that references the `id` in the `users` table |

## Order Products Table Schema

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id          | SERIAL    | PRIMARY KEY | Unique identifier for each order product |
| order_id    | INT       | REFERENCES orders(id) ON DELETE CASCADE | Foreign key that references the `id` in the `orders` table |
| product_id  | INT       | REFERENCES products(id) ON DELETE CASCADE | Foreign key that references the `id` in the `products` table |
| quantity    | INT       | NOT NULL | Quantity of the product in the order |

## Database triggers

### Orders Table Triggers

1. `order_user_check_before_update`: This trigger is executed before an update on the `orders` table. It checks if the
   user is trying to update an order that belongs to another user. If so, it raises an exception.
2. `order_status_check_before_update`: This trigger is also executed before an update on the `orders` table. It checks
   if the user is trying to change the order status from 'complete' to 'open'. If so, it raises an exception.

### Order Products Table Triggers

1. `order_status_check_before_insert`: This trigger is executed before an insert on the `order_products` table. It
   checks if the order status is 'open'. If not, it raises an exception.
2. `order_status_check_before_update`: This trigger is also executed before an update on the `order_products` table. It
   checks if the order status is 'open'. If not, it raises an exception.
3. `order_product_exists_check_before_insert`: This trigger is executed before an insert on the `order_products` table.
   It checks if the order product already exists. If so, it raises an exception.

## API Endpoints

### Users API Endpoints

- `POST /users/authenticate` - Authenticate a user

  * Request Body:
    ```json
    {
      "id": 1,
      "password": "userpassword"
    }
    ``` 
  * Response:
    ```json
    {
      "token": "The User Token",
      "id": 1,
      "first_name": "Lolo",
      "last_name": "Roa"
    }
    ```
- `GET /users` - Get all users (token required)
- `GET /users/:id` - Get a specific user by its ID (token required)
- `POST /users` - Create a new user

  * Request Body:
  ```json
  {
    "first_name": "Lolo",
    "last_name": "Roa",
    "password": "1234567890"
  }
  ```
  * Response:
    ```json
    {
      "token": "The User Token",
      "id": 1,
      "first_name": "Lolo",
      "last_name": "Roa"
    }
    ```
- `PUT /users/:id` - Update a specific user by its ID (token required)
  * Request Body:
  ```json
  {
    "first_name": "Lolo",
    "last_name": "Roa"
  }
  ```
- `DELETE /users/:id` - Delete a specific user by its ID (token required)

### Products API Endpoints

- `GET /products` - Get all products
- `GET /products/:id` - Get a specific product by its ID
- `POST /products` - Create a new product (token required)
  * Request Body:
  ```json
  {
    "name": "Sword",
    "type": "solid",
    "price": 100
  }
  ```
- `PUT /products/:id` - Update a specific product by its ID (token required)
  * Request Body:
  ```json
  {
    "name": "Sword",
    "type": "solid",
    "price": 200
  }
  ```
- `DELETE /products/:id` - Delete a specific product by its ID (token required)

### Orders API Endpoints

- `GET /orders` - Get all orders (token required)
- `GET /orders/:id` - Get a specific order by its ID (token required)
- `POST /orders` - Create a new order (token required)
  * Request Body:
  ```json
  {
    "status": "open"
  }
  ```
- `PUT /orders/:id` - Update a specific order by its ID (token required)
  * Request Body:
  ```json
  {
    "status": "complete"
  }
  ```
- `DELETE /orders/:id` - Delete a specific order by its ID (token required)
- `GET /orders/:id/products` - Get all products of a specific order by its ID (token required)

### Order Products API Endpoints

- `GET /order_products` - Get all order products (token required)
- `GET /order_products/:id` - Get a specific order product by its ID (token required)
- `POST /order_products` - Create a new order product (token required)
  * Request Body:
  ```json
  {
    "order_id": 1,
    "product_id": 1,
    "quantity": 343
  }
  ```
- `PUT /order_products/:id` - Update a specific order product by its ID (token required)
  * Request Body:
  ```json
  {
    "order_id": 1,
    "product_id": 1,
    "quantity": 343
  }
  ```
- `DELETE /order_products/:id` - Delete a specific order product by its ID (token required)
