# 🏋️ FitTrack Pro - Fitness Goal Tracker & Task Management

A comprehensive web application combining fitness tracking with team task management. Built with React, TypeScript, and modern web technologies.

## 🌟 Features

### Fitness Dashboard
- **Weekly Progress Tracking**: Visual charts showing steps and calorie intake
- **Activity Logging**: Log workouts with calories burned
- **Real-time Statistics**: Track total steps, average calories, and active days
- **Interactive Charts**: Beautiful Chart.js visualizations

### Project Management
- **Project Overview**: Manage multiple projects with due dates
- **Status Tracking**: Active, completed, and overdue project indicators
- **Team Assignments**: Assign projects to team members
- **Visual Dashboard**: Color-coded project cards with key metrics

### Task Management
- **Task Organization**: Group tasks by user and project
- **Priority Levels**: High, medium, and low priority tasks
- **Status Updates**: Todo, in-progress, completed, and overdue statuses
- **Filtering**: Filter tasks by user and status
- **Overdue Alerts**: Visual warnings for overdue tasks

## 🎨 Design Features

- **Energetic Color Scheme**: Primary action color #FF4500 (OrangeRed)
- **Modern UI**: Clean, responsive design with smooth animations
- **Three-Column Layout**: Dashboard with sidebars for progress and activity logs
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd fitness-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:5173
```

## 📦 Dependencies

- **React 19**: Modern React with latest features
- **React Router DOM**: Client-side routing
- **Chart.js**: Beautiful, responsive charts
- **React-ChartJS-2**: React wrapper for Chart.js
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool

## 🏗️ Project Structure

```
fitness-tracker/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx       # Fitness dashboard with charts
│   │   ├── Dashboard.css       # Dashboard styling
│   │   ├── Projects.tsx        # Project management component
│   │   ├── Projects.css        # Projects styling
│   │   ├── Tasks.tsx           # Task management component
│   │   └── Tasks.css           # Tasks styling
│   ├── App.tsx                 # Main app with routing
│   ├── App.css                 # App-level styling
│   ├── index.css               # Global styles
│   └── main.tsx                # Entry point
├── package.json
└── README.md
```

## 🎯 Usage

### Dashboard
- View weekly fitness statistics
- Track steps and calorie intake
- Click "Log Activity" to add new workouts
- View activity history in the right sidebar

### Projects
- Click "New Project" to create a project
- View overdue projects in the alert box
- Click on project cards to view details
- Monitor project statistics at the top

### Tasks
- Click "New Task" to create a task
- Filter tasks by user or status
- Update task status with dropdown menus
- View tasks grouped by team member
- Monitor overdue tasks with alerts

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Color Palette

- **Primary Action**: #FF4500 (OrangeRed)
- **Secondary**: #ff5722
- **Success**: #4CAF50
- **Warning**: #ff9800
- **Error**: #f44336
- **Info**: #2196F3
- **Background**: #f5f7fa
- **Text**: #2c3e50

## 📱 Responsive Breakpoints

- **Desktop**: > 1200px
- **Tablet**: 768px - 1200px
- **Mobile**: < 768px

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs!

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Chart.js for beautiful visualizations
- React team for the amazing framework
- Vite for the blazing-fast build tool

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
