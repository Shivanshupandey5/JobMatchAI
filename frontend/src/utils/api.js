import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const getMatches = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/matches`);
    return response.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
};
