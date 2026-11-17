import { createWorker } from 'tesseract.js';
import { extractCVCWords } from './parser.js';

let workerPromise = null;
let progressCb = null;

async function getWorker() {
  if (!workerPromise) {
    workerPromise = createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && progressCb) {
          progressCb(m.progress);
        }
      }
    });
  }
  return workerPromise;
}

export async function handleHomeworkScan(file, onProgress) {
  progressCb = onProgress;
  const worker = await getWorker();
  const { data } = await worker.recognize(file);
  progressCb = null;
  return extractCVCWords(data.text || '');
}

export async function disposeWorker() {
  if (workerPromise) {
    const w = await workerPromise;
    await w.terminate();
    workerPromise = null;
  }
}
