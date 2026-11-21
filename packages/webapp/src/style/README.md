# Webapp styling

The webapp standardizes on **SCSS + CSS Modules**. This directory is the global
layer; component and page styles should live next to their component.

## Rules

- Put component/page styles in a colocated `*.module.scss` and import them as
  `import styles from './Foo.module.scss'`.
- `src/style/App.scss` is the single global entry (reset, fonts, Blueprint,
  third-party overrides). Do not add page/component styles here.
- Use CSS custom properties from `_variables.scss` for theme-aware values
  (colors, borders, backgrounds).
- Use `@include dark-mode` for `.bp4-dark` overrides. The mixin emits the
  `:global(.bp4-dark)` selector required by CSS Modules.
- Prefer logical properties for RTL: `margin-inline-start`, `padding-inline`,
  `inset-inline-end`, `border-inline-end`.
- Compose caller overrides with `classNames(styles.root, className)`.
- Target Blueprint internals with `:global(.bp4-...)` inside a module. Keep
  broad third-party overrides in the global stylesheet.
- For a runtime value, set a CSS custom property inline
  (`style={{ '--column-width': `${width}px` }}`) and consume it in the module
  instead of building a full inline style object.

## Helpers

Vite injects these into every SCSS file, so no `@use` is needed:

- `_tokens.scss`: spacing, radii, font sizes and weights.
- `_mixins.scss`: `dark-mode`, `truncate`, `visually-hidden`, `focus-ring`.
- `_breakpoints.scss`: `bp-up($name)` and `bp-down($name)`.

## Migration status

- [x] Foundation (`tokens`, `mixins`, `breakpoints`, Vite injection)
- [x] ExpenseForm pilot
- [ ] Shared components (`PageForm`, `Paper`, `Drawer`, tables, forms)
- [ ] Layout primitives (`Box`, `Stack`, `Group`)
- [ ] Remaining containers
- [ ] Remove the CSS-in-JS dependencies
