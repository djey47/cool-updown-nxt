# cool-updown-nxt WEB UI

Provides a web frontend using the cool-updown-nxt API.

Here are the main components behind it:
  - 💚 [node](https://nodejs.org/en) v18+
  - [__⚛__] [react](https://react.dev) v18
  - 🟦 [typescript](https://www.typescriptlang.org) as main language
  - ⚡ [vite](https://vitejs.dev)
  - 🔩 [eslint](https://eslint.org) & 🃏 [jest](https://jestjs.io) for code quality and reliability.

## Install

Be sure to `cd` into this `web` folder, then issue `npm install`.

## Develop

...with HMR:

`npm run dev`

ESlint is used to lint code during dev server execution.

## Deploy

`npm run build` will produce a release build, ready to use, under the `dist` directory.

Frontend will then be served in addition to the associated API. See the `<root>/api` directory documentation for details.

---

*LEGACY DOCUMENTATION*

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
