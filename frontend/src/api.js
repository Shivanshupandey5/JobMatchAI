import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const submitMatch = async (resume, jobDescription) => {
  const res = await axios.post(`${BASE_URL}/api/match`, { resume, jobDescription });
  return res.data;
};

export const getMatches = async () => {
  const res = await axios.get(`${BASE_URL}/api/matches`);
  return res.data;
};
