export const accountCategoryOptions = [
  'cash',
  'bank',
  'creditCard',
  'debitCard',
  'investment',
  'loan',
  'other',
] as const;

export const transactionType = ['credit', 'debit'] as const;

export const transactionStatus = ['pending', 'completed', 'cancelled'] as const;
