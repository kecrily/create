import { exec } from 'node:child_process'
import { resolve } from 'node:path'
import type { Choice } from 'prompts'
import prompts from 'prompts'
import { downloadTemplate } from 'giget'
import { readPackageJSON, writePackageJSON } from 'pkg-types'
import templates from './templates'
import { npmLatestVersion } from './utils'

export default async function() {
  const questions = [
    {
      name: 'usage',
      type: 'select',
      message: 'What do you wan to do:',
      choices: templates.map((t) => { return { title: t.display, value: t.variants } as Choice }),
    },
    {
      name: 'variant',
      type: 'select',
      message: 'Select a variant:',
      choices: usage => usage.map((v) => { return { title: v.display, value: v.name } as Choice }),
    },
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
      name: 'ifPrivate',
      type: 'confirm',
      message: 'Is this a private package?',
      initial: true,
    },
  ] as Array<prompts.PromptObject>

  const { projectName, variant, ifLint, ifPrivate } = await prompts(questions)

  await downloadTemplate(`kecrily/create-kecrily/templates/${variant}#master`, {
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
      pkg.devDependencies[d] = await npmLatestVersion(d)
  }

  if (ifPrivate)
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
