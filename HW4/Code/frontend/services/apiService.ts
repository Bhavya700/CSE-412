import { API_BASE_URL } from '../constants';
import { SearchResponse, ApiError } from '../types';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const jsonError = JSON.parse(errorBody);
      if (jsonError.message) errorMessage = jsonError.message;
    } catch (e) {
      // ignore JSON parse error
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export const searchService = {
  /**
   * Search by Player Name (Single Table)
   */
  searchByName: async (endpoint: string, name: string): Promise<SearchResponse> => {
    // Construct query parameters
    const params = new URLSearchParams({ name });
    const url = `${API_BASE_URL}${endpoint}?${params.toString()}`;
    
    try {
      const response = await fetch(url);
      return await handleResponse<SearchResponse>(response);
    } catch (error) {
      console.error("Search API Error:", error);
      throw error;
    }
  },

  /**
   * Search by Nation + Position (Two Tables / Join)
   */
  searchComplex: async (endpoint: string, nation: string, position: string): Promise<SearchResponse> => {
    const params = new URLSearchParams({ 
      nation, 
      position 
    });
    const url = `${API_BASE_URL}${endpoint}?${params.toString()}`;

    try {
      const response = await fetch(url);
      return await handleResponse<SearchResponse>(response);
    } catch (error) {
      console.error("Complex Search API Error:", error);
      throw error;
    }
  }
};