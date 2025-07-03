import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ExploreScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');

  const handleSubmit = () => {
    setDisplayText(inputText);
    setInputText('');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>React Native Examples</Text>
        <Text style={styles.subtitle}>Learn by doing!</Text>
      </View>

      {/* Switch Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Switch Component</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>
            Toggle Switch: {isEnabled ? 'ON' : 'OFF'}
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            onValueChange={setIsEnabled}
            value={isEnabled}
          />
        </View>
      </View>

      {/* Text Input Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Text Input</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Type something here..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        
        {displayText ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>You typed: {displayText}</Text>
          </View>
        ) : null}
      </View>

      {/* Component List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>React Native Components</Text>
        <View style={styles.componentList}>
          <Text style={styles.componentItem}>• View - Container component</Text>
          <Text style={styles.componentItem}>• Text - Display text</Text>
          <Text style={styles.componentItem}>• TouchableOpacity - Button</Text>
          <Text style={styles.componentItem}>• TextInput - Input field</Text>
          <Text style={styles.componentItem}>• Switch - Toggle component</Text>
          <Text style={styles.componentItem}>• ScrollView - Scrollable content</Text>
          <Text style={styles.componentItem}>• StyleSheet - CSS-like styling</Text>
        </View>
      </View>

      {/* Hooks Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>React Hooks</Text>
        <View style={styles.hooksList}>
          <Text style={styles.hookItem}>• useState - Manage state</Text>
          <Text style={styles.hookItem}>• useEffect - Side effects</Text>
          <Text style={styles.hookItem}>• useRef - Reference values</Text>
          <Text style={styles.hookItem}>• useCallback - Memoize functions</Text>
        </View>
      </View>

      {/* Image Upload Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Image Upload Example</Text>
        <Text style={styles.practiceText}>
          Try integrating an image picker to allow users to upload and display a profile photo, just like in the main Employee Management screen.
        </Text>
      </View>

      {/* Practice Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Practice Ideas</Text>
        <Text style={styles.practiceText}>
          Try adding these features to learn more:
        </Text>
        <Text style={styles.practiceItem}>• Add a color picker</Text>
        <Text style={styles.practiceItem}>• Create a simple calculator</Text>
        <Text style={styles.practiceItem}>• Add image display</Text>
        <Text style={styles.practiceItem}>• Create a todo list</Text>
        <Text style={styles.practiceItem}>• Add navigation between screens</Text>
        <Text style={styles.practiceItem}>• Allow users to upload and display a profile photo</Text>
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultBox: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  componentList: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  componentItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  hooksList: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
  },
  hookItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  practiceText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  practiceItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    marginLeft: 10,
  },
});
