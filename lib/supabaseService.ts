import { Employee, EMPLOYEES_TABLE, supabase } from './supabase';

export interface DatabaseInterface {
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  loadEmployees: () => Promise<Employee[]>;
  deleteEmployee: (id: number) => Promise<void>;
  clearAllEmployees: () => Promise<void>;
  removeDuplicates: () => Promise<{ removed: number; message: string }>;
}

export class SupabaseStorage implements DatabaseInterface {
  async addEmployee(employee: Omit<Employee, 'id'>): Promise<void> {
    try {
      console.log('➕ Adding employee to Supabase:', employee);
      
      // First, check if employee already exists
      const { data: existingEmployees, error: checkError } = await supabase
        .from(EMPLOYEES_TABLE)
        .select('*')
        .eq('name', employee.name)
        .eq('designation', employee.designation)
        .eq('department', employee.department);

      if (checkError) {
        console.error('❌ Error checking for duplicates:', checkError);
        if (checkError.code === 'PGRST116') {
          throw new Error('Database table not found. Please run the schema.sql in your Supabase SQL Editor first.');
        }
        throw new Error(`Failed to check for duplicates: ${checkError.message}`);
      }

      if (existingEmployees && existingEmployees.length > 0) {
        throw new Error('Employee already exists with the same name, designation, and department');
      }

      // If no duplicates found, add the employee
      const { data, error } = await supabase
        .from(EMPLOYEES_TABLE)
        .insert([employee])
        .select();

      if (error) {
        console.error('❌ Error adding employee:', error);
        if (error.code === 'PGRST116') {
          throw new Error('Database table not found. Please run the schema.sql in your Supabase SQL Editor first.');
        }
        if (error.code === '42501') {
          throw new Error('Permission denied. Please check your Supabase RLS policies.');
        }
        throw new Error(`Failed to add employee: ${error.message}`);
      }

      console.log('✅ Employee added successfully:', data);
    } catch (error) {
      console.error('❌ Supabase addEmployee error:', error);
      throw error;
    }
  }

  async loadEmployees(): Promise<Employee[]> {
    try {
      console.log('🔍 Attempting to load employees from Supabase...');
      console.log('📊 Table name:', EMPLOYEES_TABLE);
      
      const { data, error } = await supabase
        .from(EMPLOYEES_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      console.log('📋 Supabase response:', { data, error });

      if (error) {
        console.error('❌ Error loading employees:', error);
        if (error.code === 'PGRST116') {
          throw new Error('Database table not found. Please run the schema.sql in your Supabase SQL Editor first.');
        }
        if (error.code === '42501') {
          throw new Error('Permission denied. Please check your Supabase RLS policies.');
        }
        throw new Error(`Failed to load employees: ${error.message}`);
      }

      console.log('✅ Successfully loaded employees:', data);
      return data || [];
    } catch (error) {
      console.error('❌ Supabase loadEmployees error:', error);
      return [];
    }
  }

  async deleteEmployee(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from(EMPLOYEES_TABLE)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting employee:', error);
        throw new Error(`Failed to delete employee: ${error.message}`);
      }

      console.log('Employee deleted successfully');
    } catch (error) {
      console.error('Supabase deleteEmployee error:', error);
      throw error;
    }
  }

  async clearAllEmployees(): Promise<void> {
    try {
      const { error } = await supabase
        .from(EMPLOYEES_TABLE)
        .delete()
        .neq('id', 0); // Delete all records

      if (error) {
        console.error('Error clearing employees:', error);
        throw new Error(`Failed to clear employees: ${error.message}`);
      }

      console.log('All employees deleted successfully');
    } catch (error) {
      console.error('Supabase clearAllEmployees error:', error);
      throw error;
    }
  }

  // Real-time subscription for live updates
  subscribeToEmployees(callback: (employees: Employee[]) => void) {
    return supabase
      .channel('employees_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: EMPLOYEES_TABLE,
        },
        async () => {
          // Reload employees when changes occur
          const employees = await this.loadEmployees();
          callback(employees);
        }
      )
      .subscribe();
  }

  // Remove duplicate employees (keeps the most recent one)
  async removeDuplicates(): Promise<{ removed: number; message: string }> {
    try {
      console.log('🧹 Starting duplicate removal process...');
      
      // Get all employees
      const { data: allEmployees, error: fetchError } = await supabase
        .from(EMPLOYEES_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(`Failed to fetch employees: ${fetchError.message}`);
      }

      if (!allEmployees) {
        return { removed: 0, message: 'No employees found' };
      }

      // Group by name, designation, and department
      const groups = new Map<string, Employee[]>();
      allEmployees.forEach(employee => {
        const key = `${employee.name}-${employee.designation}-${employee.department}`;
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key)!.push(employee);
      });

      // Find duplicates and remove them
      let removedCount = 0;
      const duplicatesToRemove: number[] = [];

      for (const [key, employees] of groups) {
        if (employees.length > 1) {
          console.log(`🔍 Found ${employees.length} duplicates for: ${key}`);
          // Keep the first one (most recent due to DESC order), remove the rest
          const duplicates = employees.slice(1);
          duplicates.forEach(emp => {
            duplicatesToRemove.push(emp.id);
            removedCount++;
          });
        }
      }

      // Remove duplicates in batches
      if (duplicatesToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from(EMPLOYEES_TABLE)
          .delete()
          .in('id', duplicatesToRemove);

        if (deleteError) {
          throw new Error(`Failed to remove duplicates: ${deleteError.message}`);
        }

        console.log(`✅ Removed ${removedCount} duplicate employees`);
        return { 
          removed: removedCount, 
          message: `Successfully removed ${removedCount} duplicate employees` 
        };
      }

      return { removed: 0, message: 'No duplicates found' };
    } catch (error) {
      console.error('❌ Error removing duplicates:', error);
      throw error;
    }
  }
} 