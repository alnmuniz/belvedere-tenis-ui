# belvedere-tenis-ui

Frontend para sistema de reserva de quadra de tenis do Condomínio Belvedere Hill

## Descrição

Sistema de reserva de quadra de tênis desenvolvido com Vue 3, TypeScript e Vite para o Condomínio Belvedere Hill.

## Configuração Recomendada do IDE

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (e desabilitar Vetur).

## Suporte a Tipos para Imports `.vue` em TS

TypeScript não consegue lidar com informações de tipo para imports `.vue` por padrão, então substituímos o CLI `tsc` por `vue-tsc` para verificação de tipos. Nos editores, precisamos do [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) para tornar o serviço de linguagem TypeScript ciente dos tipos `.vue`.

## Configuração Personalizada

Veja [Referência de Configuração do Vite](https://vite.dev/config/).

## Configuração do Projeto

```sh
npm install
```

### Compilar e Hot-Reload para Desenvolvimento

```sh
npm run dev
```

### Verificar Tipos, Compilar e Minificar para Produção

```sh
npm run build
```

### Executar Testes Unitários com [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint com [ESLint](https://eslint.org/)

```sh
npm run lint
```
