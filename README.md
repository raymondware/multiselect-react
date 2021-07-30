# MultiSelect React

> 

[![NPM](https://img.shields.io/npm/v/swigg.svg)](https://www.npmjs.com/package/swigg) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save multiselect-react
```

## Usage

```jsx
import { MultiSelect } from 'multiselect-react'

const App = () => (
  <MultiSelect
    ref={ref}
    {...MultiSelectListData}
    updateSelectedItems={updateSelectedItems}
    initialSelectedItemList={[ListItems[0], ListItems[3]]}
  >
    {ListItems}
  </MultiSelect>
)
```

## License

MIT © [raymondware](https://github.com/raymondware)
