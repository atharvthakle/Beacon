import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

const MAX_MESSAGE_LENGTH = 1000;

export const validateChatMessage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { message, sessionId } = req.body;

  // Check message exists
  if (!message) {
    const error: ErrorResponse = { error: 'Message is required' };
    res.status(400).json(error);
    return;
  }

  // Check message is a string
  if (typeof message !== 'string') {
    const error: ErrorResponse = { error: 'Message must be a string' };
    res.status(400).json(error);
    return;
  }

  // Check message is not empty
  if (message.trim().length === 0) {
    const error: ErrorResponse = { error: 'Message cannot be empty' };
    res.status(400).json(error);
    return;
  }

  // Truncate very long messages
  if (message.length > MAX_MESSAGE_LENGTH) {
    req.body.message = message.substring(0, MAX_MESSAGE_LENGTH);
    console.warn(`⚠️ Message truncated from ${message.length} to ${MAX_MESSAGE_LENGTH} characters`);
  }

  // Validate sessionId format if provided
  if (sessionId !== undefined && sessionId !== null) {
    if (typeof sessionId !== 'string') {
      const error: ErrorResponse = { error: 'sessionId must be a string' };
      res.status(400).json(error);
      return;
    }

    // Basic UUID format check
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (sessionId.length > 0 && !uuidRegex.test(sessionId)) {
      const error: ErrorResponse = { error: 'Invalid sessionId format' };
      res.status(400).json(error);
      return;
    }
  }

  next();
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('❌ Unhandled error:', err);
  const error: ErrorResponse = {
    error: 'An unexpected error occurred',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  };
  res.status(500).json(error);
};