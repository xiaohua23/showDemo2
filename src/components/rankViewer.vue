<script>
import { mapState } from 'vuex'
import { lock, unlock, clearBodyLocks } from 'tua-body-scroll-lock'

export default {
  data() {
    return {
      visible: false,

      list: [],

      rankNum: -1,
      score: ''
    }
  },

  computed: {
    ...mapState(['userInfo', 'devicesInfo', 'isMGTV', 'isLogin', 'conf']),

    rankNo() {
      const num = Number(this.rankNum)

      if (num > 0 && num <= 500) return num
      if (num > 500 && num <= 700) return '500+'
      if (num > 700 && num <= 1000) return '700+'
      if (num > 1000) return '1000+'

      return ''
    }
  },

  beforeDestroy() {
    clearBodyLocks()
  },

  methods: {
    show() {
      this.visible = true

      this.fetchRankList()
      this.fetchDailyScore()

      this.$nextTick(() => {
        lock(document.querySelector('.content-wrapper'))
      })
    },

    close() {
      this.visible = false

      unlock(document.querySelector('.content-wrapper'))
    },

    async fetchRankList() {
      try {
        const res = await this.api.requestRankList()

        const list = res.data.content || []
        this.list = list.slice(0, 50)
      } catch (error) {
        console.error(error)
      }
    },

    fetchDailyScore() {
      this.api
        .requestScore()
        .then(res => {
          const { rank_num, score } = res.data

          this.rankNum = rank_num
          this.score = score
        })
        .catch(err => {
          console.error(err)
        })
    },
  }
}
</script>

<template>
  <div v-if="visible" class="rank-viewer">
    <div class="mask" @click="close" />

    <div class="content-img-wrapper">
      <div class="content-wrapper">
        <div class="content">
          <div
            v-for="(item, index) in list"
            :key="index"
            class="rank-item"
          >
            <div class="no">
              No.
              <em>{{ index + 1 }}</em>
            </div>
            <div class="name">{{ item.nickname }}</div>
            <div class="rank-num">
              <div class="hot" />
              {{ item.devote_score }}
            </div>
          </div>
        </div>
      </div>

      <div class="my-rank-wrapper">
        <div class="rank-no">我的排名: {{ rankNo }}</div>
        <div class="rank-num" v-if="score">
          <div class="hot" />
          {{ score }}
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

.rank-viewer {
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
    height: 860px;
    top: 268px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 26px;
    box-sizing: border-box;
    .bgImage('../assets/rank-wrapper.png');

    .content-wrapper {
      margin: 130px 0 0 70px;
      height: 510px;
      width: 510px;
      overflow: scroll;
    }

    .content {
      .rank-item {
        height: 56px;
        display: flex;
        align-items: center;

        .no {
          display: flex;
          align-items: baseline;
          font-size: 10px;
          margin-right: 27px;
          color: #4862FF;

          em {
            font-style: normal;
            font-size: 30px;
          }
        }

        .name {
          font-size: 26px;
          color: #424242;
          width: 210px;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }
      }
    }

    .rank-num {
      margin-left: auto;
      display: flex;
      align-items: center;
      font-size: 30px;
      color: #FF6C4A;

      .hot {
        height: 32px;
        width: 25px;
        margin-right: 14px;
        .bgImage('../assets/hot.png')
      }
    }

    .my-rank-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      width: 510px;
      margin: 26px 0 0 70px;

      .rank-no {
        font-size: 36px;
        color: #4862FF;
        font-weight: bold;
      }
    }
  }
}
</style>
