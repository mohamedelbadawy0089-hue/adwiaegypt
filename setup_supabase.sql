-- إنشاء جدول المنتجات الصيدلية في Supabase
CREATE TABLE IF NOT EXISTS pharmacy_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(5,2) DEFAULT 0,
    quantity INTEGER DEFAULT 0,
    production_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_pharmacy_products_name ON pharmacy_products(product_name);
CREATE INDEX IF NOT EXISTS idx_pharmacy_products_created_at ON pharmacy_products(created_at);
