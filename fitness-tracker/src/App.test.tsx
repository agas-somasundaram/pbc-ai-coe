import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock child components to simplify testing
vi.mock('./components/Dashboard', () => ({
  default: () => <div>Dashboard Component</div>
}));

vi.mock('./components/Projects', () => ({
  default: () => <div>Projects Component</div>
}));

vi.mock('./components/Tasks', () => ({
  default: () => <div>Tasks Component</div>
}));

describe('App', () => {
  const renderApp = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    );
  };

  it('renders the navigation', () => {
    renderApp();
    
    // Check if navigation elements are rendered
    expect(screen.getByText('🏋️ FitTrack Pro')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /tasks/i })).toBeInTheDocument();
  });

  it('renders Dashboard component on root route', () => {
    renderApp('/');
    expect(screen.getByText('Dashboard Component')).toBeInTheDocument();
  });

  it('renders Projects component on /projects route', () => {
    renderApp('/projects');
    expect(screen.getByText('Projects Component')).toBeInTheDocument();
  });

  it('applies active class to current route link', () => {
    renderApp('/projects');
    
    const projectsLink = screen.getByRole('link', { name: /projects/i });
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    
    // Check if active class is applied correctly
    expect(projectsLink).toHaveClass('active');
    expect(dashboardLink).not.toHaveClass('active');
  });
});
