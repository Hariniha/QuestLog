
import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

const groq = apiKey ? new Groq({
    apiKey: apiKey,
}) : null;

export default groq;

export const MODELS = {
    QUEST: 'llama-3.3-70b-versatile',
    FUTURE_SELF: 'llama-3.3-70b-versatile',
};
