import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import ToDoProvider from '../ToDoContext';
import ToDoList from './ToDoList';
import axios from "axios";
import { waitFor } from '@testing-library/react';


// Mock axios
jest.mock("axios");

const mockToDoContext = {
  items: [
    { id: 1, title: "Task 1" },
    { id: 2, title: "Task 2" },
    { id: 3, title: "Task 3" },
  ],
  editingItemId: null,
  editText: "",
  setEditingItemId: jest.fn(),
  setEditText: jest.fn(),
  editItem: jest.fn().mockImplementation(() => Promise.resolve()),
  startEdit: jest.fn(),
  deleteItem: jest.fn((id) => {
    mockToDoContext.items = mockToDoContext.items.filter((item) => item.id !== id);
  }),
};

describe('ToDoList Component', () => {
    beforeEach(() => {
      axios.get.mockResolvedValueOnce({
        data: [
          { id: 1, title: 'Task 1' },
          { id: 2, title: 'Task 2' },
          { id: 3, title: 'Task 3' },
        ],
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should render the list of tasks with checkbox, edit and delete button', async () => {
    // Mocking the GET request to return tasks

    render(
      <ToDoProvider>
        <ToDoList />
      </ToDoProvider>
    );
    
    const listTasks = await screen.findAllByRole('listitem');
    expect(listTasks).toHaveLength(3);

    const checkbox = screen.getAllByRole('checkbox');
    expect(checkbox).toHaveLength(3);

    listTasks.forEach((task, index) => {
      expect(task).toBeInTheDocument();

      const editButton = within(task).getByLabelText(`Edit Task ${index + 1}`);
      expect(editButton).toBeInTheDocument();

      const deleteButton = within(task).getByLabelText(`Delete Task ${index + 1}`);
      expect(deleteButton).toBeInTheDocument();
    });
  });

  test('should render the input field and update task on edit', async () => {
    // Mock the PATCH request
    axios.patch.mockResolvedValueOnce({
      data: { id: 1, title: 'Updated Task 1' },
    });
  
    // Render the component and wait for initial tasks to appear
    render(
      <ToDoProvider value={mockToDoContext}>
        <ToDoList />
      </ToDoProvider>
    );
  
    // Wait for the list of tasks to render
    const listTasks = await screen.findAllByRole('listitem'); // Use `findAllByRole` for async rendering
    expect(listTasks.length).toBeGreaterThan(0);
  
    const taskToEdit = listTasks[0];
    expect(taskToEdit).toBeInTheDocument(); 
  
    // Simulate editing the task
    const editButton = within(taskToEdit).getByLabelText(/Edit Task 1/i); 
    expect(editButton).toBeInTheDocument(); 
    await userEvent.click(editButton);
  
    // Simulate typing in the input field
    const inputField = within(taskToEdit).getByRole('textbox');
    expect(inputField).toBeInTheDocument(); // Confirm the textbox is present
    await userEvent.clear(inputField);
    await userEvent.type(inputField, 'Updated Task 1');
  
    // Submit the updated task
    const doneButton = await screen.findByRole('button', { name: /Done/i });
    await userEvent.click(doneButton);
  
    // Check if axios.patch was called with the correct arguments
    expect(axios.patch).toHaveBeenCalledWith(
      expect.stringContaining('/edit/1'),
      { title: 'Updated Task 1' }
    );
  
    // Ensure that the task list is updated with the new task
    await waitFor(() => {
      const updatedTask = screen.getByText('Updated Task 1');
      expect(updatedTask).toBeInTheDocument();
    });
  });
  

  test('should delete the item when delete button is clicked', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, title: "Task 1" },
        { id: 2, title: "Task 2" },
        { id: 3, title: "Task 3" },
      ],
    });

    // Mocking the DELETE request to simulate successful deletion
    axios.delete.mockResolvedValueOnce({});

      render(
        <ToDoProvider>
          <ToDoList />
        </ToDoProvider>
      );
 
    const initialList = await screen.findAllByRole('listitem');
    const initialTaskCount = initialList.length;
  
    const deleteButton = within(initialList[0]).getByLabelText('Delete Task 1');
    await userEvent.click(deleteButton);
  
    // Wait for the task list to update after the deletion
    await waitFor(() => {
      const updatedList = screen.queryAllByRole('listitem');
      expect(updatedList).toHaveLength(initialTaskCount - 1);  // Ensures length decreases after deletion
    });
});
});
