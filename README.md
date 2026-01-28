# MultiSelect React

> Accessible, feature-rich React multiselect component with TypeScript support

[![NPM](https://img.shields.io/npm/v/multiselect-react.svg)](https://www.npmjs.com/package/multiselect-react)

## Features

- ✅ **Fully accessible** - Proper ARIA roles, keyboard navigation
- ✅ **TypeScript** - Full type definitions included
- ✅ **Search/Filter** - Type to filter options
- ✅ **No icon deps** - Inline SVGs, no FontAwesome bloat
- ✅ **Customizable** - Theming via styled-components
- ✅ **Imperative API** - Control via ref
- ✅ **Powered by Downshift** - Battle-tested accessibility

## Install

```bash
npm install --save multiselect-react
```

## Quick Start

```tsx
import { MultiSelect, MultiSelectRef } from 'multiselect-react';
import { useRef, useState } from 'react';

const options = [
  { id: '1', content: 'Apple' },
  { id: '2', content: 'Banana' },
  { id: '3', content: 'Cherry' },
  { id: '4', content: 'Date' },
];

function App() {
  const [selected, setSelected] = useState<React.ReactNode[]>([]);
  const multiRef = useRef<MultiSelectRef>(null);

  return (
    <MultiSelect
      ref={multiRef}
      label="Select Fruits"
      options={options}
      updateSelectedItems={setSelected}
      searchable
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **required** | Label for the select |
| `options` | `MultiSelectOption[]` | - | Array of options |
| `children` | `ReactNode` | - | Alternative: render options as children |
| `updateSelectedItems` | `(items) => void` | **required** | Callback when selection changes |
| `placeholder` | `string` | `"Select items..."` | Placeholder text |
| `searchable` | `boolean` | `false` | Enable search/filter |
| `searchPlaceholder` | `string` | `"Search..."` | Search input placeholder |
| `disabled` | `boolean` | `false` | Disable the component |
| `loading` | `boolean` | `false` | Show loading spinner |
| `error` | `string` | - | Error message to display |
| `maxSelections` | `number` | - | Limit selection count |
| `hasButton` | `boolean` | `true` | Show Select All / Done buttons |
| `buttonText` | `string` | `"Done"` | Done button text |
| `initialSelectedItemList` | `ReactNode[]` | `[]` | Initial selections |

## Imperative API

Access methods via ref:

```tsx
const ref = useRef<MultiSelectRef>(null);

// Clear all selections
ref.current?.clearAll();

// Select all options
ref.current?.selectAll();

// Toggle a specific item
ref.current?.toggleItem(itemNode);

// Set selections by ID
ref.current?.setSelectedItemsListFromIds([{ id: '1' }, { id: '3' }]);

// Get current selections
const items = ref.current?.getSelectedItems();
```

## Using Children (Alternative to `options`)

```tsx
<MultiSelect
  label="Select Fruits"
  updateSelectedItems={setSelected}
>
  <span id="1" content="Apple">🍎 Apple</span>
  <span id="2" content="Banana">🍌 Banana</span>
  <span id="3" content="Cherry">🍒 Cherry</span>
</MultiSelect>
```

## Accessibility

This component follows WAI-ARIA Authoring Practices for listbox:

- `role="combobox"` on the toggle button
- `role="listbox"` on the dropdown
- `role="option"` on each item
- `aria-expanded`, `aria-haspopup`, `aria-selected`
- Full keyboard navigation (Arrow keys, Enter, Space, Escape)
- Focus management

## Custom Styling

Pass `customStyles` prop with CSS:

```tsx
import { css } from 'styled-components';

<MultiSelect
  label="Custom Theme"
  options={options}
  updateSelectedItems={setSelected}
  customStyles={css`
    .select-list__toggle {
      border-color: purple;
    }
    .select-list__item.is-active {
      background-color: purple;
    }
  `}
/>
```

## Migration from v0.x

### Breaking Changes

1. **TypeScript** - Component is now TypeScript-first
2. **No FontAwesome** - Icons are inline SVGs
3. **React 17+** - Minimum React version increased
4. **downshift 8** - Updated to latest Downshift

### Removed Props

- `prop-types` dependency removed (use TypeScript)
- `sendItems` renamed to `updateSelectedItems`

### New Props

- `disabled` - Disable the component
- `loading` - Show loading state
- `error` - Show error message
- `searchable` - Enable search
- `maxSelections` - Limit selections
- `options` - Alternative to children

## License

MIT © [raymondware](https://github.com/raymondware)
