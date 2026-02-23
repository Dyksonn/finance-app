import AnimatedInput from "@/components/base/animated-input-bar";
import { Button } from "@/components/base/button";
import { StackedChips } from "@/components/micro-interactions/stacked-chips";
import { StaggeredText } from "@/components/organisms/animated-text";
import { Checkbox } from "@/components/organisms/check-box";
import { FadeText } from "@/components/organisms/fade-text";
import { useTheme } from "@/components/organisms/theme-switch/hooks";
import { BottomSheet } from "@/components/templates/bottom-sheet";
import type { BottomSheetMethods } from "@/components/templates/bottom-sheet/types";
import {
  addCompany,
  deleteCompany,
  getCompanies,
  updateCompany,
} from "@/storage/asyncStorage";
import type { Company } from "@/types";
import {
  formatCurrency,
  generateId,
  maskCurrency,
  numberToMasked,
  parseMaskedCurrency,
} from "@/utils/helpers";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

// ── Form state ────────────────────────────────────────────────────────────

type FormState = {
  name: string;
  salary: string;
  hasVR: boolean;
  vrAmount: string;
  hasTransport: boolean;
  transportAmount: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  salary: "",
  hasVR: false,
  vrAmount: "",
  hasTransport: false,
  transportAmount: "",
};

// ── Screen ────────────────────────────────────────────────────────────────

export default function EmpresasScreen() {
  const { colors } = useTheme();
  const sheetRef = useRef<BottomSheetMethods>(null);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useFocusEffect(
    useCallback(() => {
      getCompanies().then(setCompanies);
    }, []),
  );

  // ── Derived ──────────────────────────────────────────────────────────────

  const totalIncome = companies.reduce(
    (sum, c) =>
      sum +
      c.salary +
      (c.hasVR ? c.vrAmount : 0) +
      (c.hasTransport ? c.transportAmount : 0),
    0,
  );

  const companyNames = companies.map((c) => c.name);

  // ── Sheet helpers ─────────────────────────────────────────────────────────

  function openNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    sheetRef.current?.snapToIndex(0);
  }

  function openEdit(company: Company) {
    console.log("company", company);
    setEditingId(company.id);
    setForm({
      name: company.name,
      salary: numberToMasked(company.salary),
      hasVR: company.hasVR,
      vrAmount: numberToMasked(company.vrAmount),
      hasTransport: company.hasTransport,
      transportAmount: numberToMasked(company.transportAmount),
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

  // ── CRUD ──────────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!form.name.trim()) return;

    Keyboard.dismiss();

    const data: Company = {
      id: editingId ?? generateId(),
      name: form.name.trim(),
      salary: parseMaskedCurrency(form.salary),
      hasVR: form.hasVR,
      vrAmount: form.hasVR ? parseMaskedCurrency(form.vrAmount) : 0,
      hasTransport: form.hasTransport,
      transportAmount: form.hasTransport
        ? parseMaskedCurrency(form.transportAmount)
        : 0,
    };

    const updated = editingId
      ? await updateCompany(data)
      : await addCompany(data);
    setCompanies(updated);
    setForm(EMPTY_FORM);
    setEditingId(null);
    sheetRef.current?.close();
  }

  async function handleDelete(id: string) {
    Alert.alert("Excluir empresa", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          const updated = await deleteCompany(id);
          setCompanies(updated);
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
            text="Minhas Empresas"
            style={[styles.title, { color: colors.text }]}
          />
          <FadeText
            inputs={["Gerencie seus vínculos empregatícios"]}
            fontSize={13}
            color={colors.textSecondary}
            wordDelay={80}
          />
        </View>

        {/* Income card */}
        {companies.length > 0 && (
          <View
            style={[
              styles.incomeCard,
              {
                backgroundColor: colors.primary + "18",
                borderColor: colors.primary + "30",
              },
            ]}
          >
            <FadeText
              inputs={["💰 RENDA TOTAL ESTIMADA"]}
              fontSize={11}
              color={colors.primary}
              fontWeight="700"
              wordDelay={0}
              duration={400}
            />
            <StaggeredText
              text={formatCurrency(totalIncome)}
              style={[styles.incomeValue, { color: colors.primary }]}
            />
            {/* StackedChips with company names */}
            {companyNames.length > 0 && (
              <View style={styles.chipsRow}>
                <StackedChips>
                  <StackedChips.Trigger>
                    <View
                      style={[
                        styles.chip,
                        {
                          backgroundColor: colors.primary + "22",
                          borderColor: colors.primary + "44",
                        },
                      ]}
                    >
                      <FadeText
                        inputs={[companyNames[0]!]}
                        fontSize={12}
                        color={colors.primary}
                        wordDelay={0}
                        duration={300}
                      />
                    </View>
                  </StackedChips.Trigger>
                  {companyNames.slice(1).map((name, i) => (
                    <StackedChips.Content key={i}>
                      <View
                        style={[
                          styles.chip,
                          {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            marginLeft: 6,
                          },
                        ]}
                      >
                        <FadeText
                          inputs={[name]}
                          fontSize={12}
                          color={colors.text}
                          wordDelay={0}
                          duration={300}
                        />
                      </View>
                    </StackedChips.Content>
                  ))}
                </StackedChips>
              </View>
            )}
          </View>
        )}

        {/* Company list / empty state */}
        {companies.length === 0 ? (
          <View style={styles.empty}>
            <FadeText
              inputs={["💼"]}
              fontSize={48}
              color={colors.mutedForeground}
              wordDelay={0}
            />
            <FadeText
              inputs={["Nenhuma empresa cadastrada"]}
              fontSize={16}
              color={colors.mutedForeground}
              wordDelay={100}
            />
            <FadeText
              inputs={["Toque no + para adicionar"]}
              fontSize={13}
              color={colors.mutedForeground}
              wordDelay={120}
            />
          </View>
        ) : (
          companies.map((company) => (
            <Pressable
              key={company.id}
              onPress={() => openEdit(company)}
              onLongPress={() => handleDelete(company.id)}
              style={({ pressed }) => [
                styles.companyCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={styles.cardRow}>
                <FadeText
                  inputs={[company.name]}
                  fontSize={16}
                  fontWeight="700"
                  color={colors.text}
                  textAlign="left"
                  wordDelay={0}
                  duration={400}
                />
                <FadeText
                  inputs={[formatCurrency(company.salary)]}
                  fontSize={15}
                  fontWeight="700"
                  color={colors.primary}
                  textAlign="right"
                  wordDelay={0}
                  duration={400}
                />
              </View>
              <View style={styles.badgeRow}>
                {company.hasVR && (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: colors.success + "22" },
                    ]}
                  >
                    <FadeText
                      inputs={[`🍽️ VR ${formatCurrency(company.vrAmount)}`]}
                      fontSize={11}
                      color={colors.success}
                      fontWeight="600"
                      wordDelay={0}
                      duration={300}
                    />
                  </View>
                )}
                {company.hasTransport && (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: colors.info + "22" },
                    ]}
                  >
                    <FadeText
                      inputs={[
                        `🚌 VT ${formatCurrency(company.transportAmount)}`,
                      ]}
                      fontSize={11}
                      color={colors.info}
                      fontWeight="600"
                      wordDelay={0}
                      duration={300}
                    />
                  </View>
                )}
              </View>
            </Pressable>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={openNew}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: colors.primary,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <FadeText
          inputs={["+"]}
          fontSize={28}
          color="#fff"
          fontWeight="300"
          wordDelay={0}
          duration={0}
        />
      </Pressable>

      {/* BottomSheet */}
      <BottomSheet
        ref={sheetRef}
        snapPoints={["80%"]}
        backgroundColor={colors.card}
        onClose={handleClose}
      >
        <View style={[styles.sheetContent, { backgroundColor: colors.card }]}>
          <FadeText
            inputs={[editingId ? "Editar Empresa" : "Nova Empresa"]}
            fontSize={18}
            fontWeight="700"
            color={colors.text}
            wordDelay={0}
            duration={300}
          />

          <AnimatedInput
            placeholders={["Nome da empresa"]}
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
            placeholders={["Salário (R$)"]}
            value={form.salary}
            onChangeText={(v) => setForm((f) => ({ ...f, salary: v }))}
            mask="currency"
            keyboardType="decimal-pad"
            inputWrapperStyle={[
              styles.inputWrapper,
              { backgroundColor: colors.muted, borderColor: colors.border },
            ]}
            inputStyle={{ color: colors.text }}
            placeholderStyle={{ color: colors.mutedForeground }}
          />

          {/* VR checkbox */}
          <Pressable
            onPress={() => setForm((f) => ({ ...f, hasVR: !f.hasVR }))}
            style={styles.checkRow}
          >
            <Checkbox
              checked={form.hasVR}
              checkmarkColor={colors.success}
              size={28}
              showBorder
            />
            <FadeText
              inputs={["Recebe Vale Refeição?"]}
              fontSize={14}
              color={colors.text}
              wordDelay={0}
              duration={300}
            />
          </Pressable>

          {form.hasVR && (
            <AnimatedInput
              placeholders={["Valor VR (R$)"]}
              value={form.vrAmount}
              onChangeText={(v) =>
                setForm((f) => ({ ...f, vrAmount: maskCurrency(v) }))
              }
              keyboardType="decimal-pad"
              inputWrapperStyle={[
                styles.inputWrapper,
                { backgroundColor: colors.muted, borderColor: colors.border },
              ]}
              inputStyle={{ color: colors.text }}
              placeholderStyle={{ color: colors.mutedForeground }}
            />
          )}

          {/* VT checkbox */}
          <Pressable
            onPress={() =>
              setForm((f) => ({ ...f, hasTransport: !f.hasTransport }))
            }
            style={styles.checkRow}
          >
            <Checkbox
              checked={form.hasTransport}
              checkmarkColor={colors.info}
              size={28}
              showBorder
            />
            <FadeText
              inputs={["Recebe Vale Transporte?"]}
              fontSize={14}
              color={colors.text}
              wordDelay={0}
              duration={300}
            />
          </Pressable>

          {form.hasTransport && (
            <AnimatedInput
              placeholders={["Valor VT (R$)"]}
              value={form.transportAmount}
              onChangeText={(v) =>
                setForm((f) => ({ ...f, transportAmount: maskCurrency(v) }))
              }
              keyboardType="decimal-pad"
              inputWrapperStyle={[
                styles.inputWrapper,
                { backgroundColor: colors.muted, borderColor: colors.border },
              ]}
              inputStyle={{ color: colors.text }}
              placeholderStyle={{ color: colors.mutedForeground }}
            />
          )}

          <View style={styles.buttonRow}>
            <Button
              onPress={handleSave}
              backgroundColor={colors.primary}
              width={200}
              height={48}
            >
              <FadeText
                inputs={[editingId ? "Salvar Alterações" : "Adicionar Empresa"]}
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
                inputs={["Cancelar"]}
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

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 20 },
  header: { marginBottom: 20, gap: 6 },
  title: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  incomeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  incomeValue: { fontSize: 28, fontWeight: "800" },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  companyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 10,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  badge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingTop: 80,
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
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
  inputWrapper: {
    borderRadius: 12,
    borderWidth: 1,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    // gap: 12,
    paddingVertical: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 10,
    flexWrap: "wrap",
  },
});
