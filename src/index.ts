import { exec } from 'child_process'
import type { Choice } from 'prompts'
import prompts from 'prompts'
import { blue, green, red } from 'kolorist'
import degit from 'degit'

interface template {
  name: string
  display: string
  variants?: variant[]
}

type variant = Omit<template, 'variants'>

const data: template[] = [
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
]

export default async function() {
  let result: prompts.Answers<'projectName' | 'variant'>
  try {
    result = await prompts([
      {
        name: 'usage',
        type: 'select',
        message: 'What do you wan to do:',
        choices: data.map((t) => { return { title: t.display, value: t.variants } as Choice }),
      },
      {
        name: 'variant',
        type: 'select',
        message: 'Select a variant:',
        choices: (usage: variant[]) =>
          usage.map((v) => { return { title: v.display, value: v.name } as Choice }),
      },
      {
        name: 'projectName',
        type: 'text',
        message: 'Your project name?',
      },
    ],
    {
      onCancel: () => {
        throw new Error(`${red('✖')} Operation cancelled`)
      },
    })
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }

  const emitter = degit(`kecrily/create-kecrily/templates/${result.variant}`)

  await emitter.clone(result.projectName)
  exec(`git init ${result.projectName}`)
}
