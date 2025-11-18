# FitTrack Pro - Development Prompts

This file documents the key prompts and requirements used to develop the FitTrack Pro application.

## Initial Requirements

### Fitness Tracker Component
```
Act as an expert React developer. I am building a fitness goal tracker web application. 

Mission: Create a user dashboard component.

User Journey: The user logs in and sees this dashboard, which displays their total steps for the week, daily calorie intake, and a 'log activity' button.

Technical Requirements: 
- Use React and Chart.js for the progress chart.
- Ensure the component is saved in a file named Dashboard.js within the /src/components folder.

Design Directions: 
- Use an energetic color scheme (hex: #FF4500 for primary actions).
- The layout should have a main content area with two sidebars: one for weekly progress and one for the activity log.
```

### Task Management Component
```
Build a task management application for a small team. 

It needs two main sections: 
1. Projects - Each project can have many tasks
2. Tasks - Individual tasks with assignments and due dates

Include a dashboard that shows:
- Overdue projects
- Tasks by user
- Task status overview

Technical Requirements:
- Use React with TypeScript
- Responsive design that works on desktop and mobile
- Clean, modern UI with clear visual hierarchy
```

## Implementation Details

### Dashboard Features
- Three-column layout with sidebars
- Chart.js integration for visual data representation
- Activity logging functionality
- Responsive design

### Project Structure
- `/src/components/Dashboard.tsx` - Main dashboard with fitness metrics
- `/src/components/Projects.tsx` - Project management
- `/src/components/Tasks.tsx` - Task management
- `/src/App.tsx` - Main application with routing

## Color Scheme
- Primary: #FF4500 (OrangeRed)
- Background: #f8f9fa
- Text: #212529
- Secondary: #6c757d
- Success: #28a745
- Danger: #dc3545

## Dependencies
- React 19 with TypeScript
- React Router DOM
- Chart.js
- React-ChartJS-2
- Vite (Build Tool)
