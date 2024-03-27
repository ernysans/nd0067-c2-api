# Storefront Backend Project

## About the Project

API for an online storefront to showcase great product ideas. Users can browse an index of all products, see the
specifics of a single product, and add products to an order that they can view in a cart page.

## How to Run the Project

1. Clone the project to your local machine.
2. Install all project dependencies with `npm install`
3. Create a `.env` file in the project root and add the following:
    ```
    POSTGRES_HOST=127.0.0.1
    POSTGRES_USER=full_stack_user
    POSTGRES_PASSWORD=password123
    POSTGRES_DB=full_stack_dev
    POSTGRES_TEST_DB=full_stack_test
    POSTGRES_HOST_AUTH_METHOD=trust
    POSTGRES_PORT=5432
    ENV=dev
    BCRYPT_PASSWORD=this-is-a-secret
    SALT_ROUNDS=10
    TOKEN_SECRET=alohomora123!
    ```

4. Database Setup:

   Create a Postgres user and database:

   Switch to the postgres user `su postgres`

   Start psql `psql postgres`

   ```
   CREATE USER full_stack_user WITH PASSWORD 'password123';
   CREATE DATABASE full_stack_dev;
   CREATE DATABASE full_stack_test;
   GRANT ALL PRIVILEGES ON DATABASE full_stack_dev TO full_stack_user;
   GRANT ALL PRIVILEGES ON DATABASE full_stack_test TO full_stack_user;
   ```

5. Build the application with `npm run build`
6. Run the migrations with `npm run migrate`
7. Serve the application with `npm run start`

## Available Scripts

In the project directory, you can run:

### `npm run build`

Builds the app for production to the `lib` folder.

### `npm run migrate`

Runs the migrations for the database.

### `npm run watch`

Runs the app in the development mode.

### `npm run start`

Starts the server in production mode.

### `npm run test`

Runs all tests with jasmine.

## Security

Bearer Token is required for all endpoints explicitly marked as `token required`. The token is generated when a user is
authenticated and is required to be passed in the header of the request.

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

## Database triggers

### `orders` table

1. `order_user_check_before_update`: This trigger is executed before an update on the `orders` table. It checks if the
   user is trying to update an order that belongs to another user. If so, it raises an exception.
2. `order_status_check_before_update`: This trigger is also executed before an update on the `orders` table. It checks
   if the user is trying to change the order status from 'complete' to 'open'. If so, it raises an exception.

### `order_products` table

1. `order_status_check_before_insert`: This trigger is executed before an insert on the `order_products` table. It
   checks if the order status is 'open'. If not, it raises an exception.
2. `order_status_check_before_update`: This trigger is also executed before an update on the `order_products` table. It
   checks if the order status is 'open'. If not, it raises an exception.
3. `order_product_exists_check_before_insert`: This trigger is executed before an insert on the `order_products` table.
   It checks if the order product already exists. If so, it raises an exception.