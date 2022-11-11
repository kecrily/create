import { blue, green } from 'kolorist'

interface Template {
  name: string
  display: string
  variants: Variant[]
}

type Variant = Omit<Template, 'variants'>

const templates = [
  {
    name: 'lib',
    display: 'Library',
    variants: [
      {
        name: 'ts',
        display: blue('TypeScript'),
      },
      {
        name: 'vue-com',
        display: green('Vue Component'),
      },
    ],
  },
  {
    name: 'web',
    display: 'Website',
    variants: [
      {
        name: 'vue',
        display: green('Vue'),
      },
    ],
  },
] as Template[]

export { Variant, templates }
