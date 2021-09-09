<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      visible: false,

      orderId: '',
      form: {
        username: '',
        address: '',
        tel: ''
      }
    }
  },

  computed: {
    ...mapState(['userInfo', 'devicesInfo', 'isMGTV', 'isLogin', 'conf'])
  },

  methods: {
    show(orderId) {
      this.orderId = orderId
      this.visible = true

      return new Promise((resolve, reject) => {
        Object.assign(this, {
          resolve,
          reject
        })
      })
    },

    async comfirm() {
      try {
        await this.validate()
        await this.api.postAddress({
          ...this.form,
          order_id: this.orderId
        })

        this.close()
        this.resolve()
      } catch (error) {
        let msg = error
        if (typeof error === 'object') {
          msg = error.msg
        }
        this.utils.toast(msg, null, true)
      }
    },

    close() {
      this.visible = false
    },

    validate() {
      const { tel } = this.form

      return new Promise((resolve, reject) => {
        if (Object.values(this.form).some(x => x === '')) {
          reject('收件人、手机号、地址不能为空～')
        }

        if (!/^1[23456789]\d{9}$/.test(tel)) {
          reject('您输入的手机号不合法～')
        }

        resolve('')
      })
    }
  }
}
</script>

<template>
  <div v-if="visible" class="address-editor" @touchmove.prevent>
    <div class="mask" @click="close" />

    <div class="content-img-wrapper">
      <div class="content-wrapper">
        <div class="content">
          <div class="form-item">
            <div class="label">收件人:</div>
            <input v-model="form.username" class="inp" type="text" />
          </div>

          <div class="form-item">
            <div class="label">手机号:</div>
            <input v-model="form.tel" class="inp" type="text" />
          </div>

          <div class="form-item">
            <div class="label">详细地址:</div>
            <input v-model="form.address" class="inp"  type="text" />
          </div>
        </div>

        <div class="tip-wrapper">
          <div class="dot" />
          温馨提示
          <div class="dot" />
        </div>

        <div class="tip-text">
          <div>收货信息确认后不可更改，活动结束后一个月内发放奖励</div>
        </div>

        <div class="btn" @click="comfirm" />
      </div>
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
    width: 640px;
    height: 790px;
    top: 268px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 26px;
    box-sizing: border-box;
    .bgImage('../assets/address-wrapper.png');


    .content-wrapper {
      margin: 135px 0 0 70px;
      height: 510px;
      width: 510px;
      overflow: scroll;

      .content {
        .form-item {
          display: flex;
          align-items: center;
          height: 95px;
          padding: 16px 0;

          .label {
            font-size: 32px;
            color: #4862FF;
            font-weight: bold;
            width: 160px;
          }

          .inp {
            height: 63px;
            width: 368px;
            background-color: #c6cffb;
            font-size: 30px;
            color: #3A3A3A;
          }
        }
      }

      .tip-wrapper {
        display: flex;
        height: 28px;
        align-items: center;
        justify-content: center;
        margin: 25px 0 8px;
        font-size: 30px;
        color: #6176F5;

        .dot {
          background-color: #FF8181;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          margin: 0 8px;
        }
      }

      .tip-text {
        position: relative;
        font-size: 24px;
        left: -12%;
        width: 120%;
        color: #6176F5;
        transform: scale(.8);
        margin-top: 24px;
      }

      .btn {
        position: absolute;
        width: 290px;
        height: 80px;
        left: 50%;
        transform: translateX(-50%);
        top: 580px;
      }
    }
  }
}
</style>
