import React from 'react';
import { render, userEvent, screen, within } from '@testing-library/react';
import { ToDoProvider } from '../ToDoContext';
import ToDoList from '../components/ToDoList';

const mockToDoContext = {
    items: [
        {id: 1, title: "Task 1"},
        {id: 2, title: "Task 2"},
        {id: 3, title: "Task 3"},
    ],
    editingItemId: null,
    editText: "",
    setEditingItemId: jest.fn(),
    setEdittext: jest.fn(),
    editItem: jest.fn(),
    startEdit: jest.fn(),
    deleteItem: jest.fn()
}

describe('ToDoList Component', () => {
    test('should render the list of tasks with checkbox, edit and delete button', ()=> {
        render(
            <ToDoProvider value={mockToDoContext}>
                <ToDoList />
            </ToDoProvider>
        )
        const listTasks = screen.getAllByRole('listitem');
        expect(listTasks).toHaveLength(3);

        const checkbox = screen.getAllByRole('checkbox');
        expect(checkbox).toHaveLength(3);
        
        listTasks.forEach((task, index) => {
            expect(task).toBeInTheDocument();

            const editButtons = screen.getAllByLabelText(`Edit Task ${index}`);
            expect(editButtons).toBeInTheDocument();

            const deleteButtons = screen.getAllByLabelText(`Delete Task ${index}`);
            expect(deleteButtons).toBeInTheDocument();
        })
    })

        test('should render the input field for editing when edit button is clicked', async ()=> {
            render(
                <ToDoProvider value={mockToDoContext}>
                    <ToDoList />
                </ToDoProvider>
            )
            const user = userEvent.setup();

            const listTasks = screen.getAllByRole('listitem');

            for (const [index, task] of listTasks.entries()) {
                const editButton = within(task).getByLabelText(`Edit Task ${index}`);
                await user.click(editButton);
            
                const inputField = within(task).getByRole('textbox');
                expect(inputField).toBeInTheDocument();

                const inputText = within(task).getByText(task.textContent.trim());
                expect(inputText).toBeInTheDocument();
            
                const doneButton = within(task).getByLabelText(`Done Edit Task ${index}`);
                expect(doneButton).toBeInTheDocument();
            
                // Ensure inputField and Done Edit Button are no longer in the document
                await user.click(doneButton);

                expect(within(task).queryByRole('textbox')).not.toBeInTheDocument();
                expect(within(task).queryByLabelText(`Done Edit Task ${index}`)).not.toBeInTheDocument();

                expect(within(task).getByLabelText(`Edit Task ${index}`)).toBeInTheDocument();
            }
            
        });

        test('should delete the item when delete button is clicked', async () => {
            const user = userEvent.setup();
        
            // Re-query list tasks after render, before starting the loop
            let listTasks = screen.getAllByRole('listitem');
            const initialTaskCount = listTasks.length;
        
            for (const [task, index] of listTasks) {
                
                const deleteButton = within(task).getByLabelText(`Delete Task ${index}`);
                await user.click(deleteButton);
        
                // Re-query list items to check the updated count after deletion
                listTasks = screen.queryAllByRole('listitem');
                expect(listTasks).toHaveLength(initialTaskCount - 1);
        
               
                expect(screen.queryByText(task.textContent.trim())).not.toBeInTheDocument();
        
            }
        });
        
    })
    
