import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
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
  photoUrl?: string;
}

// Platform-specific database interface
interface DatabaseInterface {
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  loadEmployees: () => Promise<Employee[]>;
  deleteEmployee: (id: number) => Promise<void>;
  clearAllEmployees: () => Promise<void>;
}

// Web storage implementation
class WebStorage implements DatabaseInterface {
  private readonly STORAGE_KEY = 'employees';

  async addEmployee(employee: Omit<Employee, 'id'>): Promise<void> {
    const employees = await this.loadEmployees();
    const newEmployee: Employee = {
      ...employee,
      id: Date.now(),
    };
    const updatedEmployees = [newEmployee, ...employees];
    await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedEmployees));
  }

  async loadEmployees(): Promise<Employee[]> {
    try {
      const storedEmployees = await AsyncStorage.getItem(this.STORAGE_KEY);
      return storedEmployees ? JSON.parse(storedEmployees) : [];
    } catch (error) {
      console.error('Error loading employees from storage:', error);
      return [];
    }
  }

  async deleteEmployee(id: number): Promise<void> {
    const employees = await this.loadEmployees();
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedEmployees));
  }

  async clearAllEmployees(): Promise<void> {
    await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
  }
}

// Mobile SQLite implementation
class MobileStorage implements DatabaseInterface {
  private db: any = null;

  async initialize(): Promise<void> {
    if (Platform.OS === 'web') return;
    
    try {
      // Dynamic import only on mobile
      const SQLite = await import('expo-sqlite');
      this.db = SQLite.openDatabaseSync('employees.db');
      
      await this.db.execAsync(
        'CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, designation TEXT, department TEXT, createdAt TEXT)'
      );
      
      // Try to add department column for existing databases
      try {
        await this.db.execAsync('ALTER TABLE employees ADD COLUMN department TEXT DEFAULT ""');
      } catch (error: any) {
        // Column might already exist, which is fine
        console.log('Migration info:', error.message);
      }
    } catch (error) {
      console.error('Error initializing mobile database:', error);
    }
  }

  async addEmployee(employee: Omit<Employee, 'id'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.runAsync(
      'INSERT INTO employees (name, designation, department, createdAt) VALUES (?, ?, ?, ?)',
      [employee.name, employee.designation, employee.department, employee.createdAt]
    );
    console.log('Employee added successfully with ID:', result.lastInsertRowId);
  }

  async loadEmployees(): Promise<Employee[]> {
    if (!this.db) return [];
    
    try {
      const result = await this.db.getAllAsync('SELECT * FROM employees ORDER BY createdAt DESC');
      return result as Employee[];
    } catch (error) {
      console.error('Error loading employees:', error);
      return [];
    }
  }

  async deleteEmployee(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync('DELETE FROM employees WHERE id = ?', [id]);
    console.log('Employee deleted successfully');
  }

  async clearAllEmployees(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync('DELETE FROM employees', []);
    console.log('All employees deleted successfully');
  }
}

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [storage, setStorage] = useState<DatabaseInterface | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    initializeStorage();
  }, []);

  const initializeStorage = async () => {
    let storageInstance: DatabaseInterface;
    
    if (Platform.OS === 'web') {
      storageInstance = new WebStorage();
    } else {
      storageInstance = new MobileStorage();
      await (storageInstance as MobileStorage).initialize();
    }
    
    setStorage(storageInstance);
    
    // Load initial data
    const employeeList = await storageInstance.loadEmployees();
    setEmployees(employeeList);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access media library is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: Platform.OS === 'web', // Only get base64 on web
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const pickedUri = result.assets[0].uri;
      if (Platform.OS !== 'web') {
        // Copy to app's document directory for robust storage
        const fileName = pickedUri.split('/').pop();
        if (FileSystem.documentDirectory && fileName) {
          const newPath = FileSystem.documentDirectory + fileName;
          try {
            await FileSystem.copyAsync({ from: pickedUri, to: newPath });
            setPhoto(newPath);
          } catch (err) {
            Alert.alert('Error', 'Failed to save image to app storage.');
            setPhoto(pickedUri); // fallback
          }
        } else {
          setPhoto(pickedUri); // fallback if path or filename is missing
        }
      } else {
        // On web, use base64
        if (result.assets[0].base64) {
          setPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
        } else {
          setPhoto(pickedUri); // fallback
        }
      }
    }
  };

  const uploadImageToBackend = async (uri: string): Promise<string> => {
    // TODO: Replace with actual upload logic
    // For now, just return the local URI
    return uri;
  };

  const addEmployee = async () => {
    if (!name.trim() || !designation.trim() || !department.trim()) {
      Alert.alert('Validation Error', 'Please enter name, designation, and department');
      return;
    }
    if (!storage) return;
    try {
      let uploadedPhotoUrl = '';
      if (photo) {
        uploadedPhotoUrl = await uploadImageToBackend(photo);
      }
      const currentTime = new Date().toISOString();
      await storage.addEmployee({
        name: name.trim(),
        designation: designation.trim(),
        department: department.trim(),
        createdAt: currentTime,
        photoUrl: uploadedPhotoUrl,
      });
      setName('');
      setDesignation('');
      setDepartment('');
      setPhoto(null);
      // Reload employees
      const updatedEmployees = await storage.loadEmployees();
      setEmployees(updatedEmployees);
      Alert.alert('Success', 'Employee added successfully!');
    } catch (error) {
      console.error('Error adding employee:', error);
      Alert.alert('Error', 'Failed to add employee');
    }
  };

  const deleteEmployee = (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this employee?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!storage) return;
            
            try {
              await storage.deleteEmployee(id);
              const updatedEmployees = await storage.loadEmployees();
              setEmployees(updatedEmployees);
              Alert.alert('Success', 'Employee deleted successfully!');
            } catch (error) {
              console.error('Error deleting employee:', error);
              Alert.alert('Error', 'Failed to delete employee');
            }
          },
        },
      ]
    );
  };

  const clearAllEmployees = () => {
    Alert.alert(
      'Confirm Clear All',
      'Are you sure you want to delete all employees? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            if (!storage) return;
            
            try {
              await storage.clearAllEmployees();
              setEmployees([]);
              Alert.alert('Success', 'All employees deleted successfully!');
            } catch (error) {
              console.error('Error clearing employees:', error);
              Alert.alert('Error', 'Failed to clear employees');
            }
          },
        },
      ]
    );
  };

  const renderEmployee = ({ item }: { item: Employee }) => (
    <View style={styles.employeeCard}>
      <View style={styles.employeeInfo}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item.photoUrl ? (
            <Image
              source={{ uri: item.photoUrl }}
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
            />
          ) : (
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee', marginRight: 10, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="person" size={28} color="#bbb" />
            </View>
          )}
          <Text style={styles.employeeName}>{item.name}</Text>
        </View>
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
        <Text style={styles.subtitle}>
          Professional HR System {Platform.OS === 'web' ? '(Web Version)' : '(Mobile Version)'}
        </Text>
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
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Photo</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                <MaterialIcons name="cloud-upload" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.photoButtonText}>Upload Image</Text>
              </TouchableOpacity>
              {photo && (
                <Image
                  source={{ uri: photo }}
                  style={{ width: 48, height: 48, borderRadius: 24, marginLeft: 12 }}
                />
              )}
            </View>
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
            <Text style={styles.listItem}>
              • {Platform.OS === 'web' ? 'Browser storage (AsyncStorage)' : 'Secure SQLite database storage'}
            </Text>
            <Text style={styles.listItem}>• Real-time data synchronization</Text>
            <Text style={styles.listItem}>• Professional user interface</Text>
            <Text style={styles.listItem}>• Data validation and error handling</Text>
            <Text style={styles.listItem}>• Confirmation dialogs for data safety</Text>
            <Text style={styles.listItem}>• Cross-platform compatibility (Mobile & Web)</Text>
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
  photoButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});