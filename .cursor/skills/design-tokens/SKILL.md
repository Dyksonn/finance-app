---
name: design-tokens
description: Gerar e manter Design Tokens escaláveis para React Native/Expo com TypeScript, sem Tailwind. Use quando criar design system, tokens, themes, ThemeProvider, ou estrutura em src/design-system. Suporta Figma export, arquivo local ou fallback automático. Separa tokens (primitivos) de tema (semântico), multi-brand via configuração.
---

# Design Tokens (React Native / Expo, sem Tailwind)

Skill responsável por gerar e manter um Design System escalável para React Native com Expo e TypeScript, sem Tailwind. Separa tokens (valores brutos) de tema (uso semântico).

## Fonte de Verdade (ordem de prioridade)

1. **Figma** — Procurar por: `design-tokens.json`, `tokens.json`, `figma-tokens.json`
2. **Local padrão** — `src/design-system/tokens/tokens.json` (SSOT)
3. **Fallback** — Gerar automaticamente: escala neutra 50–900, primary palette, grid 4px, tipografia harmônica

## Arquitetura

```
src/design-system/
  tokens/           # valores primitivos
    colors.ts
    spacing.ts
    typography.ts
    radius.ts
    shadows.ts
    index.ts
  themes/           # composição semântica
    light.ts
    dark.ts
    index.ts
  provider/
    ThemeProvider.tsx
    useTheme.ts
  types/
    theme.ts
  utils/
    createTheme.ts
```

- **Tokens** = valores primitivos (raw)
- **Theme** = mapeamento semântico (ex: `theme.colors.button.primary.background`)
- **Provider** = runtime e aplicação

## Regra semântica

❌ **Errado:** `backgroundColor: colors.primary`  
✅ **Certo:** `backgroundColor: theme.colors.button.primary.background`

Tokens são primitivos. Theme é semântico — permite trocar branding sem refatorar componentes.

## Tokens obrigatórios

- **colors:** primary (escala opcional), neutral (50–900), semantic (success, error, warning, info)
- **spacing:** grid 4px (0, 4, 8, 12, 16, 24, 32, 48, 64…)
- **typography:** fontSize, lineHeight, fontWeight
- **radius:** escala de border radius
- **shadows:** elevações tipadas

## Temas

- `light` e `dark` obrigatórios
- Composição via `createTheme()` usando tokens

## Provider e hook

- `ThemeProvider` — contexto React
- `useTheme()` — hook tipado
- Opcional: integração com React Navigation theme

## Multi-brand (fintech)

Arquitetura deve permitir carregar temas dinamicamente (multi-brand) via config externa ou feature flag.

## Compatibilidade

- Não usar styled-components nem Tailwind
- Usar `StyleSheet` do React Native
- Tipagem forte do Theme em TypeScript
