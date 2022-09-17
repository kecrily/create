import { blue, green } from 'kolorist'

interface template {
  name: string
  display: string
  variants: variant[]
}

type variant = Omit<template, 'variants'>

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
] as template[]

export { variant, templates }
