import express from 'express';
import * as aiBackend from './services/aiBackend';
import dotenv from 'dotenv';

dotenv.config();

export const apiRouter = express.Router();

const parseBody = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // If Vercel already parsed the body, req.body will be an object.
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    return next();
  }
  express.json({ limit: '50mb' })(req, res, next);
};

apiRouter.use(parseBody);

apiRouter.get('/health', (req, res) => {
  res.json({ 
    status: 'ultra-pro-advanced-backend-online',
    keyPresent: !!process.env.GEMINI_API_KEY
  });
});

// Dynamic RPC endpoint for standard Promise-returning AI methods
apiRouter.post('/ai/rpc', async (req, res) => {
  const method = req.body?.method;
  const args = req.body?.args;
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
  const method = req.body?.method;
  const args = req.body?.args;
  
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
