-- Create employees table in Supabase PostgreSQL
CREATE TABLE IF NOT EXISTS employees (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Add unique constraint to prevent duplicates based on name and designation
    UNIQUE(name, designation, department)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_created_at ON employees(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);

-- Enable Row Level Security (RLS) for security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo purposes)
-- In production, you should create more restrictive policies
CREATE POLICY "Allow all operations for employees" ON employees
    FOR ALL USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_employees_updated_at 
    BEFORE UPDATE ON employees 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO employees (name, designation, department) VALUES
    ('John Doe', 'Software Engineer', 'Engineering'),
    ('Jane Smith', 'Product Manager', 'Product'),
    ('Mike Johnson', 'UX Designer', 'Design')
ON CONFLICT DO NOTHING; 