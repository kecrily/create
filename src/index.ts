import { exec } from 'node:child_process'
import { resolve } from 'node:path'
import enquirer from 'enquirer'
import { downloadTemplate } from 'giget'
import { readPackageJSON, writePackageJSON } from 'pkg-types'
import { npmLatestVersion } from './utils'
import { templates } from './templates'
import type { variant } from './templates'

async function whichTemplate() {
  const { usage } = await enquirer.prompt<{ usage: variant[] }>({
    name: 'usage',
    type: 'select',
    message: 'What do you wan to do:',
    choices: templates.map(({ display, variants }) => {
      return { name: variants, message: display }
    }),
  })

  const { template } = await enquirer.prompt<{ template: string }>({
    name: 'template',
    type: 'select',
    message: 'Select a variant:',
    choices: usage.map(({ display, name }) => {
      return { name, message: display }
    }),
  })

  return template
}

export default async function() {
  const template = await whichTemplate()

  const { projectName, ifLint, isPrivate } = await enquirer.prompt < {
    projectName: string
    ifLint: boolean
    isPrivate: boolean
  }>([
    {
      name: 'projectName',
      type: 'text',
      message: 'Your project name?',
    },
    {
      name: 'ifLint',
      type: 'confirm',
      message: 'Do you want to use ESLint and @kecrily/eslint-config?',
      initial: true,
    },
    {
      name: 'isPrivate',
      type: 'confirm',
      message: 'Is this a private package?',
      initial: true,
    },
  ])

  await downloadTemplate(`kecrily/create-kecrily/templates/${template}#master`, {
    provider: 'github',
    dir: projectName,
  })

  const pkgPath = resolve(process.cwd(), projectName)
  let pkg = await readPackageJSON(pkgPath)

  if (ifLint) {
    const dev = ['eslint', '@kecrily/eslint-config', 'typescript']
    pkg.scripts.lint = 'eslint . --cache'
    pkg.eslintConfig = { extends: '@kecrily' }

    for (const d of dev)
      pkg.devDependencies[d] = `^${await npmLatestVersion(d)}`
  }

  if (isPrivate)
    pkg = { private: true, ...pkg }
  else
    pkg = { version: '0.1.0', ...pkg }

  pkg = {
    name: projectName,
    type: 'module',
    ...pkg,
  }

  writePackageJSON(resolve(pkgPath, 'package.json'), pkg)

  exec(`git init ${projectName}`)
}
