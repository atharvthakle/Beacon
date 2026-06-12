import { Router, Request, Response } from 'express';
import { validateChatMessage } from '../middleware/validation';
import { getOrCreateConversation, saveMessage, getConversationHistory } from '../services/conversation';
import { generateReply } from '../services/llm';
import { ChatRequest, ChatResponse, ErrorResponse } from '../types';

const router = Router();

// POST /chat/message
router.post('/message', validateChatMessage, async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body as ChatRequest;

    // Step 1: Get or create a conversation
    const conversation = await getOrCreateConversation(sessionId);

    // Step 2: Fetch conversation history
    const history = await getConversationHistory(conversation.id);

    // Step 3: Save the user's message
    await saveMessage(conversation.id, 'user', message.trim());

    // Step 4: Generate AI reply
    const reply = await generateReply(history, message.trim());

    // Step 5: Save the AI's reply
    await saveMessage(conversation.id, 'ai', reply);

    // Step 6: Return the response
    const response: ChatResponse = {
      reply,
      sessionId: conversation.id,
    };

    res.status(200).json(response);

  } catch (err) {
    console.error('❌ Chat message error:', err);
    const error: ErrorResponse = {
      error: 'Failed to process your message. Please try again.',
    };
    res.status(500).json(error);
  }
});

// GET /chat/history/:sessionId
router.get('/history/:sessionId', async (req: Request, res: Response) => {
  try {
    const rawSessionId = req.params.sessionId;
    const sessionIdStr = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionIdStr)) {
      const error: ErrorResponse = { error: 'Invalid sessionId format' };
      res.status(400).json(error);
      return;
    }

    const history = await getConversationHistory(sessionIdStr);

    res.status(200).json({ messages: history, sessionId: sessionIdStr });

  } catch (err) {
    console.error('❌ History fetch error:', err);
    const error: ErrorResponse = {
      error: 'Failed to fetch conversation history.',
    };
    res.status(500).json(error);
  }
});

export default router;