import axios from 'axios';

const MISTRAL_API_KEY = '3Dr842cK7hSHMS6JWP0kedUJsc116k4f';

const mistralApi = axios.create({
  baseURL: 'https://api.mistral.ai/v1',
  headers: {
    'Authorization': `Bearer ${MISTRAL_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const sendMessageToMistral = async (message: string) => {
  try {
    const response = await mistralApi.post('/chat/completions', {
      model: 'mistral-tiny',
      messages: [{ role: 'user', content: message }],
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Mistral AI:', error);
    throw error;
  }
};