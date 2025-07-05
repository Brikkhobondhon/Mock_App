# 🔧 Troubleshooting Supabase Connection Issues

If your data is not being added to the Supabase database, follow these steps to fix the issue:

## 🚨 Quick Fix Checklist

### 1. **Check Environment Variables**
Make sure you have a `.env` file with your Supabase credentials:

```bash
# Run this command to create the .env file
npm run setup-env
```

Then edit the `.env` file and replace the placeholder values with your actual Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. **Get Your Supabase Credentials**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key

### 3. **Create the Database Table**
Run this SQL in your Supabase SQL Editor:

```sql
-- Create employees table in Supabase PostgreSQL
CREATE TABLE IF NOT EXISTS employees (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, designation, department)
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
```

### 4. **Restart Your Development Server**
After updating the `.env` file:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm start
```

## 🔍 Debug Steps

### Check Console Logs
Look for these messages in your console:

- ✅ `🔗 Supabase connection initialized` - Connection successful
- ✅ `✅ Supabase connection successful!` - Database accessible
- ❌ `❌ Missing Supabase credentials!` - Need to set up .env file
- ❌ `❌ Supabase connection test failed` - Check credentials or table

### Common Error Messages

| Error | Solution |
|-------|----------|
| `Database table not found` | Run the schema.sql in Supabase SQL Editor |
| `Permission denied` | Check RLS policies in Supabase |
| `Missing Supabase credentials` | Create .env file with proper credentials |
| `Network error` | Check internet connection and Supabase URL |

## 🛠 Advanced Troubleshooting

### Test Database Connection
Add this to your app temporarily to test the connection:

```javascript
// Test connection
supabase.from('employees').select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error('Connection failed:', error);
    } else {
      console.log('Connection successful! Count:', count);
    }
  });
```

### Check Supabase Dashboard
1. Go to your Supabase project dashboard
2. Check **Table Editor** → **employees** table exists
3. Check **Logs** for any errors
4. Verify **RLS Policies** are set correctly

### Reset and Start Fresh
If nothing works:

1. Delete the `.env` file
2. Run `npm run setup-env`
3. Add your credentials to the new `.env` file
4. Run the schema.sql in Supabase
5. Restart your app

## 📞 Still Having Issues?

1. **Check the console logs** for specific error messages
2. **Verify your Supabase project** is active and not paused
3. **Ensure your API key** has the correct permissions
4. **Check your internet connection**
5. **Try creating a new Supabase project** if the current one has issues

## 🎯 Success Indicators

When everything is working correctly, you should see:

- ✅ Green checkmarks in console logs
- ✅ Data appears in Supabase Table Editor
- ✅ Real-time updates when adding/removing employees
- ✅ No error messages in the app

---

**Need more help?** Check the [Supabase Documentation](https://supabase.com/docs) or create an issue in the project repository. 