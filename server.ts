import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import * as aiBackend from './src/services/aiBackend';

const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '50mb' }));

  // API Router
  const apiRouter = express.Router();
  
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
      } catch (e) {}
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
      } catch (e) {}
      res.write(`event: error\ndata: ${JSON.stringify({ message: errorMessage })}\n\n`);
      res.end();
    }
  });

  app.use('/api', apiRouter);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ultra Pro Advanced Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
