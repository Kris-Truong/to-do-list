import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import InputForm from './InputForm';
import ToDoProvider from '../ToDoContext';

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

  test('updates inputText state when typing in the input field', async () => {
    render(
      <ToDoProvider>
      <InputForm />
    </ToDoProvider>
  );

    const inputField = screen.getByPlaceholderText('Add a new task');
    await userEvent.type(inputField, 'Test Task');
  
    expect(inputField.value).toBe('Test Task'); // Check if input is updated
  });

  test('updates inputText state and calling addItem function when button is clicked', async () => {
    render(
      <ToDoProvider>
      <InputForm />
    </ToDoProvider>
  );

  const button = screen.getByRole('button');
  await userEvent.click(button);
  
  
    expect(screen.getByPlaceholderText('Add a new task').value).toBe(''); // Check if input field is empty after user clicked add button
  });

});
