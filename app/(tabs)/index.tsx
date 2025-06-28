import * as SQLite from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    ScrollView,
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
  createdAt: string;
}

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = () => {
    const database = SQLite.openDatabaseSync('employees.db');
    setDb(database);
    
    database.execAsync('CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, designation TEXT, createdAt TEXT)')
      .then(() => {
        console.log('Table created successfully');
        loadEmployees();
      })
      .catch((error: any) => {
        console.error('Error creating table:', error);
      });
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
    if (!name.trim() || !designation.trim()) {
      Alert.alert('Error', 'Please enter both name and designation');
      return;
    }

    if (!db) return;

    const currentTime = new Date().toISOString();
    
    db.runAsync('INSERT INTO employees (name, designation, createdAt) VALUES (?, ?, ?)', 
      [name.trim(), designation.trim(), currentTime])
      .then((result) => {
        console.log('Employee added successfully with ID:', result.lastInsertRowId);
        setName('');
        setDesignation('');
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
        <Text style={styles.employeeDate}>
          Added: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteEmployee(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Employee Management</Text>
        <Text style={styles.subtitle}>Add and manage employee records</Text>
      </View>

      {/* Input Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add New Employee</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Enter employee name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Enter designation"
          value={designation}
          onChangeText={setDesignation}
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity style={styles.addButton} onPress={addEmployee}>
          <Text style={styles.buttonText}>Add Employee</Text>
        </TouchableOpacity>
      </View>

      {/* Employee List */}
      <View style={styles.section}>
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Employee List</Text>
          {employees.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearAllEmployees}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {employees.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No employees added yet</Text>
            <Text style={styles.emptySubtext}>Add your first employee above</Text>
          </View>
        ) : (
          <FlatList
            data={employees}
            renderItem={renderEmployee}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            style={styles.employeeList}
          />
        )}
      </View>

      {/* Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Features</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            This app demonstrates:
          </Text>
          <Text style={styles.listItem}>• SQLite database integration</Text>
          <Text style={styles.listItem}>• CRUD operations (Create, Read, Delete)</Text>
          <Text style={styles.listItem}>• Form input handling</Text>
          <Text style={styles.listItem}>• Data persistence</Text>
          <Text style={styles.listItem}>• List rendering with FlatList</Text>
          <Text style={styles.listItem}>• Alert dialogs for user confirmation</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  employeeList: {
    maxHeight: 400,
  },
  employeeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  employeeDesignation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  employeeDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  listItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    marginLeft: 10,
  },
});