import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  // Override the baseURL for this specific test suite
  test.use({ baseURL: 'http://127.0.0.1:3000' });

  test('API: Create a new Candidate (POST)', async ({ request }) => {
    
    // 1. Prepare the data
    const newCandidate = {
      name: 'API Test User',
      email: 'api@example.com',
      phone: '0000000000',
      idNumber: 'API-123',
      company: 'API Corp',
      role: 'Candidate',
      status: 'Pending'
    };

    // 2. Send the data to the Server (POST Request)
    const response = await request.post('/candidates', {
      data: newCandidate
    });

    // 3. Verify the Server accepted it (Status 201 = Created)
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    // 4. Parse the response
    const responseBody = await response.json();
    console.log('Server Response:', responseBody);

    // 5. Verify the name
    expect(responseBody.name).toBe('API Test User');
  });

  test('API: Get all Candidates (GET)', async ({ request }) => {
    
    // 1. Ask the server for the list
    const response = await request.get('/candidates');

    // 2. Verify OK
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // 3. Check array
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
    console.log('Total Candidates:', responseBody.length);
  });
});