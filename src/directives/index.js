import permission from './permission'
import loading from './loading'
import tooltip from './tooltip'
import clickOutside from './clickOutside'
import autoAnimate from './autoAnimate'
import focus from './focus'

export default {
  install(app) {
    app.directive('permission', permission)
    app.directive('loading', loading)
    app.directive('tooltip', tooltip)
    app.directive('click-outside', clickOutside)
    app.directive('auto-animate', autoAnimate)
    app.directive('focus', focus)
  }
}