import * as SQLite from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Employee {
  id: number;
  name: string;
  designation: string;
  department: string;
  createdAt: string;
}

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = () => {
    try {
      const database = SQLite.openDatabaseSync('employees.db');
      setDb(database);
      
      database.execAsync('CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, designation TEXT, department TEXT, createdAt TEXT)')
        .then(() => {
          console.log('Table created successfully');
          loadEmployees();
        })
        .catch((error: any) => {
          console.error('Error creating table:', error);
        });
    } catch (error) {
      console.error('Error opening database:', error);
    }
  };

  const loadEmployees = () => {
    if (!db) return;
    
    db.getAllAsync('SELECT * FROM employees ORDER BY createdAt DESC')
      .then((result) => {
        setEmployees(result as Employee[]);
      })
      .catch((error: any) => {
        console.error('Error loading employees:', error);
      });
  };

  const addEmployee = () => {
    if (!name.trim() || !designation.trim() || !department.trim()) {
      Alert.alert('Validation Error', 'Please enter name, designation, and department');
      return;
    }

    if (!db) return;

    const currentTime = new Date().toISOString();
    
    db.runAsync('INSERT INTO employees (name, designation, department, createdAt) VALUES (?, ?, ?, ?)', 
      [name.trim(), designation.trim(), department.trim(), currentTime])
      .then((result) => {
        console.log('Employee added successfully with ID:', result.lastInsertRowId);
        setName('');
        setDesignation('');
        setDepartment('');
        loadEmployees();
        Alert.alert('Success', 'Employee added successfully!');
      })
      .catch((error) => {
        console.error('Error adding employee:', error);
        Alert.alert('Error', 'Failed to add employee');
      });
  };

  const deleteEmployee = (id: number) => {
    if (!db) return;

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this employee?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            db.runAsync('DELETE FROM employees WHERE id = ?', [id])
              .then(() => {
                console.log('Employee deleted successfully');
                loadEmployees();
                Alert.alert('Success', 'Employee deleted successfully!');
              })
              .catch((error) => {
                console.error('Error deleting employee:', error);
                Alert.alert('Error', 'Failed to delete employee');
              });
          },
        },
      ]
    );
  };

  const clearAllEmployees = () => {
    if (!db) return;

    Alert.alert(
      'Confirm Clear All',
      'Are you sure you want to delete all employees? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            db.runAsync('DELETE FROM employees', [])
              .then(() => {
                console.log('All employees deleted successfully');
                setEmployees([]);
                Alert.alert('Success', 'All employees deleted successfully!');
              })
              .catch((error) => {
                console.error('Error clearing employees:', error);
                Alert.alert('Error', 'Failed to clear employees');
              });
          },
        },
      ]
    );
  };

  const renderEmployee = ({ item }: { item: Employee }) => (
    <View style={styles.employeeCard}>
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.name}</Text>
        <Text style={styles.employeeDesignation}>{item.designation}</Text>
        <View style={styles.departmentContainer}>
          <Text style={styles.departmentLabel}>Department:</Text>
          <Text style={styles.employeeDepartment}>{item.department}</Text>
        </View>
        <Text style={styles.employeeDate}>
          Added: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteEmployee(item.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Employee Management</Text>
        <Text style={styles.subtitle}>Professional HR System</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Input Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add New Employee</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter employee's full name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Designation</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Software Engineer, Manager"
              value={designation}
              onChangeText={setDesignation}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Department</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Engineering, Marketing, HR"
              value={department}
              onChangeText={setDepartment}
              placeholderTextColor="#999"
            />
          </View>
          
          <TouchableOpacity style={styles.addButton} onPress={addEmployee}>
            <Text style={styles.buttonText}>Add Employee</Text>
          </TouchableOpacity>
        </View>

        {/* Employee List */}
        <View style={styles.section}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Employee Directory</Text>
            {employees.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={clearAllEmployees}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {employees.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyText}>No employees added yet</Text>
              <Text style={styles.emptySubtext}>Start by adding your first employee above</Text>
            </View>
          ) : (
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>Total Employees: {employees.length}</Text>
            </View>
          )}
          
          <FlatList
            data={employees}
            renderItem={renderEmployee}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            style={styles.employeeList}
          />
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Features</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              This professional HR system provides:
            </Text>
            <Text style={styles.listItem}>• Complete employee record management</Text>
            <Text style={styles.listItem}>• Secure SQLite database storage</Text>
            <Text style={styles.listItem}>• Real-time data synchronization</Text>
            <Text style={styles.listItem}>• Professional user interface</Text>
            <Text style={styles.listItem}>• Data validation and error handling</Text>
            <Text style={styles.listItem}>• Confirmation dialogs for data safety</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#ecf0f1',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    color: '#7f8c8d',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  employeeList: {
    maxHeight: 500,
  },
  employeeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 6,
  },
  employeeDesignation: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
    fontWeight: '500',
  },
  departmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  departmentLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
    marginRight: 8,
  },
  employeeDepartment: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  employeeDate: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    shadowColor: '#e74c3c',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: '#ecf0f1',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  infoText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 12,
    fontWeight: '500',
  },
  listItem: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 6,
    marginLeft: 8,
    lineHeight: 20,
  },
});