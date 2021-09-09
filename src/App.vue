<template>
  <div id="app">
    <router-view v-if="isInit" />
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      isInit: false,
    }
  },
  mounted() {
    this.initVconsole()
    this.api.getDeviceAndUserInfo().then(resp => { //main.js给vue的原型上挂载的
      this.setDevicesInfo(resp[0])
      this.setUserInfo(resp[1])
      if (resp[1].uuid && resp[1].ticket) {
        this.setIsLogin(true)
      }
      this.setIsMGTV(this.utils.isMGTV())
      this.getConf()
      this.isInit = true
    })
  },
  methods: {
    //获取页面aid
    async getConf() {
      try {
        let confRes = await this.api.getConf()
        if (confRes.data) {
          this.setConf(confRes.data.items)
        }
      } catch (err) {
        console.log(err)
      }
    },
    initVconsole() {
      if (location.href.indexOf('debug') > -1) {
        let script = document.createElement('script')
        script.src = 'https://cdn.bootcss.com/eruda/1.5.4/eruda.min.js'
        document.body.appendChild(script)
        script.onload = () => {
          eruda.init()
        }
      }
    },
    ...mapMutations([
      'setUserInfo',
      'setDevicesInfo',
      'setIsMGTV',
      'setIsLogin',
      'setConf',
    ]),
  },
  computed: mapState(['userInfo', 'devicesInfo', 'isMGTV', 'isLogin', 'conf']),
}
</script>
<style></style>
