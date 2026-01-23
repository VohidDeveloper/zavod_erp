import axiosPlugin from './axios'
import toastPlugin from './toast'
import chartjsPlugin from './chartjs'
import notificationPlugin from './notification'

export default {
  install(app) {
    app.use(axiosPlugin)
    app.use(toastPlugin)
    app.use(chartjsPlugin)
    app.use(notificationPlugin)
  }
}

export {
  axiosPlugin,
  toastPlugin,
  chartjsPlugin,
  notificationPlugin
}