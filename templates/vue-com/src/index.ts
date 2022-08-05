import type { App } from 'vue'
import * as components from './components'

function install(app: App) {
  Object.entries(components).forEach(([key, value]: [string, any]) => {
    app.component(key, value)
  })
}

export default { install }
export * from './components'
