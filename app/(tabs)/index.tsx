import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Employee } from '../../lib/supabase';
import { DatabaseInterface, SupabaseStorage } from '../../lib/supabaseService';

// Using Supabase for all platforms

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [storage, setStorage] = useState<DatabaseInterface | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);

  // Refs for input fields to maintain focus on web
  const nameInputRef = useRef<TextInput>(null);
  const designationInputRef = useRef<TextInput>(null);
  const departmentInputRef = useRef<TextInput>(null);

  // Web-specific input handlers to prevent focus loss
  const handleNameChange = useCallback((text: string) => {
    setName(text);
  }, []);

  const handleDesignationChange = useCallback((text: string) => {
    setDesignation(text);
  }, []);

  const handleDepartmentChange = useCallback((text: string) => {
    setDepartment(text);
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeStorage();
    };
    init();
  }, []);

  const initializeStorage = async () => {
    try {
      console.log('🚀 Initializing Supabase storage...');
      const storageInstance = new SupabaseStorage();
      setStorage(storageInstance);
      
      // Load initial data
      console.log('📥 Loading initial employees...');
      const employeeList = await storageInstance.loadEmployees();
      console.log('📋 Initial employees loaded:', employeeList.length);
      setEmployees(employeeList);
      
      // Set up real-time subscription
      console.log('🔗 Setting up real-time subscription...');
      const subscription = storageInstance.subscribeToEmployees((updatedEmployees: Employee[]) => {
        console.log('🔄 Real-time update received:', updatedEmployees.length, 'employees');
        setEmployees(updatedEmployees);
      });
      
      console.log('✅ Storage initialization complete');
    } catch (error) {
      console.error('❌ Error initializing storage:', error);
    }
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
      base64: true, // Always get base64 for cross-platform compatibility
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.base64) {
        // Use base64 for cross-platform compatibility
        setPhoto(`data:image/jpeg;base64,${asset.base64}`);
      } else {
        // Fallback to URI if base64 is not available
        setPhoto(asset.uri);
      }
    }
  };

  const convertUriToBase64 = async (uri: string): Promise<string> => {
    if (uri.startsWith('data:image/')) {
      return uri; // Already a base64 data URL
    }
    
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting URI to base64:', error);
      return uri; // Fallback to original URI
    }
  };

  const uploadImageToBackend = async (uri: string): Promise<string> => {
    // For now, we'll store the base64 data directly in the database
    // In a production app, you would upload to a cloud storage service like AWS S3, Cloudinary, etc.
    if (uri.startsWith('data:image/')) {
      // Already a base64 data URL, return as is
      return uri;
    } else if (uri.startsWith('file://')) {
      // Local file URI - convert to base64
      return await convertUriToBase64(uri);
    } else {
      // Other URI types (http, https, etc.)
      return uri;
    }
  };

  const addEmployee = async () => {
    if (!name.trim() || !designation.trim() || !department.trim()) {
      Alert.alert('Validation Error', 'Please enter name, designation, and department');
      return;
    }
    if (!storage) return;
    
    setIsAddingEmployee(true);
    
    try {
      let uploadedPhotoUrl = '';
      if (photo) {
        console.log('🖼️ Processing image for cross-platform compatibility...');
        uploadedPhotoUrl = await uploadImageToBackend(photo);
        console.log('✅ Image processed successfully');
      }
      
      const currentTime = new Date().toISOString();
      await storage.addEmployee({
        name: name.trim(),
        designation: designation.trim(),
        department: department.trim(),
        created_at: currentTime,
        photo_url: uploadedPhotoUrl,
      });
      
      setName('');
      setDesignation('');
      setDepartment('');
      setPhoto(null);
      
      // Reload employees
      const updatedEmployees = await storage.loadEmployees();
      setEmployees(updatedEmployees);
      Alert.alert('Success', 'Employee added successfully!');
    } catch (error: any) {
      console.error('Error adding employee:', error);
      if (error.message?.includes('already exists')) {
        Alert.alert('Duplicate Employee', 'An employee with the same name, designation, and department already exists.');
      } else {
        Alert.alert('Error', 'Failed to add employee');
      }
    } finally {
      setIsAddingEmployee(false);
    }
  };

  const deleteEmployee = (id: number) => {
    // For web platform, use a more direct approach
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this employee?')) {
        handleDeleteEmployee(id);
      }
    } else {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this employee?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => handleDeleteEmployee(id),
          },
        ]
      );
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!storage) return;
    
    setDeletingId(id);
    
    try {
      await storage.deleteEmployee(id);
      const updatedEmployees = await storage.loadEmployees();
      setEmployees(updatedEmployees);
      
      if (Platform.OS === 'web') {
        alert('Employee deleted successfully!');
      } else {
        Alert.alert('Success', 'Employee deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      const errorMessage = 'Failed to delete employee';
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setDeletingId(null);
    }
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

  const removeDuplicates = () => {
    Alert.alert(
      'Remove Duplicates',
      'This will remove duplicate employees (same name, designation, and department). The most recent entry will be kept.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove Duplicates',
          style: 'default',
          onPress: async () => {
            if (!storage) return;
            
            try {
              const result = await storage.removeDuplicates();
              Alert.alert('Success', result.message);
              
              // Reload employees to show updated list
              const updatedEmployees = await storage.loadEmployees();
              setEmployees(updatedEmployees);
            } catch (error) {
              console.error('Error removing duplicates:', error);
              Alert.alert('Error', 'Failed to remove duplicates');
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
          {item.photo_url ? (
            <ExpoImage
              source={{ uri: item.photo_url }}
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
              contentFit="cover"
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
          Added: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.deleteButton,
          deletingId === item.id && styles.deleteButtonDisabled
        ]}
        onPress={() => deleteEmployee(item.id)}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Delete employee"
        accessibilityRole="button"
        disabled={deletingId === item.id}
      >
        {deletingId === item.id ? (
          <MaterialIcons name="hourglass-empty" size={20} color="white" />
        ) : (
          <MaterialIcons name="delete" size={20} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );

  // Create header component for FlatList
  const ListHeaderComponent = React.memo(() => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Employee Management</Text>
        <Text style={styles.subtitle}>
          Professional HR System with Real-time PostgreSQL Database
        </Text>
      </View>

      {/* Employee List Header */}
      <View style={styles.section}>
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Employee Directory ({employees.length})</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity 
              style={[styles.clearButton, { backgroundColor: '#3498db' }]} 
              onPress={async () => {
                if (storage) {
                  const updatedEmployees = await storage.loadEmployees();
                  setEmployees(updatedEmployees);
                }
              }}
            >
              <Text style={styles.clearButtonText}>🔄 Refresh</Text>
            </TouchableOpacity>
            {employees.length > 0 && (
              <>
                <TouchableOpacity 
                  style={[styles.clearButton, { backgroundColor: '#f39c12' }]} 
                  onPress={removeDuplicates}
                >
                  <Text style={styles.clearButtonText}>🧹 Remove Duplicates</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearButton} onPress={clearAllEmployees}>
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
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
      </View>
    </>
  ));

  // Create footer component for FlatList
  const ListFooterComponent = React.memo(() => (
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
  ));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Collapsible Input Form */}
      <View style={[styles.inputFormContainer, isFormCollapsed && styles.collapsedForm]}>
        <View style={styles.formHeader}>
          <Text style={styles.sectionTitle}>Add New Employee</Text>
          <TouchableOpacity 
            style={styles.collapseButton}
            onPress={() => setIsFormCollapsed(!isFormCollapsed)}
          >
            <MaterialIcons 
              name={isFormCollapsed ? "expand-more" : "expand-less"} 
              size={24} 
              color="#3498db" 
            />
          </TouchableOpacity>
        </View>
        
        {!isFormCollapsed && (
          <>
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  ref={nameInputRef}
                  style={styles.input}
                  placeholder="Enter name"
                  value={name}
                  onChangeText={handleNameChange}
                  placeholderTextColor="#999"
                  autoComplete="name"
                  autoCorrect={false}
                  autoCapitalize="words"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  selectTextOnFocus={false}
                  {...(Platform.OS === 'android' && {
                    textAlignVertical: 'center',
                  })}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Designation</Text>
                <TextInput
                  ref={designationInputRef}
                  style={styles.input}
                  placeholder="e.g., Engineer"
                  value={designation}
                  onChangeText={handleDesignationChange}
                  placeholderTextColor="#999"
                  autoComplete="off"
                  autoCorrect={false}
                  autoCapitalize="words"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  selectTextOnFocus={false}
                  {...(Platform.OS === 'android' && {
                    textAlignVertical: 'center',
                  })}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Department</Text>
                <TextInput
                  ref={departmentInputRef}
                  style={styles.input}
                  placeholder="e.g., Engineering"
                  value={department}
                  onChangeText={handleDepartmentChange}
                  placeholderTextColor="#999"
                  autoComplete="off"
                  autoCorrect={false}
                  autoCapitalize="words"
                  returnKeyType="done"
                  blurOnSubmit={true}
                  selectTextOnFocus={false}
                  {...(Platform.OS === 'android' && {
                    textAlignVertical: 'center',
                  })}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Photo</Text>
                <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                  <MaterialIcons name="cloud-upload" size={16} color="#fff" style={{ marginRight: 4 }} />
                  <Text style={styles.photoButtonText}>Upload</Text>
                </TouchableOpacity>
                {photo && (
                  <ExpoImage
                    source={{ uri: photo }}
                    style={{ width: 32, height: 32, borderRadius: 16, marginLeft: 8 }}
                    contentFit="cover"
                  />
                )}
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.addButton, isAddingEmployee && styles.addButtonDisabled]} 
              onPress={addEmployee}
              disabled={isAddingEmployee}
            >
              <Text style={styles.buttonText}>
                {isAddingEmployee ? 'Adding...' : 'Add Employee'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      
      {/* Employee List - Below input form */}
      <FlatList
        data={employees}
        renderItem={renderEmployee}
        keyExtractor={(item) => `employee-${item.id}`}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={null} // We handle empty state in header
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        removeClippedSubviews={false}
        getItemLayout={(data, index) => ({
          length: 80, // Approximate height of each item
          offset: 80 * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    padding: 20,
    paddingBottom: 40, // Add extra padding at bottom for better scrolling
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
  addButtonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
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
    maxHeight: undefined,
    flex: 1,
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
    marginHorizontal: 0, // Ensure no horizontal margin issues
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
    minWidth: 40,
    minHeight: 40,
  },
  deleteButtonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
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
  inputFormContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  collapsedForm: {
    paddingBottom: 10,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  collapseButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
});