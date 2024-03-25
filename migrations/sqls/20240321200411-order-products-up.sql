CREATE TABLE order_products (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  quantity int
);
