import { exec } from 'node:child_process'

export function runCommand(cmds: string[], options?: { cd?: string }) {
  if (options.cd)
    cmds.unshift(`cd ${options.cd}`)
  return exec(cmds.join('&&'))
}
