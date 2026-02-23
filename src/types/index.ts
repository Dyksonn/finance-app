type ExpenseCategory =
  | 'moradia'
  | 'alimentacao'
  | 'transporte'
  | 'saude'
  | 'educacao'
  | 'lazer'
  | 'servicos'
  | 'outros';

interface Company {
  id: string;
  name: string;
  salary: number;
  hasVR: boolean;
  vrAmount: number;
  hasTransport: boolean;
  transportAmount: number;
}

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  month: number; // 0-11
  year: number;
  paid: boolean;
}

const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  moradia: '🏠',
  alimentacao: '🍽️',
  transporte: '🚗',
  saude: '💊',
  educacao: '📚',
  lazer: '🎮',
  servicos: '📱',
  outros: '📦',
};

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  moradia: 'Moradia',
  alimentacao: 'Alimentação',
  transporte: 'Transporte',
  saude: 'Saúde',
  educacao: 'Educação',
  lazer: 'Lazer',
  servicos: 'Serviços',
  outros: 'Outros',
};

export type { Company, Expense, ExpenseCategory };
export { CATEGORY_ICONS, CATEGORY_LABELS };
