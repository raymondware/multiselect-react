# swigg

> 

[![NPM](https://img.shields.io/npm/v/swigg.svg)](https://www.npmjs.com/package/swigg) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save swigg
```

## Usage

```jsx
import { Button } from 'swigg'

const App = () => (
  <Button>Click Me</Button>
)
```

## Responsive Nav

```jsx
import { MainNav } from 'swigg'

const App = () => (
  <MainNav bg="#f8f8f8" fontColor="slateblue" breakPoint="900px" isSticky={true} logo={{ url: 'https://www.raymondware.com/images/footer-logo.png', alt: "test logo" }}>
    <ul>
      <li><a href="#">Projects</a></li>
      <li><a href="#">Services</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </MainNav>
)
```

## Auto Grid

```jsx
import { AutoGrid, ProjectCard } from 'swigg'

const App = () => (
  <AutoGrid bg="#212121" minWidth="250px" spacing="45px" padding="45px">
    <ProjectCard maxWidth="250px" />
    <ProjectCard maxWidth="250px" />
    <ProjectCard maxWidth="250px" />
    <ProjectCard maxWidth="250px" />
    <ProjectCard maxWidth="250px" />
    <ProjectCard maxWidth="250px" />
  </AutoGrid>
```

## Card

```jsx
import { ProjectCard } from 'swigg'

const App = () => (
  <ProjectCard maxWidth="250px" title="Dynamic" link="https://link" children="This is the description" techList={["party", "people", "tags"]} bgOverlay="tomato" bgImage="https://linktoimage" />
```

## Gallery

```jsx
import { Gallery } from 'swigg'

const someFunc = () => {
  alert('Hi, this is a callback')
}

const App = () => (
  <Gallery 
    bg = "#fcfcfc"
    padding = "45px"
    spacing = "25px"
    colSize = "350px"
    items = {
      [{
        clickCallback: someFunc,
        image: "https://someimg"
      }, 
      {
        image: "https://someimg"
      },
      {
        image: "https://someimg"
      },
      {
        image: "https://someimg"
      }
      ]
    }
  />
)
```

## License

MIT © [raymondware](https://github.com/raymondware)
