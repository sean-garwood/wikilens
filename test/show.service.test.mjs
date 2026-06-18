import assert from 'assert';
import { fetchSummary } from '../src/show.service.js';

function mockFetch(response, status = 200) {
  global.fetch = async () => ({
    status,
    json: async () => response
  });
}

describe('fetchSummary', () => {
  it('should return the extract if API response is valid', async () => {
    const mockResponse = { extract: 'This is a test summary.' };
    mockFetch(mockResponse);

    const result = await fetchSummary('Test');
    assert.strictEqual(result, 'This is a test summary.');
  });

  it('should return not found message if API response status is not 200', async () => {
    mockFetch({}, 404);

    const result = await fetchSummary('NonExistent');
    assert.strictEqual(result, '[NonExistent] not found.');
  });

  it('should return not found message if extract is missing from API response', async () => {
    const mockResponse = {};
    mockFetch(mockResponse);

    const result = await fetchSummary('Empty');
    assert.strictEqual(result, '[Empty] not found.');
  });

  it('should return an error message if fetch fails', async () => {
    global.fetch = async () => { throw new Error('Network error'); };

    const result = await fetchSummary('ErrorTest');
    assert.strictEqual(result, 'Error fetching data for [ErrorTest].');
  });
});