import { exec } from 'child_process'
import type { Choice } from 'prompts'
import prompts from 'prompts'
import { downloadTemplate } from 'giget'
import detectPackageManager from 'which-pm-runs'
import templates from './templates'
import { runCommand } from './utils'

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
  const pkm = detectPackageManager?.name || 'npm'
  // command shorthand
  const add = `${pkm} add`
  const pks = 'npm pkg set'

  await downloadTemplate(`kecrily/create-kecrily/templates/${variant}#master`, {
    provider: 'github',
    dir: projectName,
  })

  if (ifLint) {
    runCommand([
      `${add} eslint @kecrily/eslint-config typescript -D`,
      `${pks} scripts.lint='eslint . --cache'`,
      `${pks} eslintConfig.extends='@kecrily'`,
    ], { cd: projectName })
  }

  if (ifPrivate)
    runCommand([`${pks} private=true`], { cd: projectName })
  else
    runCommand([`${pks} version=0.1.0`], { cd: projectName })

  runCommand([`${pks} name=${projectName}`, `${pks} type=module `], { cd: projectName })

  exec(`git init ${projectName}`)
}
