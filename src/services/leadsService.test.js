import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { leadsService } from './leadsService'; // Adjust path as necessary

// Mock axios
vi.mock('axios');

const API_URL = 'http://localhost:3003/api';

describe('leadsService', () => {
  beforeEach(() => {
    // Reset mocks before each test
    axios.post.mockReset();
    axios.get.mockReset(); // If other service functions are tested
    axios.put.mockReset();
    axios.delete.mockReset();
  });

  describe('sendBulkWhatsAppMessages', () => {
    it('should call axios.post with the correct URL and data', async () => {
      const message = 'Test message';
      const leadIds = [1, 2, 3];
      const expectedUrl = `${API_URL}/leads/bulk-whatsapp`;
      const expectedPayload = { message, leadIds };
      const mockResponseData = { success: true, detail: 'Messages queued' };

      axios.post.mockResolvedValue({ data: mockResponseData });

      await leadsService.sendBulkWhatsAppMessages(message, leadIds);

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(expectedUrl, expectedPayload);
    });

    it('should return the response data on successful API call', async () => {
      const message = 'Test message';
      const leadIds = [1, 2, 3];
      const mockResponseData = { success: true, detail: 'Messages queued' };

      axios.post.mockResolvedValue({ data: mockResponseData });

      const result = await leadsService.sendBulkWhatsAppMessages(message, leadIds);

      expect(result).toEqual(mockResponseData);
    });

    it('should throw an error message if the API call fails (with error.response.data.error)', async () => {
      const message = 'Test message';
      const leadIds = [1, 2, 3];
      const errorMessage = 'Backend validation error';
      
      axios.post.mockRejectedValue({
        response: {
          data: { error: errorMessage }
        }
      });

      try {
        await leadsService.sendBulkWhatsAppMessages(message, leadIds);
      } catch (error) {
        expect(error).toBe(errorMessage);
      }
      expect(axios.post).toHaveBeenCalledTimes(1); // Ensure it was called
    });

    it('should throw an error message if the API call fails (with error.message)', async () => {
      const message = 'Test message';
      const leadIds = [1, 2, 3];
      const errorMessage = 'Network Error';
      
      axios.post.mockRejectedValue({ message: errorMessage });

      try {
        await leadsService.sendBulkWhatsAppMessages(message, leadIds);
      } catch (error) {
        expect(error).toBe(errorMessage);
      }
    });
    
    it('should throw a default error message if API error structure is unexpected', async () => {
      const message = 'Test message';
      const leadIds = [1, 2, 3];
      const defaultErrorMessage = 'Error en el servidor al enviar mensajes masivos';
      
      axios.post.mockRejectedValue({}); // Empty error object

      try {
        await leadsService.sendBulkWhatsAppMessages(message, leadIds);
      } catch (error) {
        expect(error).toBe(defaultErrorMessage);
      }
    });
  });
  
  // Add tests for other service functions (getAll, create, update, delete) if not already present
  // For example:
  describe('getAll', () => {
    it('should fetch leads and map created_at', async () => {
      const mockLeads = [{ id: 1, name: 'Lead 1', created_at: '2023-01-01T00:00:00Z' }];
      axios.get.mockResolvedValue({ data: mockLeads });
      
      const result = await leadsService.getAll();
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/leads`);
      expect(result[0].createdAt).toBe('2023-01-01T00:00:00Z');
    });
  });
});
