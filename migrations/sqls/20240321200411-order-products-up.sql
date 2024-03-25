CREATE TABLE order_products (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  quantity int NOT NULL
);

-- Check if the order status is open before inserting or updating an order product
CREATE OR REPLACE FUNCTION check_order_status_open() RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT status FROM orders WHERE id = NEW.order_id) != 'open' THEN
    RAISE EXCEPTION 'Order status is not open';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_check_before_insert
BEFORE INSERT ON order_products
FOR EACH ROW EXECUTE PROCEDURE check_order_status_open();

CREATE TRIGGER order_status_check_before_update
BEFORE UPDATE ON order_products
FOR EACH ROW EXECUTE PROCEDURE check_order_status_open();
