<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      visible: false
    }
  },

  computed: {
    ...mapState(['userInfo', 'devicesInfo', 'isMGTV', 'isLogin', 'conf'])
  },

  methods: {
    show() {
      this.visible = true

      return new Promise(resolve => {
        this.resolve = resolve
      })
    },

    close() {
      this.visible = false
    },

    handleClick() {
      if (!this.isMGTV) {
        this.utils.callApp()
        return
      }

      if (!this.isLogin) {
        this.utils.jumpLogin()
        return
      }

      window.localStorage.setItem('newUser', this.utils.uuid())

      this.resolve()
      this.close()
    }
  }
}
</script>

<template>
  <div v-if="visible" class="address-editor" @touchmove.prevent>
    <div class="mask" />

    <div class="content-img-wrapper">
      <div class="btn-wrapper" @click="handleClick" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.bgImage(@imageUrl) {
  background-image: url(@imageUrl);
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-color: transparent;
}

.address-editor {
  height: 100vh;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  width: 100%;
  position: fixed;
  z-index: 999;

  .mask {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    opacity: 0.5;
    background-color: #000;
  }

  .content-img-wrapper {
    position: absolute;
    width: 510px;
    height: 600px;
    top: 268px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 26px;
    box-sizing: border-box;
    .bgImage('../assets/gift-wrapper.png');


    .btn-wrapper {
      position: absolute;
      height: 90px;
      width: 360px;
      top: 500px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
