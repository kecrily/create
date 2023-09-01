import { exec } from 'node:child_process'
import { resolve } from 'node:path'
import { writeFile } from 'node:fs/promises'

import { cancel, confirm, group, select, text } from '@clack/prompts'
import { downloadTemplate } from 'giget'
import { readPackageJSON, writePackageJSON } from 'pkg-types'

import { commandResult, getLicense, npmLatestVersion } from './utils'

export default async function() {
  const pkgManager = process.env.npm_config_user_agent?.split('/')[0]

  const { template, projectName, isPrivate, license, lint } = await group({
    template: () => select({
      message: 'What do you wan to do:',
      initialValue: 'ts',
      options: [
        { label: 'TypeScript', value: 'ts' },
        { label: 'Vue Website', value: 'vue' },
        { label: 'Vue Component', value: 'vue-com' }
      ]
    }),
    projectName: () => text({
      message: 'Your project name?',
      defaultValue: 'new-project',
      placeholder: 'new-project'
    }),
    isPrivate: () => confirm({
      message: 'Is this a private package',
      initialValue: true
    }),
    license: async({ results: { isPrivate } }) => {
      if (!isPrivate) {
        return select({
          message: 'Which license do you want to use?',
          initialValue: 'mit',
          options: (await getLicense()).map(({ name, key }) => {
            return { label: name, value: key }
          })
        })
      }
    },
    lint: () => confirm({
      message: 'Do you want to use ESLint and @kecrily/eslint-config?',
      initialValue: true
    })
  }, { onCancel: () => { cancel('Cancelled'); process.exit(0) } })

  await downloadTemplate(`kecrily/create/templates/${template}#master`, {
    provider: 'github', dir: projectName
  })

  const pkgPath = resolve(process.cwd(), projectName)
  const name = commandResult('git config --get user.name')
  const email = commandResult('git config --get user.email')

  let pkg = await readPackageJSON(pkgPath)

  if (isPrivate) {
    pkg = { private: true, ...pkg }
  } else {
    pkg = { version: '0.1.0', ...pkg }

    const { spdx_id, body } = await(await fetch(`https://api.github.com/licenses/${license}`)).json()
    pkg.license = spdx_id
    writeFile(`${pkgPath}/LICENSE`, body
      .replace('[fullname]', name)
      .replace('[year]', new Date().getFullYear())
    )
  }

  if (lint) {
    const dev = ['eslint', '@kecrily/eslint-config', 'typescript']
    pkg.scripts.lint = 'eslint . --cache'
    pkg.eslintConfig = { extends: '@kecrily' }

    for (const d of dev)
      pkg.devDependencies[d] = `^${await npmLatestVersion(d)}`

    exec(`cd ${pkgPath} && ${pkgManager} install && ${pkgManager} run lint --fix`)
  }

  pkg = {
    name: projectName,
    type: 'module',
    author: `${name} <${email}>`,
    ...pkg
  }

  writePackageJSON(resolve(pkgPath, 'package.json'), pkg)

  exec(`git init ${projectName}`)
}
