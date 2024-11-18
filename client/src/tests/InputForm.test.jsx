import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import InputForm from '../components/InputForm';
import { ToDoProvider } from '../ToDoContext';

describe('InputForm Component', () => {
  test('renders input and button', () => {
    render(
      <ToDoProvider>
        <InputForm />
      </ToDoProvider>
    );

    const inputField = screen.getByPlaceholderText('Add a new task');
    const addButton = screen.getByLabelText('Add Task');
    
    
    expect(inputField).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });

  test('updates inputText state when typing in the input field', () => {
    render(
      <ToDoProvider>
      <InputForm />
    </ToDoProvider>
  );
  
    const inputField = screen.getByPlaceholderText('Add a new task');
    fireEvent.change(inputField, { target: { value: 'Test Task' } });
  
    expect(inputField.value).toBe('Test Task'); // Check if input is updated
  });
});
