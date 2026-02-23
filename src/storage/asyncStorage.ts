import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Company, Expense } from '@/types';

const COMPANIES_KEY = '@finance:companies';
const EXPENSES_KEY = '@finance:expenses';
const THEME_KEY = '@finance:theme';

// ── Companies ──────────────────────────────────────────────────────────────

export async function getCompanies(): Promise<Company[]> {
  const data = await AsyncStorage.getItem(COMPANIES_KEY);
  return data ? (JSON.parse(data) as Company[]) : [];
}

export async function addCompany(company: Company): Promise<Company[]> {
  const list = await getCompanies();
  const updated = [...list, company];
  await AsyncStorage.setItem(COMPANIES_KEY, JSON.stringify(updated));
  return updated;
}

export async function updateCompany(company: Company): Promise<Company[]> {
  const list = await getCompanies();
  const updated = list.map((c) => (c.id === company.id ? company : c));
  await AsyncStorage.setItem(COMPANIES_KEY, JSON.stringify(updated));
  return updated;
}

export async function deleteCompany(id: string): Promise<Company[]> {
  const list = await getCompanies();
  const updated = list.filter((c) => c.id !== id);
  await AsyncStorage.setItem(COMPANIES_KEY, JSON.stringify(updated));
  return updated;
}

// ── Expenses ───────────────────────────────────────────────────────────────

export async function getExpenses(): Promise<Expense[]> {
  const data = await AsyncStorage.getItem(EXPENSES_KEY);
  return data ? (JSON.parse(data) as Expense[]) : [];
}

export async function addExpense(expense: Expense): Promise<Expense[]> {
  const list = await getExpenses();
  const updated = [...list, expense];
  await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(updated));
  return updated;
}

export async function updateExpense(expense: Expense): Promise<Expense[]> {
  const list = await getExpenses();
  const updated = list.map((e) => (e.id === expense.id ? expense : e));
  await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(updated));
  return updated;
}

export async function deleteExpense(id: string): Promise<Expense[]> {
  const list = await getExpenses();
  const updated = list.filter((e) => e.id !== id);
  await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(updated));
  return updated;
}

// ── Theme ──────────────────────────────────────────────────────────────────

export async function getTheme(): Promise<'dark' | 'light'> {
  const data = await AsyncStorage.getItem(THEME_KEY);
  return (data as 'dark' | 'light') ?? 'dark';
}

export async function saveTheme(theme: 'dark' | 'light'): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, theme);
}

// ── Danger ─────────────────────────────────────────────────────────────────

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([COMPANIES_KEY, EXPENSES_KEY]);
}
