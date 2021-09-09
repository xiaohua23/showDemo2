import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    devicesInfo: {},
    isMGTV: false,
    isLogin: false,
    sid: 0,
    conf: {},
  },
  mutations: {
    setUserInfo(state, newUserInfo) {
      state.userInfo = newUserInfo
    },
    setDevicesInfo(state, newDevicesInfo) {
      state.devicesInfo = newDevicesInfo
    },
    setIsMGTV(state, currentIsMGTV) {
      state.isMGTV = currentIsMGTV
    },
    setIsLogin(state, newisLogin) {
      state.isLogin = newisLogin
    },
    setConf(state, newConf) {
      state.conf = newConf
    },
    setTarget(state, info) {
      state[info.name] = info.value
    },
  },
  actions: {},
  modules: {},
})
