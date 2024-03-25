CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  status VARCHAR(15) NOT NULL,
  user_id INT REFERENCES users (id) ON DELETE CASCADE
);

-- Prevent users from updating other users' orders
CREATE OR REPLACE FUNCTION check_order_user() RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT user_id FROM orders WHERE id = NEW.id) != NEW.user_id THEN
    RAISE EXCEPTION 'Order does not belong to user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_user_check_before_update
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE PROCEDURE check_order_user();

--- Prevent changing the order status to 'open' after it was 'complete'
CREATE OR REPLACE FUNCTION check_order_status() RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'complete' AND NEW.status = 'open' THEN
    RAISE EXCEPTION 'Cannot change order status from complete to open. Create a new order instead.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER order_status_check_before_update
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE PROCEDURE check_order_status();

