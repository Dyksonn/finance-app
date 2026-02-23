import { useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  Alert,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FadeText } from '@/components/organisms/fade-text';
import { StaggeredText } from '@/components/organisms/animated-text';
import { Button } from '@/components/base/button';
import AnimatedInput from '@/components/base/animated-input-bar';
import { Checkbox } from '@/components/organisms/check-box';
import { BottomSheet } from '@/components/templates/bottom-sheet';
import { useBottomSheet } from '@/components/templates/bottom-sheet-stack';
import { useTheme } from '@/components/organisms/theme-switch/hooks';
import type { BottomSheetMethods } from '@/components/templates/bottom-sheet/types';
import type { ThemeColors } from '@/components/organisms/theme-switch/types';
import {
  getExpenses,
  getCompanies,
  addExpense,
  updateExpense,
  deleteExpense,
} from '@/storage/asyncStorage';
import { generateId, formatCurrency, getNextMonth, maskCurrency, parseMaskedCurrency, numberToMasked } from '@/utils/helpers';
import type { Company, Expense, ExpenseCategory } from '@/types';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '@/types';

const ALL_CATEGORIES: ExpenseCategory[] = [
  'moradia', 'alimentacao', 'transporte', 'saude',
  'educacao', 'lazer', 'servicos', 'outros',
];

type FormState = {
  name: string;
  amount: string;
  category: ExpenseCategory;
};

const EMPTY_FORM: FormState = {
  name: '',
  amount: '',
  category: 'outros',
};

export default function GastosScreen() {
  const { colors } = useTheme();
  const sheetRef = useRef<BottomSheetMethods>(null);
  const { present: presentSheet, dismiss: dismissSheet } = useBottomSheet();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const nextMonth = getNextMonth();

  useFocusEffect(
    useCallback(() => {
      Promise.all([getExpenses(), getCompanies()]).then(([exps, comps]) => {
        setExpenses(exps);
        setCompanies(comps);
      });
    }, []),
  );

  // ── Derived ──────────────────────────────────────────────────────────────

  const monthExpenses = expenses.filter(
    (e) => e.month === nextMonth.month && e.year === nextMonth.year,
  );

  const totalIncome = companies.reduce(
    (sum, c) =>
      sum +
      c.salary +
      (c.hasVR ? c.vrAmount : 0) +
      (c.hasTransport ? c.transportAmount : 0),
    0,
  );

  const totalExpenses = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const leftover = totalIncome - totalExpenses;
  const paidCount = monthExpenses.filter((e) => e.paid).length;

  const unpaid = monthExpenses.filter((e) => !e.paid);
  const paid = monthExpenses.filter((e) => e.paid);

  const byCategory = ALL_CATEGORIES.map((cat) => ({
    cat,
    total: monthExpenses
      .filter((e) => e.category === cat)
      .reduce((s, e) => s + e.amount, 0),
  })).filter((x) => x.total > 0);

  const progressPct =
    monthExpenses.length > 0 ? paidCount / monthExpenses.length : 0;

  // ── Sheet helpers ─────────────────────────────────────────────────────────

  function openNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    sheetRef.current?.snapToIndex(0);
  }

  function openEdit(expense: Expense) {
    setEditingId(expense.id);
    setForm({
      name: expense.name,
      amount: numberToMasked(expense.amount),
      category: expense.category,
    });
    sheetRef.current?.snapToIndex(0);
  }

  function closeSheet() {
    Keyboard.dismiss();
    sheetRef.current?.close();
  }

  function handleClose() {
    Keyboard.dismiss();
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  // ── Category selector (BottomSheetStack) ─────────────────────────────────

  function openCategorySelector() {
    const currentCategory = form.category;

    presentSheet(
      <BottomSheet
        snapPoints={['55%']}
        backgroundColor={colors.card}
        onClose={dismissSheet}
      >
        <View style={[styles.catSheetContent, { backgroundColor: colors.card }]}>
          <FadeText
            inputs={['Selecionar Categoria']}
            fontSize={17}
            fontWeight="700"
            color={colors.text}
            wordDelay={0}
            duration={300}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {ALL_CATEGORIES.map((cat) => {
              const selected = currentCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => {
                    setForm((f) => ({ ...f, category: cat }));
                    dismissSheet();
                  }}
                  style={[
                    styles.catRow,
                    {
                      borderColor: selected ? colors.primary : colors.border,
                      backgroundColor: selected
                        ? colors.primary + '18'
                        : 'transparent',
                    },
                  ]}
                >
                  <FadeText
                    inputs={[`${CATEGORY_ICONS[cat]}  ${CATEGORY_LABELS[cat]}`]}
                    fontSize={15}
                    color={selected ? colors.primary : colors.text}
                    fontWeight={selected ? '700' : '400'}
                    wordDelay={0}
                    duration={200}
                  />
                  {selected && (
                    <FadeText
                      inputs={['✓']}
                      fontSize={16}
                      color={colors.primary}
                      fontWeight="700"
                      wordDelay={0}
                      duration={200}
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </BottomSheet>,
    );
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!form.name.trim()) return;

    Keyboard.dismiss();

    const data: Expense = {
      id: editingId ?? generateId(),
      name: form.name.trim(),
      amount: parseMaskedCurrency(form.amount),
      category: form.category,
      month: nextMonth.month,
      year: nextMonth.year,
      paid: false,
    };

    const updated = editingId
      ? await updateExpense(data)
      : await addExpense(data);
    setExpenses(updated);
    setForm(EMPTY_FORM);
    setEditingId(null);
    sheetRef.current?.close();
  }

  async function togglePaid(expense: Expense) {
    const updated = await updateExpense({ ...expense, paid: !expense.paid });
    setExpenses(updated);
  }

  async function handleDelete(id: string) {
    Alert.alert('Excluir gasto', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const updated = await deleteExpense(id);
          setExpenses(updated);
        },
      },
    ]);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <StaggeredText
            text="Gastos do Mês"
            style={[styles.title, { color: colors.text }]}
          />
          <FadeText
            inputs={[nextMonth.label]}
            fontSize={14}
            color={colors.primary}
            fontWeight="700"
            wordDelay={0}
            duration={500}
          />
        </View>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.destructive + '18',
                borderColor: colors.destructive + '30',
              },
            ]}
          >
            <FadeText
              inputs={['Total Gastos']}
              fontSize={11}
              color={colors.destructive}
              fontWeight="700"
              wordDelay={0}
              duration={300}
            />
            <StaggeredText
              text={formatCurrency(totalExpenses)}
              style={[styles.summaryValue, { color: colors.destructive }]}
            />
          </View>

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor:
                  leftover >= 0 ? colors.success + '18' : colors.warning + '18',
                borderColor:
                  leftover >= 0 ? colors.success + '30' : colors.warning + '30',
              },
            ]}
          >
            <FadeText
              inputs={['Sobra Estimada']}
              fontSize={11}
              color={leftover >= 0 ? colors.success : colors.warning}
              fontWeight="700"
              wordDelay={0}
              duration={300}
            />
            <StaggeredText
              text={formatCurrency(leftover)}
              style={[
                styles.summaryValue,
                { color: leftover >= 0 ? colors.success : colors.warning },
              ]}
            />
          </View>
        </View>

        {/* Income reference */}
        {totalIncome > 0 && (
          <View
            style={[
              styles.incomeRef,
              { backgroundColor: colors.muted, borderColor: colors.border },
            ]}
          >
            <FadeText
              inputs={[`💰 Renda Total: ${formatCurrency(totalIncome)}`]}
              fontSize={13}
              color={colors.textSecondary}
              wordDelay={0}
              duration={400}
            />
          </View>
        )}

        {/* Category breakdown */}
        {byCategory.length > 0 && (
          <View style={styles.categorySection}>
            <FadeText
              inputs={['POR CATEGORIA']}
              fontSize={11}
              color={colors.mutedForeground}
              fontWeight="700"
              wordDelay={0}
              duration={300}
            />
            <View style={styles.categoryChips}>
              {byCategory.map(({ cat, total }) => (
                <View
                  key={cat}
                  style={[
                    styles.catChip,
                    { backgroundColor: colors.muted, borderColor: colors.border },
                  ]}
                >
                  <FadeText
                    inputs={[
                      `${CATEGORY_ICONS[cat]} ${CATEGORY_LABELS[cat]} · ${formatCurrency(total)}`,
                    ]}
                    fontSize={12}
                    color={colors.text}
                    wordDelay={0}
                    duration={300}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Progress bar */}
        {monthExpenses.length > 0 && (
          <View style={styles.progressSection}>
            <FadeText
              inputs={[`${paidCount}/${monthExpenses.length} contas pagas`]}
              fontSize={12}
              color={colors.textSecondary}
              wordDelay={0}
              duration={300}
            />
            <View
              style={[styles.progressTrack, { backgroundColor: colors.border }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPct * 100}%`,
                    backgroundColor: colors.success,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Expense lists */}
        {monthExpenses.length === 0 ? (
          <View style={styles.empty}>
            <FadeText
              inputs={['📋']}
              fontSize={48}
              color={colors.mutedForeground}
              wordDelay={0}
            />
            <FadeText
              inputs={['Nenhum gasto cadastrado']}
              fontSize={16}
              color={colors.mutedForeground}
              wordDelay={100}
            />
            <FadeText
              inputs={['Toque no + para adicionar']}
              fontSize={13}
              color={colors.mutedForeground}
              wordDelay={120}
            />
          </View>
        ) : (
          <>
            {unpaid.length > 0 && (
              <View style={styles.listSection}>
                <FadeText
                  inputs={['A PAGAR']}
                  fontSize={11}
                  color={colors.destructive}
                  fontWeight="700"
                  wordDelay={0}
                  duration={300}
                />
                {unpaid.map((expense) => (
                  <ExpenseRow
                    key={expense.id}
                    expense={expense}
                    colors={colors}
                    onToggle={() => togglePaid(expense)}
                    onEdit={() => openEdit(expense)}
                    onDelete={() => handleDelete(expense.id)}
                  />
                ))}
              </View>
            )}
            {paid.length > 0 && (
              <View style={styles.listSection}>
                <FadeText
                  inputs={['PAGAS']}
                  fontSize={11}
                  color={colors.success}
                  fontWeight="700"
                  wordDelay={0}
                  duration={300}
                />
                {paid.map((expense) => (
                  <ExpenseRow
                    key={expense.id}
                    expense={expense}
                    colors={colors}
                    onToggle={() => togglePaid(expense)}
                    onEdit={() => openEdit(expense)}
                    onDelete={() => handleDelete(expense.id)}
                  />
                ))}
              </View>
            )}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={openNew}
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <FadeText
          inputs={['+']}
          fontSize={28}
          color="#fff"
          fontWeight="300"
          wordDelay={0}
          duration={0}
        />
      </Pressable>

      {/* BottomSheet – add/edit expense */}
      <BottomSheet
        ref={sheetRef}
        snapPoints={['65%']}
        backgroundColor={colors.card}
        onClose={handleClose}
      >
        <View style={[styles.sheetContent, { backgroundColor: colors.card }]}>
          <FadeText
            inputs={[editingId ? 'Editar Gasto' : 'Novo Gasto']}
            fontSize={18}
            fontWeight="700"
            color={colors.text}
            wordDelay={0}
            duration={300}
          />

          <AnimatedInput
            placeholders={['Nome do gasto']}
            value={form.name}
            onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
            inputWrapperStyle={[
              styles.inputWrapper,
              { backgroundColor: colors.muted, borderColor: colors.border },
            ]}
            inputStyle={{ color: colors.text }}
            placeholderStyle={{ color: colors.mutedForeground }}
          />

          <AnimatedInput
            placeholders={['Valor (R$)']}
            value={form.amount}
            onChangeText={(v) => setForm((f) => ({ ...f, amount: maskCurrency(v) }))}
            keyboardType="decimal-pad"
            inputWrapperStyle={[
              styles.inputWrapper,
              { backgroundColor: colors.muted, borderColor: colors.border },
            ]}
            inputStyle={{ color: colors.text }}
            placeholderStyle={{ color: colors.mutedForeground }}
          />

          {/* Category selector button */}
          <Pressable
            onPress={openCategorySelector}
            style={[
              styles.catSelector,
              { backgroundColor: colors.muted, borderColor: colors.border },
            ]}
          >
            <FadeText
              inputs={[
                `${CATEGORY_ICONS[form.category]} ${CATEGORY_LABELS[form.category]}`,
              ]}
              fontSize={14}
              color={colors.text}
              wordDelay={0}
              duration={200}
            />
            <FadeText
              inputs={['›']}
              fontSize={20}
              color={colors.textSecondary}
              wordDelay={0}
              duration={0}
            />
          </Pressable>

          <View style={styles.buttonRow}>
            <Button
              onPress={handleSave}
              backgroundColor={colors.primary}
              width={180}
              height={48}
            >
              <FadeText
                inputs={[editingId ? 'Salvar Alterações' : 'Adicionar Gasto']}
                fontSize={14}
                color="#fff"
                fontWeight="700"
                wordDelay={0}
                duration={0}
              />
            </Button>
            <Button
              onPress={closeSheet}
              backgroundColor={colors.muted}
              width={110}
              height={48}
            >
              <FadeText
                inputs={['Cancelar']}
                fontSize={14}
                color={colors.textSecondary}
                fontWeight="600"
                wordDelay={0}
                duration={0}
              />
            </Button>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

// ── ExpenseRow ────────────────────────────────────────────────────────────

function ExpenseRow({
  expense,
  colors,
  onToggle,
  onEdit,
  onDelete,
}: {
  expense: Expense;
  colors: ThemeColors;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Pressable
      onPress={onEdit}
      onLongPress={onDelete}
      style={({ pressed }) => [
        styles.expenseRow,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Pressable onPress={onToggle} style={styles.checkContainer}>
        <Checkbox
          checked={expense.paid}
          checkmarkColor={colors.success}
          size={26}
          showBorder
        />
      </Pressable>
      <View style={{ flex: 1 }}>
        <FadeText
          inputs={[`${CATEGORY_ICONS[expense.category]} ${expense.name}`]}
          fontSize={14}
          color={expense.paid ? colors.mutedForeground : colors.text}
          fontWeight="500"
          textAlign="left"
          wordDelay={0}
          duration={300}
        />
      </View>
      <FadeText
        inputs={[formatCurrency(expense.amount)]}
        fontSize={14}
        color={expense.paid ? colors.success : colors.destructive}
        fontWeight="700"
        wordDelay={0}
        duration={300}
      />
    </Pressable>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 20 },
  header: { marginBottom: 16, gap: 4 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  summaryValue: { fontSize: 20, fontWeight: '800' },
  incomeRef: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  categorySection: { marginBottom: 16, gap: 8 },
  categoryChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  progressSection: { marginBottom: 16, gap: 6 },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  listSection: { marginBottom: 16, gap: 8 },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 60,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  checkContainer: { padding: 4 },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 12,
  },
  inputWrapper: { borderRadius: 12, borderWidth: 1 },
  catSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  catSheetContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 12,
  },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
});
