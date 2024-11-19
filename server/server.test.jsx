import request from 'supertest';
import pg from 'pg';
import app from './server'; 

jest.mock('pg'); // Mock the pg module to avoid hitting the actual database in tests

describe("Testing server.js endpoints", () => {
  
  let mockDb;
  
  beforeEach(() => {
    // Mock database setup
    mockDb = {
      query: jest.fn()  // Mock the query method
    };
  
    // Mock the pg.Client constructor to return the mockDb
    //Why mock this constructor?: In real code, pg.Client connects to the database and interacts with it. In tests, we don't want that because it would require a real database. So, we mock pg.Client to return the mock object we created.
    //What does mockImplementation do?: This tells Jest that every time pg.Client is used in the app, it should behave as though it’s returning mockDb (our fake database object).
    pg.Client.mockImplementation(() => mockDb);
  
    // Set up default behavior for the database (this can be customized for each test)
    // This sets up a default response for the query method of mockDb. Whenever the query method is called during a test (if we don’t specify another response), it will automatically return { rows: [] }
    //If you don’t set this, it might throw an error if you call it without specifying a behavior, or it might return undefined if you don't specify a default response.
    mockDb.query.mockResolvedValue({ rows: [] }); // Default empty response
  });


  afterEach(() => {
    jest.clearAllMocks(); // Clear any mock data after each test
  });

  it('should get items from the database', async () => {
    // Mock the db response for the request
    mockDb.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Item 1' }] });
    
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, title: 'Item 1' }]);
  });

  it('should return 400 if title is missing in POST request', async () => {
    const response = await request(app).post('/add').send({});
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Title is required');
  });

  it('should add an item to the database', async () => {
    // Mock the db response for POST
    const mockItem = { id: 2, title: 'New Item' };
    mockDb.query.mockResolvedValueOnce({ rows: [mockItem] });
    
    const response = await request(app).post('/add').send({ title: 'New Item' });
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockItem);
  });

  it('should update an item', async () => {
    const mockItem = { id: 1, title: 'Updated Item' };
    mockDb.query.mockResolvedValueOnce({ rows: [mockItem] });
    
    const response = await request(app).patch('/edit/1').send({ title: 'Updated Item' });
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockItem);
  });

  it('should delete an item', async () => {
    mockDb.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Item to Delete' }] });
    
    const response = await request(app).delete('/delete/1');
    
    expect(response.status).toBe(200);
    expect(response.body).toBe("Item has been successfully deleted!");
  });

  it('should return 404 if item to delete is not found', async () => {
    //indicating the database found no item with the specified ID
    mockDb.query.mockResolvedValueOnce({ rows: [] });
    
    const response = await request(app).delete('/delete/999');
    
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Item not found");
  });
});
