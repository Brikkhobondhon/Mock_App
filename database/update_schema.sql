-- Update existing employees table to add unique constraint
-- Run this in your Supabase SQL Editor

-- Add unique constraint to prevent future duplicates
ALTER TABLE employees 
ADD CONSTRAINT employees_unique_name_designation_department 
UNIQUE(name, designation, department);

-- Remove existing duplicates (keeps the most recent one for each group)
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY name, designation, department 
           ORDER BY created_at DESC
         ) as rn
  FROM employees
)
DELETE FROM employees 
WHERE id IN (
  SELECT id 
  FROM duplicates 
  WHERE rn > 1
);

-- Verify the constraint was added
SELECT 
  constraint_name, 
  constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'employees' 
AND constraint_type = 'UNIQUE'; 