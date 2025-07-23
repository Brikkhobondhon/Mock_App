# 🚀 Explore - Professional Employee Management System

[![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

A modern, cross-platform React Native application built with Expo that provides a comprehensive HR solution for managing employee records. Features a professional design with advanced functionality, secure database storage, and support for both mobile and web platforms.

## ✨ Features

### 🎯 Core Functionality
- **Complete Employee Records**: Store name, designation, and department information
- **Real-time Data Management**: Add, view, and delete employee records instantly
- **Professional UI/UX**: Modern, clean interface with intuitive navigation
- **Cross-platform Support**: Works seamlessly on iOS, Android, and Web

### 🔒 Data & Security
- **Data Persistence**: Secure local SQLite database storage
- **Validation & Safety**: Form validation and confirmation dialogs
- **Error Handling**: Comprehensive error management and user feedback
- **Input Sanitization**: Prevents data corruption and ensures integrity

### 📊 Analytics & Insights
- **Employee Statistics**: View total employee count and department breakdown
- **Data Visualization**: Clean card-based layout for easy data consumption
- **Search & Filter**: Quick access to employee information

### 🎨 Design & UX
- **Professional Color Palette**: Modern blue and gray theme
- **Responsive Design**: Optimized for various screen sizes
- **Accessibility**: Built with accessibility best practices
- **Dark Mode Ready**: Prepared for theme switching

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo SDK 53](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **Database**: [SQLite](https://www.sqlite.org/) (expo-sqlite) for local data persistence
- **Backend**: [Supabase](https://supabase.com/) for cloud database (optional)
- **Navigation**: [Expo Router](https://expo.github.io/router/) for file-based routing
- **UI Components**: Native React Native components with custom styling
- **State Management**: React hooks (useState, useEffect, Context API)

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your mobile device

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/explore.git
   cd explore
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional for Supabase)
   ```bash
   npm run setup-env
   ```
   Then edit the `.env` file with your Supabase credentials if needed.

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run the app**
   - **📱 Mobile**: Scan QR code with Expo Go (Android) or Camera app (iOS)
   - **🌐 Web**: Press `w` to open in browser
   - **🤖 Android Emulator**: Press `a`
   - **🍎 iOS Simulator**: Press `i`

## 📱 App Structure

```
explore/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Main employee management screen
│   │   └── explore.tsx    # Project information screen
│   └── _layout.tsx        # Root layout configuration
├── components/            # Reusable UI components
├── constants/             # App constants and configuration
├── database/              # Database schema and migrations
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and services
└── assets/                # Images, fonts, and static assets
```

## 🎯 How to Use

### Adding an Employee
1. **Full Name**: Enter the employee's complete name
2. **Designation**: Specify their job title (e.g., Software Engineer, Manager)
3. **Department**: Select their department (e.g., Engineering, Marketing, HR)
4. **Save**: Tap "Add Employee" to store the record

### Managing Employees
- **View Directory**: All employees are displayed in a professional card layout
- **Employee Details**: Each card shows name, designation, department, and creation date
- **Delete Individual**: Tap the "×" button on any employee card
- **Clear All**: Use "Clear All" to remove all employees at once

## 📊 Database Schema

The system creates an `employees` table with the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Auto-incrementing primary key |
| `name` | TEXT | Employee's full name |
| `designation` | TEXT | Job title/position |
| `department` | TEXT | Department/team assignment |
| `createdAt` | TEXT | ISO timestamp of record creation |

## 🎨 Design Features

- **Professional Color Palette**: Modern blue and gray theme
- **Card-based Layout**: Clean, organized information display
- **Typography Hierarchy**: Clear visual hierarchy with proper font weights
- **Shadow Effects**: Subtle depth and elevation for modern feel
- **Responsive Spacing**: Consistent padding and margins
- **Interactive Elements**: Hover states and visual feedback

## 🔧 Development

### Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Start Android development
npm run ios        # Start iOS development
npm run web        # Start web development
npm run lint       # Run ESLint
npm run reset-project  # Reset project configuration
npm run setup-env  # Set up environment variables
```

### Code Style

This project follows:
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Functional components** with hooks
- **Component-based architecture**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

If you encounter any issues, please check our [Troubleshooting Guide](TROUBLESHOOTING.md) or [Supabase Setup Guide](SUPABASE_SETUP.md).

### Common Issues

| Issue | Solution |
|-------|----------|
| `Missing Supabase credentials` | Run `npm run setup-env` and configure `.env` |
| `Metro bundler issues` | Clear cache with `npx expo start --clear` |
| `Build failures` | Check Node.js version and dependencies |

## 📞 Support

- **Documentation**: Check the [Expo docs](https://docs.expo.dev/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/explore/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/explore/discussions)

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [React Native](https://reactnative.dev/) for cross-platform development
- [Supabase](https://supabase.com/) for backend services
- [React Navigation](https://reactnavigation.org/) for navigation

---

⭐ **Star this repository if you found it helpful!**

Made with ❤️ using [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)