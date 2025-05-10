import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoApp from '../TodoApp';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('TodoApp', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('should render the todo input and add button', () => {
    render(<TodoApp />);
    
    expect(screen.getByTestId('todo-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-button')).toBeInTheDocument();
    expect(screen.getByTestId('add-button')).toBeDisabled();
  });

  test('should enable add button when text is entered', () => {
    render(<TodoApp />);
    
    const input = screen.getByTestId('todo-input');
    const button = screen.getByTestId('add-button');
    
    expect(button).toBeDisabled();
    
    fireEvent.change(input, { target: { value: 'New Todo' } });
    
    expect(button).not.toBeDisabled();
  });

  test('should add a new todo when add button is clicked', () => {
    render(<TodoApp />);
    
    const input = screen.getByTestId('todo-input');
    const button = screen.getByTestId('add-button');
    
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(button);
    
    expect(screen.getByText('New Todo')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  test('should add a new todo when Enter key is pressed', () => {
    render(<TodoApp />);
    
    const input = screen.getByTestId('todo-input');
    
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(screen.getByText('New Todo')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  test('should remove a todo when complete button is clicked', () => {
    render(<TodoApp />);
    
    const input = screen.getByTestId('todo-input');
    const button = screen.getByTestId('add-button');
    
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(button);
    
    expect(screen.getByText('New Todo')).toBeInTheDocument();
    
    const completeButton = screen.getByTestId('complete-button');
    fireEvent.click(completeButton);
    
    expect(screen.queryByText('New Todo')).not.toBeInTheDocument();
  });

  test('should save todos to localStorage', async () => {
    render(<TodoApp />);
    
    const input = screen.getByTestId('todo-input');
    const button = screen.getByTestId('add-button');
    
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(JSON.parse(localStorageMock.getItem('todos') || '[]')).toHaveLength(1);
      expect(JSON.parse(localStorageMock.getItem('todos') || '[]')[0].text).toBe('New Todo');
    });
  });

  test('should load todos from localStorage', async () => {
    const todos = [{ id: '1', text: 'Saved Todo' }];
    localStorageMock.setItem('todos', JSON.stringify(todos));
    
    render(<TodoApp />);
    
    expect(screen.getByText('Saved Todo')).toBeInTheDocument();
  });
});
