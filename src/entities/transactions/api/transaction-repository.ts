import { type Repository, createLocalCollection, fetchJson } from '@/shared/api';
import type { Transaction } from '../model/transaction.interface';

const STORAGE_KEY = 'finlab.transactions';

// After the MVP: pick the Firebase implementation here when VITE_STORAGE === 'firebase'
export const transactionRepository: Repository<Transaction> = createLocalCollection<Transaction>(
  STORAGE_KEY,
  () => fetchJson<Transaction[]>('data/transactions.json'),
);
