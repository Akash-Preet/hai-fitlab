## **General Rules for Code Generation (React)**

1. **Component Reuse**
   - Before creating a new component:
     - Search for similar components in the `src/components/` or `src/lib/components/` directory.
     - Consider extracting reusable logic into a **custom hook** in `src/hooks/` or `lib/hooks/` if multiple components share the same logic.
     - Extend existing components whenever possible to prevent duplication.

2. **Folder and Project Structure**
   - Keep a clear separation of **components**, **hooks**, **services**, **utilities**, and **constants**.
   - Use a **feature-based** or **domain-based** structure if it suits the project size and complexity (e.g., `/features/user`, `/features/dashboard`).
   - Keep components and their related files grouped together, for example:
     ```
     /MyComponent
       ├── MyComponent.tsx
       ├── MyComponent.module.scss
       ├── MyComponent.test.tsx
       └── index.ts
     ```

3. **Language and Framework**
   - Use **React** with **TypeScript** for all components, hooks, and utilities (`.tsx` for components, `.ts` for non-UI code).
   - **Functional Components** (with Hooks) are preferred over class components unless there is a specific requirement for class lifecycle methods.

4. **File Naming Conventions**
   - Use **PascalCase** for React components, e.g., `MyComponent.tsx`.
   - Name test files with the `.test.tsx` suffix, matching the component name.
   - For non-component files (utilities, constants, hooks), use **kebab-case** or **camelCase**, but be consistent across the project.

5. **API Calls**
   - Use **services** or **hooks** to encapsulate all external API interactions.
   - Suggest adding new methods to existing service files in `src/services/` or creating a custom hook in `src/hooks/` instead of making standalone API calls within components.
   - Keep UI components focused on rendering and state management; abstract business logic and data fetching into hooks or services.

6. **Component File Structure and Size**
   - Each component should have its own folder containing:
     - `ComponentName.tsx` (main component file)
     - `ComponentName.module.scss` (or `.css`, `.less`, etc. depending on your styling convention)
     - `ComponentName.test.tsx` (unit tests)
     - `index.ts` (re-export for simpler imports)
   - Keep component files **under 200 lines** to maintain readability and encourage separation of concerns.
   - If the logic grows too large, break out reusable parts into **custom hooks** or **child components**.

---

### Example File Organization

```
src/
  ├── components/
  │   ├── Header/
  │   │   ├── Header.tsx
  │   │   ├── Header.module.scss
  │   │   ├── Header.test.tsx
  │   │   └── index.ts
  │   └── Footer/
  │       ├── Footer.tsx
  │       ├── Footer.module.scss
  │       ├── Footer.test.tsx
  │       └── index.ts
  ├── hooks/
  │   ├── useUserData.ts
  │   └── useFetch.ts
  ├── services/
  │   └── userService.ts
  ├── utils/
  │   └── formatDate.ts
  ├── constants/
  │   └── status.ts
  └── App.tsx
```
- Use **React.memo**, **useCallback**, and **useMemo** where appropriate to avoid unnecessary re-renders.
- Avoid inline functions or objects in component props if they cause frequent re-renders.
- Consider **code splitting** using **React.lazy** and **Suspense** for large components or routes to improve initial load times.
- Use **React Context** or **Redux** (if applicable) for global state when multiple components need shared data.
- Keep component-level state as local as possible to reduce unnecessary complexity.
- For asynchronous state or side-effects, use hooks like **useEffect** or external state libraries that handle side-effects properly (e.g., **React Query**, **Redux-Saga**, etc.).
- Use **Error Boundaries** (class components or libraries like `react-error-boundary`) to gracefully handle runtime errors.
- Provide meaningful error messages and fallback UIs to enhance user experience in the event of a crash.
- Follow **ARIA** guidelines and use semantic HTML elements (e.g., `<main>`, `<nav>`, `<section>`) wherever possible.
- Ensure form elements and interactive components have appropriate labels and roles.
- Enforce **ESLint** and **Prettier** (or your chosen linter/formatter) across the codebase to maintain a consistent style.
- Keep functions and components focused on a **single responsibility** to simplify maintenance.
- Write clear and descriptive **JSDoc/TypeDoc** comments for complex hooks, utility functions, and services.