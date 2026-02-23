import { StyleSheet, View, Alert, SafeAreaView, ScrollView } from 'react-native';
import { FadeText } from '@/components/organisms/fade-text';
import { StaggeredText } from '@/components/organisms/animated-text';
import { Button } from '@/components/base/button';
import { useTheme } from '@/components/organisms/theme-switch/hooks';
import { clearAllData } from '@/storage/asyncStorage';

export default function ConfiguracoesScreen() {
  const { colors, toggleTheme, isDark } = useTheme();

  async function handleClearData() {
    Alert.alert(
      'Limpar Todos os Dados',
      'Esta ação é irreversível. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('Dados apagados', 'Todos os dados foram removidos.');
          },
        },
      ],
    );
  }

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
            text="Configurações"
            style={[styles.title, { color: colors.text }]}
          />
          <FadeText
            inputs={['Ajustes e preferências do app']}
            fontSize={13}
            color={colors.textSecondary}
            wordDelay={80}
          />
        </View>

        {/* Theme card */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <FadeText
            inputs={['🌗 Tema do Aplicativo']}
            fontSize={15}
            fontWeight="600"
            color={colors.text}
            wordDelay={0}
            duration={400}
          />
          <View style={styles.themeRow}>
            <FadeText
              inputs={[isDark ? 'Modo Escuro ativo' : 'Modo Claro ativo']}
              fontSize={13}
              color={colors.textSecondary}
              wordDelay={0}
              duration={300}
            />
            <Button
              onPress={() => toggleTheme()}
              backgroundColor={isDark ? colors.muted : colors.primary + '22'}
              width={110}
              height={38}
              borderRadius={19}
            >
              <FadeText
                inputs={[isDark ? '☀️ Claro' : '🌙 Escuro']}
                fontSize={13}
                color={isDark ? colors.text : colors.primary}
                fontWeight="600"
                wordDelay={0}
                duration={0}
              />
            </Button>
          </View>
        </View>

        {/* App info card */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <FadeText
            inputs={['ℹ️ Informações']}
            fontSize={15}
            fontWeight="600"
            color={colors.text}
            wordDelay={0}
            duration={400}
          />
          {(
            [
              ['Versão', '1.0.0 MVP'],
              ['Storage', 'AsyncStorage'],
              ['UI Kit', 'Reactix'],
            ] as [string, string][]
          ).map(([label, value]) => (
            <View key={label} style={styles.infoRow}>
              <FadeText
                inputs={[label]}
                fontSize={13}
                color={colors.textSecondary}
                wordDelay={0}
                duration={300}
              />
              <FadeText
                inputs={[value]}
                fontSize={13}
                fontWeight="600"
                color={colors.text}
                wordDelay={0}
                duration={300}
              />
            </View>
          ))}
        </View>

        {/* Danger zone */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.destructive + '0A',
              borderColor: colors.destructive + '40',
            },
          ]}
        >
          <FadeText
            inputs={['ZONA DE PERIGO']}
            fontSize={11}
            fontWeight="700"
            color={colors.destructive}
            wordDelay={0}
            duration={400}
          />
          <FadeText
            inputs={[
              'Esta ação remove todas as empresas e gastos permanentemente.',
            ]}
            fontSize={13}
            color={colors.textSecondary}
            wordDelay={0}
            duration={300}
          />
          <Button
            onPress={handleClearData}
            backgroundColor={colors.destructive}
            width={230}
            height={48}
          >
            <FadeText
              inputs={['Limpar Todos os Dados']}
              fontSize={14}
              color="#fff"
              fontWeight="700"
              wordDelay={0}
              duration={0}
            />
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 20, gap: 16 },
  header: { marginBottom: 4, gap: 6 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
