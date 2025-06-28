# Employee Management App

A React Native app built with Expo that allows you to manage employee records with name and designation information. The app uses SQLite for local data persistence.

## Features

- **Add Employees**: Enter employee name and designation
- **View Employee List**: See all added employees with their details
- **Delete Employees**: Remove individual employees with confirmation
- **Clear All**: Delete all employees at once with confirmation
- **Data Persistence**: All data is stored locally using SQLite database
- **Modern UI**: Clean and intuitive user interface

## How to Use

1. **Add an Employee**:
   - Enter the employee's name in the first input field
   - Enter their designation in the second input field
   - Tap "Add Employee" to save

2. **View Employees**:
   - All employees are displayed in the "Employee List" section
   - Each employee card shows name, designation, and when they were added

3. **Delete an Employee**:
   - Tap the "Delete" button on any employee card
   - Confirm the deletion in the popup dialog

4. **Clear All Employees**:
   - Tap "Clear All" button in the employee list header
   - Confirm the action in the popup dialog

## Technical Details

- **Framework**: React Native with Expo
- **Database**: SQLite (expo-sqlite)
- **State Management**: React hooks (useState, useEffect)
- **UI Components**: Native React Native components
- **Data Persistence**: Local SQLite database

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on your device:
   - Scan the QR code with Expo Go app (Android) or Camera app (iOS)
   - Or press 'w' to open in web browser

## Database Schema

The app creates a table called `employees` with the following structure:
- `id`: Auto-incrementing primary key
- `name`: Employee name (TEXT)
- `designation`: Employee designation (TEXT)
- `createdAt`: Timestamp when employee was added (TEXT)

## App Structure

- `app/(tabs)/index.tsx`: Main screen with employee management functionality
- Uses expo-sqlite for database operations
- Implements CRUD operations (Create, Read, Delete)
- Features form validation and user confirmation dialogs

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
