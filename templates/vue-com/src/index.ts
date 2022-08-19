import type { App, Component } from 'vue'
import type { ComponentResolver } from 'unplugin-vue-components'
import * as components from './components'

function install(app: App) {
  Object.entries(components).forEach(([key, value]: [string, Component]) => {
    app.component(key, value)
  })
}

function MyResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith('My'))
        return { name, from: 'my' }
    },
  }
}

export default { install }
export { MyResolver }
export * from './components'
