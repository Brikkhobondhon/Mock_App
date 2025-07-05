import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ExploreScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📚 Project Documentation</Text>
        <Text style={styles.subtitle}>Complete Implementation Guide</Text>
      </View>

      {/* Project Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Project Overview</Text>
        <Text style={styles.description}>
          This is a professional Employee Management System built with React Native and Expo, 
          featuring real-time PostgreSQL database integration via Supabase. The app supports 
          both mobile and web platforms with a unified codebase.
        </Text>
      </View>

      {/* Technology Stack */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛠 Technology Stack</Text>
        
        <View style={styles.techCategory}>
          <Text style={styles.categoryTitle}>Frontend Framework</Text>
          <Text style={styles.techItem}>• React Native 0.79.4</Text>
          <Text style={styles.techItem}>• Expo SDK 53.0.13</Text>
          <Text style={styles.techItem}>• TypeScript 5.8.3</Text>
        </View>

        <View style={styles.techCategory}>
          <Text style={styles.categoryTitle}>Database & Backend</Text>
          <Text style={styles.techItem}>• Supabase (PostgreSQL)</Text>
          <Text style={styles.techItem}>• Real-time subscriptions</Text>
          <Text style={styles.techItem}>• Row Level Security (RLS)</Text>
        </View>

        <View style={styles.techCategory}>
          <Text style={styles.categoryTitle}>UI & Styling</Text>
          <Text style={styles.techItem}>• React Native StyleSheet</Text>
          <Text style={styles.techItem}>• Expo Vector Icons</Text>
          <Text style={styles.techItem}>• Responsive design</Text>
        </View>

        <View style={styles.techCategory}>
          <Text style={styles.categoryTitle}>Development Tools</Text>
          <Text style={styles.techItem}>• ESLint for code quality</Text>
          <Text style={styles.techItem}>• Metro bundler</Text>
          <Text style={styles.techItem}>• Hot reloading</Text>
        </View>
      </View>

      {/* File Structure */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📁 File Structure & Architecture</Text>
        
        <View style={styles.fileCategory}>
          <Text style={styles.categoryTitle}>App Entry Points</Text>
          <Text style={styles.fileItem}>📄 app/_layout.tsx - Root layout with navigation</Text>
          <Text style={styles.fileItem}>📄 app/(tabs)/_layout.tsx - Tab navigation setup</Text>
          <Text style={styles.fileItem}>📄 app/(tabs)/index.tsx - Main employee management screen</Text>
          <Text style={styles.fileItem}>📄 app/(tabs)/explore.tsx - This documentation screen</Text>
        </View>

        <View style={styles.fileCategory}>
          <Text style={styles.categoryTitle}>Database & Services</Text>
          <Text style={styles.fileItem}>📄 lib/supabase.ts - Supabase client configuration</Text>
          <Text style={styles.fileItem}>📄 lib/supabaseService.ts - Database operations & business logic</Text>
          <Text style={styles.fileItem}>📄 database/schema.sql - Database table structure</Text>
          <Text style={styles.fileItem}>📄 database/update_schema.sql - Database migrations</Text>
        </View>

        <View style={styles.fileCategory}>
          <Text style={styles.categoryTitle}>Configuration Files</Text>
          <Text style={styles.fileItem}>📄 package.json - Dependencies & scripts</Text>
          <Text style={styles.fileItem}>📄 app.json - Expo configuration</Text>
          <Text style={styles.fileItem}>📄 tsconfig.json - TypeScript configuration</Text>
          <Text style={styles.fileItem}>📄 .env - Environment variables (Supabase credentials)</Text>
        </View>

        <View style={styles.fileCategory}>
          <Text style={styles.categoryTitle}>Components & Utilities</Text>
          <Text style={styles.fileItem}>📄 components/ - Reusable UI components</Text>
          <Text style={styles.fileItem}>📄 hooks/ - Custom React hooks</Text>
          <Text style={styles.fileItem}>📄 constants/ - App constants & colors</Text>
        </View>
      </View>

      {/* Database Architecture */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🗄️ Database Architecture</Text>
        
        <Text style={styles.subsectionTitle}>PostgreSQL Table Structure</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>employees table:</Text>
          <Text style={styles.codeLine}>• id (BIGSERIAL PRIMARY KEY)</Text>
          <Text style={styles.codeLine}>• name (VARCHAR(255) NOT NULL)</Text>
          <Text style={styles.codeLine}>• designation (VARCHAR(255) NOT NULL)</Text>
          <Text style={styles.codeLine}>• department (VARCHAR(255) NOT NULL)</Text>
          <Text style={styles.codeLine}>• photo_url (TEXT)</Text>
          <Text style={styles.codeLine}>• created_at (TIMESTAMP WITH TIME ZONE)</Text>
          <Text style={styles.codeLine}>• updated_at (TIMESTAMP WITH TIME ZONE)</Text>
        </View>

        <Text style={styles.subsectionTitle}>Key Features</Text>
        <Text style={styles.featureItem}>🔐 Row Level Security (RLS) enabled</Text>
        <Text style={styles.featureItem}>🔄 Automatic timestamp updates via triggers</Text>
        <Text style={styles.featureItem}>📊 Performance indexes on created_at and department</Text>
        <Text style={styles.featureItem}>🚫 Unique constraint on (name, designation, department)</Text>
        <Text style={styles.featureItem}>⚡ Real-time subscriptions for live updates</Text>
      </View>

      {/* Cross-Platform Implementation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌐 Cross-Platform Implementation</Text>
        
        <Text style={styles.subsectionTitle}>Unified Codebase Strategy</Text>
        <Text style={styles.description}>
          The app uses a single codebase that works on both mobile (iOS/Android) and web platforms 
          through Expo's universal platform support.
        </Text>

        <Text style={styles.subsectionTitle}>Platform-Specific Adaptations</Text>
        <View style={styles.platformList}>
          <Text style={styles.platformItem}>📱 Mobile (iOS/Android):</Text>
          <Text style={styles.platformSubItem}>  • Native navigation and gestures</Text>
          <Text style={styles.platformSubItem}>  • Platform-specific icons and styling</Text>
          <Text style={styles.platformSubItem}>  • Touch-optimized interactions</Text>
          
          <Text style={styles.platformItem}>🌐 Web:</Text>
          <Text style={styles.platformSubItem}>  • Browser-optimized scrolling</Text>
          <Text style={styles.platformSubItem}>  • Mouse and keyboard interactions</Text>
          <Text style={styles.platformSubItem}>  • Responsive design for different screen sizes</Text>
        </View>

        <Text style={styles.subsectionTitle}>Key Implementation Details</Text>
        <Text style={styles.implementationItem}>• FlatList with proper virtualization for performance</Text>
        <Text style={styles.implementationItem}>• Platform-specific image handling (base64 for web)</Text>
        <Text style={styles.implementationItem}>• Responsive styling that adapts to screen size</Text>
        <Text style={styles.implementationItem}>• Unified state management across platforms</Text>
      </View>

      {/* State Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ State Management</Text>
        
        <Text style={styles.subsectionTitle}>React Hooks Pattern</Text>
        <View style={styles.stateList}>
          <Text style={styles.stateItem}>• useState - Form inputs, UI state</Text>
          <Text style={styles.stateItem}>• useEffect - Side effects, data loading</Text>
          <Text style={styles.stateItem}>• Custom hooks - Reusable logic</Text>
        </View>

        <Text style={styles.subsectionTitle}>Data Flow</Text>
        <Text style={styles.flowItem}>1. User input → Form state (useState)</Text>
        <Text style={styles.flowItem}>2. Form submission → Supabase service</Text>
        <Text style={styles.flowItem}>3. Database update → Real-time subscription</Text>
        <Text style={styles.flowItem}>4. UI update → Component re-render</Text>
      </View>

      {/* Security & Best Practices */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔒 Security & Best Practices</Text>
        
        <Text style={styles.subsectionTitle}>Security Measures</Text>
        <Text style={styles.securityItem}>• Environment variables for sensitive data</Text>
        <Text style={styles.securityItem}>• Row Level Security (RLS) policies</Text>
        <Text style={styles.securityItem}>• Input validation and sanitization</Text>
        <Text style={styles.securityItem}>• Error handling without exposing internals</Text>

        <Text style={styles.subsectionTitle}>Code Quality</Text>
        <Text style={styles.qualityItem}>• TypeScript for type safety</Text>
        <Text style={styles.qualityItem}>• ESLint for code consistency</Text>
        <Text style={styles.qualityItem}>• Modular component architecture</Text>
        <Text style={styles.qualityItem}>• Comprehensive error handling</Text>
      </View>

      {/* Performance Optimizations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Performance Optimizations</Text>
        
        <Text style={styles.optimizationItem}>• Virtualized lists (FlatList) for large datasets</Text>
        <Text style={styles.optimizationItem}>• Efficient re-rendering with proper key props</Text>
        <Text style={styles.optimizationItem}>• Database indexes for fast queries</Text>
        <Text style={styles.optimizationItem}>• Optimized image handling and caching</Text>
        <Text style={styles.optimizationItem}>• Minimal bundle size with tree shaking</Text>
      </View>

      {/* Development Workflow */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔄 Development Workflow</Text>
        
        <Text style={styles.subsectionTitle}>Setup Commands</Text>
        <View style={styles.commandList}>
          <Text style={styles.commandItem}>npm install - Install dependencies</Text>
          <Text style={styles.commandItem}>npm run setup-env - Create environment file</Text>
          <Text style={styles.commandItem}>npm start - Start development server</Text>
          <Text style={styles.commandItem}>npm run reset-project - Reset project state</Text>
        </View>

        <Text style={styles.subsectionTitle}>Development Process</Text>
        <Text style={styles.processItem}>1. Set up Supabase project and credentials</Text>
        <Text style={styles.processItem}>2. Run database schema in Supabase SQL Editor</Text>
        <Text style={styles.processItem}>3. Configure environment variables</Text>
        <Text style={styles.processItem}>4. Start development server</Text>
        <Text style={styles.processItem}>5. Test on multiple platforms</Text>
      </View>

      {/* Troubleshooting */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔧 Troubleshooting Guide</Text>
        
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => openLink('https://supabase.com/docs')}
        >
          <MaterialIcons name="link" size={20} color="#007AFF" />
          <Text style={styles.linkText}>Supabase Documentation</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => openLink('https://docs.expo.dev/')}
        >
          <MaterialIcons name="link" size={20} color="#007AFF" />
          <Text style={styles.linkText}>Expo Documentation</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => openLink('https://reactnative.dev/')}
        >
          <MaterialIcons name="link" size={20} color="#007AFF" />
          <Text style={styles.linkText}>React Native Documentation</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This documentation provides a comprehensive overview of the Employee Management System implementation. 
          For detailed setup instructions, see the SUPABASE_SETUP.md and TROUBLESHOOTING.md files.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    margin: 20,
    marginBottom: 10,
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
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495e',
    marginBottom: 15,
  },
  techCategory: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3498db',
    marginBottom: 10,
  },
  techItem: {
    fontSize: 15,
    color: '#2c3e50',
    marginBottom: 5,
    paddingLeft: 10,
  },
  fileCategory: {
    marginBottom: 20,
  },
  fileItem: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 8,
    paddingLeft: 10,
    fontFamily: 'monospace',
  },
  codeBlock: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  codeLine: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
  },
  featureItem: {
    fontSize: 15,
    color: '#2c3e50',
    marginBottom: 8,
    paddingLeft: 10,
  },
  platformList: {
    marginBottom: 15,
  },
  platformItem: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 5,
  },
  platformSubItem: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 3,
    paddingLeft: 20,
  },
  implementationItem: {
    fontSize: 15,
    color: '#2c3e50',
    marginBottom: 8,
    paddingLeft: 10,
  },
  stateList: {
    marginBottom: 15,
  },
  stateItem: {
    fontSize: 15,
    color: '#2c3e50',
    marginBottom: 5,
    paddingLeft: 10,
  },
  flowItem: {
    fontSize: 15,
    color: '#2c3e50',
    marginBottom: 5,
    paddingLeft: 10,
  },
  securityItem: {
    fontSize: 15,
    color: '#2c3e50',
    marginBottom: 8,
    paddingLeft: 10,
  },
  qualityItem: {
    fontSize: 15,
    color: '#2c3e50',
    marginBottom: 8,
    paddingLeft: 10,
  },
  optimizationItem: {
    fontSize: 15,
    color: '#2c3e50',
    marginBottom: 8,
    paddingLeft: 10,
  },
  commandList: {
    marginBottom: 15,
  },
  commandItem: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
    paddingLeft: 10,
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
  },
  processItem: {
    fontSize: 15,
    color: '#2c3e50',
    marginBottom: 5,
    paddingLeft: 10,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 10,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
});
