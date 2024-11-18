import React from 'react';
import { render, userEvent, screen } from '@testing-library/react';
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

  test('updates inputText state when typing in the input field', async () => {
    render(
      <ToDoProvider>
      <InputForm />
    </ToDoProvider>
  );
    const user = userEvent.setup();
    const inputField = screen.getByPlaceholderText('Add a new task');
    await user.type(inputField, 'Test Task');
  
    expect(inputField.value).toBe('Test Task'); // Check if input is updated
  });

  test('updates inputText state and calling addItem function when button is clicked', async () => {
    render(
      <ToDoProvider>
      <InputForm />
    </ToDoProvider>
  );
    const user = userEvent.setup();

    await user.click('button');
  
    expect(screen.getByPlaceholderText('Add a new task').value).toBe(''); // Check if input field is empty after user clicked add button
  });

});
