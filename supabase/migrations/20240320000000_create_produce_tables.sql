-- Create produce_items table
CREATE TABLE IF NOT EXISTS produce_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    available_quantity NUMERIC NOT NULL CHECK (available_quantity >= 0),
    price_tiers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    produce_id UUID NOT NULL REFERENCES produce_items(id) ON DELETE CASCADE,
    produce_name VARCHAR(255) NOT NULL,
    quantity NUMERIC NOT NULL CHECK (quantity > 0),
    unit VARCHAR(50) NOT NULL,
    price_per_unit NUMERIC NOT NULL CHECK (price_per_unit > 0),
    total_price NUMERIC NOT NULL CHECK (total_price > 0),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
    pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
    pickup_location TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for produce_items
ALTER TABLE produce_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can insert their own produce"
    ON produce_items FOR INSERT
    TO authenticated
    WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "Farmers can update their own produce"
    ON produce_items FOR UPDATE
    TO authenticated
    USING (farmer_id = auth.uid())
    WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "Farmers can delete their own produce"
    ON produce_items FOR DELETE
    TO authenticated
    USING (farmer_id = auth.uid());

CREATE POLICY "Everyone can view produce"
    ON produce_items FOR SELECT
    TO authenticated
    USING (true);

-- Create RLS policies for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restaurants can create orders"
    ON orders FOR INSERT
    TO authenticated
    WITH CHECK (restaurant_id = auth.uid());

CREATE POLICY "Farmers can update their orders"
    ON orders FOR UPDATE
    TO authenticated
    USING (farmer_id = auth.uid())
    WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "Users can view their own orders"
    ON orders FOR SELECT
    TO authenticated
    USING (farmer_id = auth.uid() OR restaurant_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_produce_items_updated_at
    BEFORE UPDATE ON produce_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 