import { query } from '../config/database';
import redisClient from '../config/redis';
import { Message, Conversation } from '../types';

const CACHE_TTL = 3600; // 1 hour in seconds

export const getOrCreateConversation = async (sessionId?: string): Promise<Conversation> => {
  // If sessionId provided, try to find existing conversation
  if (sessionId) {
    const result = await query(
      'SELECT * FROM conversations WHERE id = $1',
      [sessionId]
    );
    if (result.rows.length > 0) {
      return result.rows[0] as Conversation;
    }
  }

  // Create a new conversation
  const result = await query(
    'INSERT INTO conversations (metadata) VALUES ($1) RETURNING *',
    [JSON.stringify({})]
  );

  return result.rows[0] as Conversation;
};

export const saveMessage = async (
  conversationId: string,
  sender: 'user' | 'ai',
  text: string
): Promise<Message> => {
  const result = await query(
    'INSERT INTO messages (conversation_id, sender, text) VALUES ($1, $2, $3) RETURNING *',
    [conversationId, sender, text]
  );

  // Invalidate cache for this conversation
  try {
    await redisClient.del(`conversation:${conversationId}`);
  } catch (err) {
    console.warn('⚠️ Cache invalidation failed:', err);
  }

  return result.rows[0] as Message;
};

export const getConversationHistory = async (conversationId: string): Promise<Message[]> => {
  // Try cache first
  try {
    const cached = await redisClient.get(`conversation:${conversationId}`);
    if (cached) {
      console.log('⚡ Cache hit for conversation:', conversationId);
      return JSON.parse(cached) as Message[];
    }
  } catch (err) {
    console.warn('⚠️ Cache read failed:', err);
  }

  // Fetch from database
  const result = await query(
    'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY timestamp ASC',
    [conversationId]
  );

  const messages = result.rows as Message[];

  // Store in cache
  try {
    await redisClient.setEx(
      `conversation:${conversationId}`,
      CACHE_TTL,
      JSON.stringify(messages)
    );
  } catch (err) {
    console.warn('⚠️ Cache write failed:', err);
  }

  return messages;
};