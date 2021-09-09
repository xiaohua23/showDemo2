import Vue from 'vue'
import Utils from '@/utils/utils'
import api from '@/service/services'
import Promise from 'es6-promise'

import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/rem'
import '@/less/reset.less'

Vue.prototype.utils = Utils
Vue.prototype.api = api
Vue.config.productionTip = false
Promise.polyfill()

Sentry.init({
  dsn: 'https://1648adb86cfa44df9532dd80fd1d24d2@sentry.log.mgtv.com/14',
  integrations: [new Integrations.Vue({ Vue, attachProps: true })],
  sampleRate: 0.01,
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
