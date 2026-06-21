import express from 'express';
import * as aiBackend from './services/aiBackend';
import dotenv from 'dotenv';

dotenv.config();

export const apiRouter = express.Router();

apiRouter.use(express.json({ limit: '50mb' }));

apiRouter.get('/health', (req, res) => {
  res.json({ 
    status: 'ultra-pro-advanced-backend-online',
    keyPresent: !!process.env.GEMINI_API_KEY
  });
});

// Dynamic RPC endpoint for standard Promise-returning AI methods
apiRouter.post('/ai/rpc', async (req, res) => {
  const { method, args } = req.body;
  try {
    const backendMethod = (aiBackend as any)[method];
    if (typeof backendMethod !== 'function') {
      res.status(404).json({ error: `Method ${method} not found` });
      return;
    }
    const result = await backendMethod(...(args || []));
    res.json({ result });
  } catch (error: any) {
    console.error(`Error in /ai/rpc for ${method}:`, error);
    let errorMessage = error.message || 'Internal Server Error';
    try {
      const parsed = JSON.parse(errorMessage);
      if (parsed?.error?.message) {
        errorMessage = parsed.error.message;
      }
    } catch (e) {
      // Ignore parse error
    }
    res.status(500).json({ error: errorMessage });
  }
});

// SSE endpoint for Streaming AI methods
apiRouter.post('/ai/rpc-stream', async (req, res) => {
  const { method, args } = req.body;
  
  // Set headers for Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const backendMethod = (aiBackend as any)[method];
    if (typeof backendMethod !== 'function') {
      res.write(`event: error\ndata: ${JSON.stringify({ message: 'Method not found' })}\n\n`);
      res.end();
      return;
    }

    const stream = await backendMethod(...(args || []));
    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }
    res.write('event: done\ndata: {}\n\n');
    res.end();
  } catch (error: any) {
    console.error(`Error in /ai/rpc-stream for ${method}:`, error);
    let errorMessage = error.message || 'Stream error';
    try {
      const parsed = JSON.parse(errorMessage);
      if (parsed?.error?.message) {
        errorMessage = parsed.error.message;
      }
    } catch (e) {
      // Ignore parse error
    }
    res.write(`event: error\ndata: ${JSON.stringify({ message: errorMessage })}\n\n`);
    res.end();
  }
});

const app = express();
app.use('/api', apiRouter);

export default app;
