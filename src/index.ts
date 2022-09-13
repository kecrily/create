import { exec } from 'child_process'
import type { Choice } from 'prompts'
import prompts from 'prompts'
import { downloadTemplate } from 'giget'
import detectPackageManager from 'which-pm-runs'
import templates from './templates'

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
    },
  ] as Array<prompts.PromptObject>

  let result: prompts.Answers<'projectName' | 'variant' | 'ifLint'>

  try {
    result = await prompts(questions)
  } catch (cancelled: any) {
    // eslint-disable-next-line no-console
    console.log(cancelled.message)
    return
  }

  await downloadTemplate(`kecrily/create-kecrily/templates/${result.variant}#master`, {
    provider: 'github',
    dir: result.projectName,
  })

  if (result.ifLint) {
    const pkm = detectPackageManager?.name || 'npm'

    exec(`cd ${result.projectName} && ${pkm} add eslint @kecrily/eslint-config typescript -D && npm pkg set scripts.lint='eslint . --cache' && npm pkg set eslintConfig.extends='@kecrily'`)
  }

  exec(`git init ${result.projectName}`)
}
