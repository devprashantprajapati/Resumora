import fs from 'fs';
import { extractTextFromPDF } from './src/lib/pdfParser';

const testFile = {
  arrayBuffer: async () => new Uint8Array([0,1,2,3]).buffer,
  name: 'test.pdf',
  size: 100,
  type: 'application/pdf',
} as any as File;

extractTextFromPDF(testFile).then(console.log).catch(console.error);
