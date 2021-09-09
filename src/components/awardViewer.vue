<script>
import { mapState } from 'vuex'
import { lock, unlock, clearBodyLocks } from 'tua-body-scroll-lock'

const list = [
  { img: 'https://i0.hdslb.com/bfs/face/89e5af921ec4243a7d57285bc4f11545b63fc149.jpg@160w_160h_1c.webp', rank: '1-100', name: 'l偶极大额啊阿斯顿开了' },
  { img: 'https://i0.hdslb.com/bfs/face/89e5af921ec4243a7d57285bc4f11545b63fc149.jpg@160w_160h_1c.webp', rank: '1-100', name: 'l偶极大额啊阿斯顿开了' },
  { img: 'https://i0.hdslb.com/bfs/face/89e5af921ec4243a7d57285bc4f11545b63fc149.jpg@160w_160h_1c.webp', rank: '1-100', name: 'l偶极大额啊阿斯顿开了' },
  { img: 'https://i0.hdslb.com/bfs/face/89e5af921ec4243a7d57285bc4f11545b63fc149.jpg@160w_160h_1c.webp', rank: '1-100', name: 'l偶极大额啊阿斯顿开了' },
  { img: 'https://i0.hdslb.com/bfs/face/89e5af921ec4243a7d57285bc4f11545b63fc149.jpg@160w_160h_1c.webp', rank: '1-100', name: 'l偶极大额啊阿斯顿开了' },
  { img: 'https://i0.hdslb.com/bfs/face/89e5af921ec4243a7d57285bc4f11545b63fc149.jpg@160w_160h_1c.webp', rank: '1-100', name: 'l偶极大额撒大声阿斯顿啊阿斯顿开了' },
  { img: 'https://i0.hdslb.com/bfs/face/89e5af921ec4243a7d57285bc4f11545b63fc149.jpg@160w_160h_1c.webp', rank: '1-100', name: 'l偶极大额啊阿斯顿开了' },
  { img: 'https://i0.hdslb.com/bfs/face/89e5af921ec4243a7d57285bc4f11545b63fc149.jpg@160w_160h_1c.webp', rank: '1-100', name: 'l偶极大额啊阿斯顿开了' },
]

export default {
  data() {
    return {
      visible: false,
      list
    }
  },

  computed: {
    ...mapState(['userInfo', 'devicesInfo', 'isMGTV', 'isLogin', 'conf'])
  },

  methods: {
    show() {
      this.visible = true

      this.$nextTick(() => {
        lock(document.querySelector('.content-wrapper'))
      })
    },

    close() {
      this.visible = false
      unlock(document.querySelectorAll('.content-wrapper'))
    }
  },

  beforeDestroy() {
    clearBodyLocks()
  }
}
</script>

<template>
  <div v-if="visible" class="award-viewer">
    <div class="mask" @click="close" />

    <div class="content-img-wrapper">
      <div class="content-wrapper">
        <div class="content" />

        <div class="tip-wrapper">
          <div class="tip" />
        </div>

        <div class="rule">
          <div>活动时间：4月29日上午9:00-5月5日下午11:59</div>
          <div>（注意：5月4日23:59之后无法获得火力值，记得5月5日当日领取奖励哟~）</div>
          <div>活动为大家准备了两个奖励！轻轻松松也能领奖哟~</div>
          <div>奖励1：积攒火力值达到排名即可获得奖励！</div>
          <div>奖励2：每日达到累计火力值即可领取宝箱奖励！</div>
          <div>获取火力值方法：</div>
          <div>1.	首次参与马上获得火力值！</div>
          <div>2.	每日完成任务获得火力值！</div>
          <div>3.	邀请好友一起参与获得更多火力值哟~</div>
          <div>注意事项：</div>
          <div>1.芒果TV不会以任何方式向用户索要钱财，请注意甄别信息。</div>
          <div>2.活动期间，如用户存在违反法律、法规或违反包括但不限于芒果TV及其他活动合作平台方规则，包括但不限于作弊、采用不正当技术手段获得奖品等行为，芒果TV将有权取消用户的中奖资格，撤销违规交易，收回奖品。</div>
        </div>
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

.award-viewer {
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
    height: 1200px;
    top: 268px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 26px;
    box-sizing: border-box;
    .bgImage('../assets/award-wrapper.png');


    .content-wrapper {
      margin: 135px 0 0 70px;
      height: 950px;
      width: 510px;
      overflow: scroll;

      .content {
        height: 840px;
        width: 510px;
        .bgImage('../assets/gift-list.png')
      }

      .tip-wrapper {
        display: flex;
        height: 68px;
        align-items: center;
        justify-content: center;
        margin: 20px 0 10px 0;

        .tip {
          height: 68px;
          width: 240px;
          .bgImage('../assets/rule.png');
        }
      }

      .rule {
        width: 625px;
        font-size: 24px;
        color: #606793;
        transform: scale(.8);
        transform-origin: 0 0;
      }
    }
  }
}
</style>
