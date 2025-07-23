# 🤝 Contributing to Explore

Thank you for your interest in contributing to Explore! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🎯 How Can I Contribute?

### Reporting Bugs

- Use the GitHub issue tracker
- Include detailed steps to reproduce the bug
- Provide your environment information (OS, Node.js version, etc.)
- Include screenshots if applicable

### Suggesting Enhancements

- Use the GitHub issue tracker
- Describe the enhancement in detail
- Explain why this enhancement would be useful
- Include mockups or examples if possible

### Pull Requests

- Fork the repository
- Create a feature branch
- Make your changes
- Add tests if applicable
- Ensure all tests pass
- Submit a pull request

## 🛠 Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Git

### Local Development

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/explore.git
   cd explore
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   npm run setup-env
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards
   - Write tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run lint
   npm test  # if tests are available
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

## 📝 Pull Request Process

### Before Submitting

- [ ] Code follows the project's coding standards
- [ ] Self-review of your code
- [ ] Comment your code, particularly in hard-to-understand areas
- [ ] Write corresponding tests
- [ ] Make sure tests pass
- [ ] Update documentation if needed
- [ ] Add screenshots if UI changes are made

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] I have read the [Contributing Guidelines](CONTRIBUTING.md)
- [ ] My code follows the project's coding standards
- [ ] I have tested my changes on both iOS and Android
- [ ] I have tested my changes on web (if applicable)
```

## 🎨 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Prefer interfaces over types
- Use strict mode
- Avoid `any` type - use proper typing

### React Native / Expo

- Use functional components with hooks
- Follow Expo best practices
- Use Expo's built-in components when possible
- Implement proper error boundaries

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use trailing commas in objects and arrays
- Use descriptive variable names
- Write self-documenting code

### File Naming

- Use kebab-case for file names
- Use PascalCase for component names
- Use camelCase for variables and functions

### Component Structure

```typescript
// imports
import React from 'react';
import { View, Text } from 'react-native';

// types
interface ComponentProps {
  title: string;
  onPress?: () => void;
}

// component
export function MyComponent({ title, onPress }: ComponentProps) {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}
```

## 🧪 Testing

### Writing Tests

- Write tests for new functionality
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

### Running Tests

```bash
npm test
```

## 🐛 Reporting Bugs

### Before Creating Bug Reports

- Check existing issues
- Check the troubleshooting guide
- Try to reproduce the issue

### How Do I Submit a Good Bug Report?

Use the bug report template:

```markdown
## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
A clear and concise description of what actually happened.

## Environment
- OS: [e.g. iOS, Android, Web]
- Version: [e.g. 1.0.0]
- Device: [e.g. iPhone 12, Samsung Galaxy S21]

## Additional Context
Add any other context about the problem here.
```

## 💡 Feature Requests

### Before Submitting Feature Requests

- Check existing feature requests
- Consider if the feature aligns with project goals
- Think about implementation complexity

### How Do I Submit a Good Feature Request?

```markdown
## Feature Description
A clear and concise description of the feature you'd like to see.

## Problem Statement
A clear and concise description of what problem this feature would solve.

## Proposed Solution
A clear and concise description of what you want to happen.

## Alternative Solutions
A clear and concise description of any alternative solutions you've considered.

## Additional Context
Add any other context or screenshots about the feature request here.
```

## 📚 Documentation

### Updating Documentation

- Keep README.md up to date
- Update API documentation if needed
- Add inline code comments
- Update troubleshooting guides

### Documentation Standards

- Use clear and concise language
- Include code examples
- Use proper markdown formatting
- Keep documentation in sync with code

## 🏷️ Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```
feat: add employee search functionality
fix: resolve database connection issue
docs: update installation instructions
style: format code according to style guide
```

## 🎉 Recognition

Contributors will be recognized in:

- The project README
- Release notes
- GitHub contributors page

## 📞 Getting Help

If you need help with contributing:

- Check the documentation
- Search existing issues
- Create a new issue
- Join our community discussions

## 🙏 Thank You

Thank you for contributing to Explore! Your contributions help make this project better for everyone.

---

**Happy coding! 🚀** 