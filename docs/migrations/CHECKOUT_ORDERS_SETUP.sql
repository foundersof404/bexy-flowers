-- ============================================
-- CHECKOUT ORDERS TABLE
-- ============================================
-- Stores customer info and order details when users complete checkout.
-- Used for gathering user information and order history.

CREATE TABLE IF NOT EXISTS checkout_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  location TEXT NOT NULL,
  order_items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 4.00,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checkout_orders_created_at ON checkout_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkout_orders_email ON checkout_orders(email);
CREATE INDEX IF NOT EXISTS idx_checkout_orders_phone ON checkout_orders(phone);

COMMENT ON TABLE checkout_orders IS 'Customer checkout data: full name, phone, email, location, and order details';
