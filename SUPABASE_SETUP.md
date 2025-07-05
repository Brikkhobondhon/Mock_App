# 🚀 Supabase Setup Guide for Employee Management System

## 📋 Prerequisites
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project

## 🔧 Step-by-Step Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new organization
5. Create a new project
6. Wait for the project to be ready (2-3 minutes)

### 2. Get Your Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Create a `.env` file in your project root with:
```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Set Up Database Table
1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `database/schema.sql`
3. Click "Run" to create the table and sample data

### 4. Configure Row Level Security (Optional)
The schema includes a basic policy that allows all operations. For production:
1. Go to **Authentication** → **Policies**
2. Create more restrictive policies based on your needs

## 🎯 Features You'll Get

✅ **Real-time synchronization** across all devices  
✅ **PostgreSQL database** with enterprise features  
✅ **Automatic timestamps** and data validation  
✅ **Photo URL storage** for employee images  
✅ **Cross-platform compatibility** (iOS, Android, Web)  
✅ **Offline support** with sync when online  

## 🔍 Testing Your Setup

1. Start your app: `npm start`
2. Add an employee from one device
3. Check another device - the employee should appear automatically!
4. Delete an employee - it should disappear from all devices

## 🛠 Troubleshooting

### Common Issues:
- **"Invalid API key"**: Check your `.env` file credentials
- **"Table not found"**: Run the SQL schema in Supabase
- **"Network error"**: Check your internet connection

### Need Help?
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Setup](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)

## 🎉 You're Ready!

Your Employee Management System now uses a powerful PostgreSQL database with real-time features. Data will sync automatically across all your devices! 

Perfect! ✅ **The `.env` file has been created successfully** with your Supabase credentials.

## 🎉 **Next Steps to Complete Your Setup:**

### **1. Set Up Your Database Table**
You need to create the `employees` table in your Supabase project:

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/mdljsehcmnfcjnmkjokz

2. **Open SQL Editor:**
   - Click on "SQL Editor" in the left sidebar

3. **Run the Database Schema:**
   - Copy and paste this SQL code:

```sql
-- Create employees table in Supabase PostgreSQL
CREATE TABLE IF NOT EXISTS employees (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_created_at ON employees(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);

-- Enable Row Level Security (RLS) for security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo purposes)
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

-- Insert some sample data
INSERT INTO employees (name, designation, department) VALUES
    ('John Doe', 'Software Engineer', 'Engineering'),
    ('Jane Smith', 'Product Manager', 'Product'),
    ('Mike Johnson', 'UX Designer', 'Design')
ON CONFLICT DO NOTHING;
```

4. **Click "Run"** to execute the SQL

### **2. Test Your App** 