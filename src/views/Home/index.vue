<script>
import { mapActions, mapState } from 'vuex'
import { debounce } from 'throttle-debounce'
import CountTo from 'vue-count-to' //数字滚动插件
import Report from '@/utils/report'

import TaksManager from '@/components/taskManager.vue'
import RankViewer from '@/components/rankViewer'
import AddressEditor from '@/components/addressEditor'
import AwardViewer from '@/components/awardViewer'
import GiftViewer from '@/components/giftViewer'
import Floater from '@/components/floater'

import { STATUS, NOTIFY_EVENT, GIFT_RANGE } from './constant'

export default {
  components: {
    TaksManager,
    RankViewer,
    AddressEditor,
    AwardViewer,
    GiftViewer,
    CountTo,
    Floater
  },

  data() {
    return {
      STATUS,

      recommendVideos: [],
      videoList: [],
      currVideoIndex: 0,
      currentVideoId: '',

      player: null,

      playerTimer: null,

      orderId: '',
      isImproveAddress: false, // 是否完善了信息

      boxes: Array(3).fill(), // 宝箱

      dailyScore: {
        pre: 0,
        current: 0
      },
      totalScore: {
        pre: 0,
        current: 0
      },
      currRank: 0,

      showFooter: false,
      status: STATUS.Processing // 活动状态
    }
  },

  computed: {
    ...mapState(['userInfo', 'devicesInfo', 'isMGTV', 'isLogin', 'conf']),

    rankNo() {
      const num = Number(this.currRank)

      if (num > 0 && num <= 500) return num
      if (num > 500 && num <= 700) return '500+'
      if (num > 700 && num <= 1000) return '700+'
      if (num > 1000 && num <= 2000) return '1000+'
      if (num > 2000) return '2000+'

      return '-'
    },

    giftName() {
      const item = GIFT_RANGE.find(x => {
        const [start, end] = x.range

        return (this.currRank >= start) && (this.currRank <= end)
      })

      return item ? item.name : ''
    },

    hasGift() {
      return !!this.orderId
    },

    // 是否可领取
    canReceiveGift() {
      return this.status === STATUS.Over && this.hasGift
    },

    process() {
      const TOTAL = 700
      const STEP_1 = 120
      const STEP_2 = 240
      const STEP_3 = 500
      const current = this.dailyScore.current

      if (current <= STEP_1) return parseInt((current / (STEP_1 + 12)) * 100 / 6)
      if (current <= STEP_2) {
        const diff = current - STEP_1
        return parseInt((
          (1 / 6) +
          (diff / (STEP_2 - STEP_1)) * 2 / 6
        ) * 100)
      }
      if (current <= STEP_3) {
        const diff = current - STEP_2
        return parseInt((
          (3 / 6) +
          (diff / (STEP_3 - STEP_2)) * 2 / 6
          ) * 100)
      }

      const diff = current - STEP_3
      const p = parseInt((
          (5 / 6) +
          (diff / (TOTAL - STEP_3)) * 1 / 6
        ) * 100)

      return p > 100 ? 100 : p
    },

    // 是否活动进行中
    isProcessing() {
      return this.status === STATUS.Processing
    },

    boxTipInfo() {
      if (this.status === STATUS.NotStarted) {
        return { value: 0, text: '活动未开始～'  }
      }
      if (this.status === STATUS.Over) {
        return { value: 0, text: '活动已结束～'  }
      }

      if (this.boxes.every(x => !x)) {
        return null
      }

      if (this.boxes.some(x => x.status == 1)) {
        return { value: 0, text: '可领取宝箱啦！'  }
      }

      if (this.boxes.every(x => x.status == 2)) {
        return { value: 0, text: '活跃宝箱已经全部领取，请明日再来~' }
      }

      const scoreStep = [120, 240, 500]
      const idx = this.boxes.findIndex(x => x.status == 0) // 找到第一个未完成的
      const step = idx < 1 ? 0 : idx

      return {
        value: scoreStep[step] - this.dailyScore.current,
        text: ''
      }
    }
  },

  async mounted() {
    const isNewUser = !window.localStorage.getItem('newUser')
    
  
    this.setShareInfo()

    if (!this.isMGTV) Report.pv()
    if (isNewUser) await this.setGiftViewer()

    // if (!this.isLogin) {
    //   this.jumpLogin()
    //   return
    // }

    this.fetchData()
    this.registerScrollHandler()

    setTimeout(() => {
      MgtvApi.registerhandler('webviewBecomeActive', {}, () => {
        this.getTaskList(7295)
        this.fetchTotalScore()
        this.fetchDailyScore()
      })
    }, 500)
  },

  methods: {
    ...mapActions(['setTarget']),

    initVideo() {
      window.p = this.player = new ZTMobilePlayer({
        wrapper: 'player-container',
        autoplay: false,
        controls: process.env.NODE_ENV === 'development'
      })

      this.currentVideoId = this.videoList[this.currVideoIndex]
      const vid = window.localStorage.getItem('currentVid')
      const vIdx = window.localStorage.getItem('currVideoIdx')

      if (vid) this.currentVideoId = +vid
      if (vIdx) this.currVideoIndex = +vIdx

      console.log('this.currentVideoId', this.currentVideoId)

      this.player.fetchVideoInfo(this.currentVideoId)

      this.player.addListener('PlayStop', this.onPlayStop)
    },

    jumpLogin() {
      this.utils.jumpLogin()
    },

    jump2Emotion() {
      // if (!this.isProcessing) return
      const [pre, queryString] = location.href.split('?')
      const url = pre + 'emotion?' + queryString

      this.jumpPage(url)

      MgStat.send('click', {}, {
        cont: '点击我也要做',
        label: 'btn',
        mod: 'make',
        cntp: 'emoji_actHome',
        addr: url,
        direct :'cntp',
      })
    },

    getMorePower() {
      // if (!this.isProcessing) return

      // if (!this.isLogin) {
      //   this.jumpLogin()
      //   return
      // }

      this.$refs.taskManager.show()
    },

    openRankViewer() {
      // if (!this.isProcessing) return

      // if (!this.isLogin) {
      //   this.jumpLogin()
      //   return
      // }

      this.$refs.rankViewer.show()
    },

    openAwardManager() {
      // if (!this.isProcessing) return

      // if (!this.isLogin) {
      //   this.jumpLogin()
      //   return
      // }

      this.$refs.awardViewer.show()
    },

    onPlayStop() {
      if (!this.isProcessing) return

      console.log('beforeNotify currentVideoId', this.currentVideoId)
      this.api.notify(
        NOTIFY_EVENT.ViewFullVideo,
        undefined,
        this.currentVideoId
      )
        .then( this.handleRosolveTask)
      this.utils.toast('已获得火力值，更多精彩视频等你观看！')

      this.playNextVideo()
    },

    handleClickRecVideo(item) {
      if (!this.isProcessing) return
      if (this.playerTimer) clearTimeout(this.playerTimer)

      window.localStorage.setItem('currentVid', item.id)

      this.currentVideoId = item.id
      this.player.stopVideo()
      this.player.fetchVideoInfo(item.id)
      this.playerTimer = setTimeout(() => {
        this.player.playVideo()
      }, 800)
    },

    handleClickNext() {
      // if (!this.isLogin) {
      //   this.jumpLogin()
      //   return
      // }

      this.playNextVideo()
    },

    playNextVideo() {
      if (!this.isProcessing) return
      if (this.currVideoIndex >= this.videoList.length - 1) {
        this.utils.toast('点击 更多优质视频 可以查看更多资源哦～')
        return
      }
      if (this.playerTimer) clearTimeout(this.playerTimer)

      this.currentVideoId = this.videoList[++this.currVideoIndex]
      window.localStorage.setItem('currentVid', this.currentVideoId)
      window.localStorage.setItem('currVideoIdx', this.currVideoIndex)

      this.player.stopVideo()
      this.player.fetchVideoInfo(this.currentVideoId)
      this.playerTimer = setTimeout(() => {
        this.$forceUpdate()
        this.$nextTick(() => this.player.playVideo)
      }, 800)
    },

    async handleClickAward() {
      try {
        await this.$refs.addressEditor.show(this.orderId)

        this.fetchGiftInfo()
        this.utils.toast('填写收货地址成功！')
      } catch (error) {
        console.log(error)
      }
    },

    handleClickMore() {
      if (!this.isLogin) {
        this.jumpLogin()
        return
      }

      this.jumpPage('imgotv://noahhome')
    },

    jumpPage(url) {
      this.utils.jumpPage(url)
      this.player.pauseVideo()
    },

    handleBoxClick({ status, task_id }) {
      if (!this.isProcessing) return

      if (status !== 1) return

      this.api.requestTaskTake(task_id, 7295)
        .then(() => {
          this.handleRosolveTask()
        })
    },

    handleRosolveTask() {
      this.getTaskList(7295) // 重新获取宝箱状态
      this.fetchTotalScore() // 获取火力值
      this.fetchDailyScore()
    },

    handle2Watch() {
      window.scrollTo({
        top: 250,
        left: 0,
        behavior: 'smooth'
      })
    },

    registerScrollHandler() {
      const hander = debounce(100, false, () => {
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop

        if (scrollTop) {
          this.showFooter = true
        }
      })

      window.addEventListener('scroll', hander.bind(this))
      window.addEventListener('scroll', () => this.showFooter = false)
    },

    async fetchData() {
      await this.api.requestEnterActivity()

      return Promise.all([
        this.fetchActivityInfo(),
        this.getTaskList(7295), // 宝箱状态
        this.fetchTotalScore(),
        this.fetchDailyScore(),
        this.fetchVideoList(),
        this.fetchGiftInfo()
      ])
    },

    async setGiftViewer() {
      
      return this.$refs.giftViewer.show()//没有newUser 显示遮罩层
    },

    async getTaskList(id) {
      try {
        await this.api.notifyScore()
        const res = await this.api.getTaskList(id)

        this.boxes = res.data && res.data.slice(0, 3)
      } catch (error) {
        console.error(error)
      }
    },

    fetchVideoList() {
      return new Promise((resolve, reject) => {
        this.api.getVideoList()
          .then(res => {
            const list = res.data

            this.videoList = list
              .filter(x => x.icon === '')
              .map(x => +x.subtitle)
            this.recommendVideos = list
              .slice(0, 3)
              .filter(x => x.icon === '1')
              .map(x => ({
                id: +x.subtitle,
                img: x.cover
              }))

            this.initVideo()

            resolve()
          })
          .catch(reject)
      })
    },

    fetchTotalScore() {
      return new Promise((resolve, reject) => {
        this.api
          .requestScore()//网络请求
          .then(res => {
            const { rank_num, score } = res.data

            this.totalScore = {
              pre: this.totalScore.current,
              current: score
            }
            this.currRank = rank_num > 0 ? rank_num : '-'
            resolve()
          })
          .catch(reject)
      })
    },

    fetchDailyScore() {
      return new Promise((resolve, reject) => {
        this.api
          .requestScore(true)
          .then(res => {
            this.dailyScore = {
              pre: this.dailyScore.current,
              current: res.data.score
            }
            resolve()
          })
          .catch(reject)
      })
    },

    fetchGiftInfo() {
      return new Promise((resolve, reject) => {
        this.api.requestGift()
          .then(res => {
            const item = res.data[0]
            if (item) {
              this.orderId = item.order_id
              this.isImproveAddress = item.address_status == 1 // 已经填写地址
            }
            resolve()
          })
          .catch(reject)
      })
    },

    fetchActivityInfo() {
      return new Promise((resolve, reject) => {
        this.api.getActivityInfo()
          .then(res => {
            const { status } = res.data

            this.status = status
            resolve()
          })
          .catch(reject)
      })
    },

    //设置分享信息
    async setShareInfo(){
      let myShareId = ""
      if(this.isLogin){
        const res = await this.api.getShareId()
        myShareId = res.data.id
      }

      const uuid = this.$store.state.userInfo.uuid
      const shareInfo = {
        title: '速来！领取你的专属表情包！', // 分享标题
        desc: '生成打工人专用超搞笑表情包，重磅福利等你拿！iPhone11 pro、坚果智能投影仪、七天会员卡各种好礼大放送！', // 分享描述
        shareUrl: `https://app.mgtv.com/emoticon/#/?entrance=usershare&sid=${myShareId}&uuid=${uuid}`, // 分享链接
        shareIcon: 'https://ugc.hitv.com/platform_oss/29DD56D6AB0D45959FA31818457190F8.png', // 分享图片
        miniWX : {
          appid: 'wxbbc6e0adf8944632', //应用的appid
          orginId: 'gh_be6b2bc87f24', //小程序原始ID 一般gh开头
          path: `/pages/common/index?code=34&sid=${myShareId}&uuid=${uuid}`, //小程序路径
          // path: `/pages/common/index?code=54&sid=${myShareId}&uuid=${uuid}`, //小程序路径
          shareIcon:
            'https://ugc.hitv.com/platform_oss/8D4F5593A7714488926BC1303916A7A7.png',
        }
      }
      MgtvApi.callhandler('showShareMenus', shareInfo, null)
      this.utils.setWXShareInfo(shareInfo)
    },

    // 打开分享菜单
    showShare(){
      MgStat.send('click', {}, {
        cont: '点击邀请好友一起玩',
        label: 'btn',
        mod: 'invite',
        cntp:'emoji_actHome',
        addr: location.href,
        direct:'cntp',
      })
      MgtvApi.showShare()
    }
  }
}
</script>

<template>
  <div class="home">
    <div class="title-img-wrapper">
      <div class="firepower">
        火力值:
        <CountTo
          :startVal="totalScore.pre"
          :endVal="totalScore.current"
          :duration="2000"
          class="count-to"
        />
      </div>
      <div class="rank">
        <span @click="openRankViewer">当前排名：<em>{{ rankNo }}</em></span> {{ giftName ? '可获得' : '无奖励～' }} <em>{{ giftName }}</em>
      </div>

      <div class="tip" v-if="boxTipInfo">
        <template v-if="boxTipInfo.value > 0">
          再积累 <em>{{ boxTipInfo.value }}点</em> 火力值就可解锁下一宝箱
        </template>
        <template v-else>
          {{ boxTipInfo.text }}
        </template>
      </div>

      <div class="process-bar">
        <div
          class="process-step"
          :style="`width: ${process}%`"
        />
      </div>

      <div class="box-wrapper">
        <div
          v-for="(item, index) in boxes"
          :key="index"
          class="box-item"
        >
          <div
            :class="{
              box: true,
              'yellow-box': true,
              'yellow-box-open': item && item.status === 1,
              'blue-box-open': item && item.status === 2,
            }"
            @click="handleBoxClick(item)"
          />
          <div
            :class="{
              'process-mark': true,
              'not-arrived': item && item.status === 2
            }"
          />
        </div>
      </div>

      <div v-if="isProcessing" class="more-btn h-btn" @click="getMorePower" />
      <!-- 可以领取礼物且未填写地址 -->
      <div
        v-if="canReceiveGift && !isImproveAddress"
        class="receive-btn h-btn"
        @click="handleClickAward"
      />
      <div v-if="canReceiveGift && isImproveAddress" class="h-btn">您已填写地址～</div>
    </div>

    <div class="video-wrapper">
      <div class="video-title">
        <div class="img" />
      </div>
      <div class="video-content">
        <div class="player-wrapper" id="player-container" />

        <div class="recommend-wrapper">
          <div
            v-for="(item, index) in recommendVideos"
            :key="index"
            class="recommend-item"
            :style="`background-image: url(${item.img})`"
            @click="handleClickRecVideo(item)"
          />
        </div>
      </div>

      <div class="video-btn-wrapper">
        <div class="next-btn video-btn" @click="handleClickNext" />
        <div class="more-resource-btn video-btn" @click="handleClickMore" />
      </div>
    </div>

    <div class="emotion-wrapper">
      <div class="emotion-header" />
      <div class="emotion-tip">定制表情包提升火力值</div>
      <div class="emotion-content"></div>
      <div class="emotion-btn-wrapper">
        <div class="invite-btn emotion-btn" @click="showShare" />
        <div class="do-it-btn emotion-btn" @click="jump2Emotion" />
      </div>
    </div>

    <div class="fixed-award" @click="openAwardManager" />
    <div class="fixed-rank" @click="openRankViewer" />

    <div v-if="isProcessing" :class="{ director: true, show: showFooter }" @click="getMorePower" />

    <TaksManager ref="taskManager" @watch="handle2Watch" />
    <RankViewer ref="rankViewer" />
    <AddressEditor ref="addressEditor" />
    <AwardViewer ref="awardViewer" />
    <GiftViewer ref="giftViewer" />
    <Floater />
  </div>
</template>

<style scoped lang="less">
.bgImage(@imageUrl) {
  background-image: url(@imageUrl);
  background-size: 100%;
  background-repeat: no-repeat;
  background-color: transparent;
}

.home {
  min-height: 100vh;
  .bgImage('../../assets/background.png');

  @keyframes shake {
    0% { transform: rotate(8deg) }
    25% { transform: rotate(0deg) }
    50% { transform: rotate(-8deg) }
    75% { transform: rotate(0deg) }
    100% { transform: rotate(8deg) }
  }

  .title-img-wrapper {
    position: relative;
    height: 715px;
    background: url('../../assets/title-image.png') no-repeat;
    background-size: 100%;

    .firepower {
      position: absolute;
      top: 332px;
      left: 288px;
      height: 31px;
      line-height: 31px;
      font-size: 28px;
      color: #fff;
      font-weight: bold;
      font-family: HYXiaoBoHuaBaoHeiJ;

      .count-to { font-size: 32px; }
    }

    .rank {
      position: absolute;
      top: 366px;
      width: 100%;
      text-align: center;
      font-size: 22px;
      color: #fff;
      transform: scale(0.8);

      em {
        color: #FFF47B;
        font-size: 23px;
        font-weight: bold;
        font-style: normal;
      }
    }

    .tip {
      position: absolute;
      top: 534px;
      width: 100%;
      text-align: center;
      font-size: 22px;
      color: #fff;

      em {
        color: #FFF47B;
        font-size: 23px;
        font-weight: bold;
        font-style: normal;
      }
    }

    .process-bar {
      position: absolute;
      top:506px;
      width: 631px;
      height: 14px;
      border-radius: 14px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #99a7ff;

      .process-step {
        height: 14px;
        border-radius: 14px;
        background-color: #fdf38c;
      }
    }

    .box-wrapper {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: space-around;
      top: 428px;
      width: 632px;
      height: 104px;
      left: 50%;
      transform: translateX(-50%);

      .box-item {
        height: 100px;
        width: 70px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }

      .yellow-box { background: url('../../assets/yellow-box.png'); }
      .yellow-box-open {
        background: url('../../assets/yellow-box-open.png');
        width: 90px !important;
        animation: shake .8s infinite;
      }
      .blue-box-open { background: url('../../assets/blue-box-open.png'); }

      .box {
        height: 60px;
        width: 70px;
        background-repeat: no-repeat;
        background-size: 100% auto;
      }

      .process-mark {
        height: 32px;
        width: 32px;
        border-radius: 50%;
        background-color: #FF6D4B;
        box-sizing: border-box;
        border: 3px solid #FFF47B;
      }

      .not-arrived { background-color: #599BFF; }
    }

    .h-btn {
      position: absolute;
      width: 305px;
      height: 66px;
      top: 586px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 24px;
      line-height: 66px;
      text-align: center;
      color: #ee7b58;
    }

    .more-btn { .bgImage('../../assets/more-btn.png') }

    .receive-btn { .bgImage('../../assets/receive.png') }
  }

  .video-wrapper {
    height: 960px;
    padding-top: 32px;
    box-sizing: border-box;

    .video-title {
      display: flex;
      justify-content: center;
      height: 75px;
      left: 50%;

      .img {
        height: 75px;
        width: 232px;
        left: 50%;
        background: url('../../assets/title.png') no-repeat;
        background-size: 100%;
      }
    }

    .video-content {
      position: relative;
      height: 720px;
      margin-left: 22px;
      background: url('../../assets/video-wrapper.png') no-repeat;
      background-position: center;
      background-size: 99.3% auto;
      padding: 152px 0 0 0 ;

      .player-wrapper {
        height: 378px;
        margin: 0 38px 0 16px;
      }

      .recommend-wrapper {
        height: 112px;
        margin-top: 31px;
        padding: 0 58px 0 35px;
        display: flex;
        justify-content: space-between;

        .recommend-item {
          height: 114px;
          width: 202px;
          border-radius: 7px;
          background-repeat: no-repeat;
          background-size: 100%;
        }
      }
    }

    .video-btn-wrapper {
      display: flex;
      justify-content: space-between;
      height: 78px;
      padding: 0 52px;
      margin-top: 28px;
      box-sizing: border-box;

      .next-btn { background: url('../../assets/next.png') no-repeat; }
      .more-resource-btn { background: url('../../assets/more.png') no-repeat; }
      .video-btn  {
        height: 78px;
        width: 285px;
        background-size: 100%;
      }
    }
  }

  .emotion-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 680px;
    padding: 0 24px;

    .emotion-header {
      width: 496px;
      height: 54px;
      background: url('../../assets/emotion-header.png') no-repeat;
      background-size: 100%;
    }

    .emotion-tip {
      margin-top: 8px;
      font-size: 24px;
      color: #4862FF;
    }

    .emotion-content {
      height: 221px;
      width: 100%;
      background-color: #FF6C4A;
      border-radius: 9px;
      margin-top: 30px;
      .bgImage('https://ugc.hitv.com/platform_oss/A42B1420040C42EDBA2859F6931E0037.png')
    }

    .emotion-btn-wrapper {
      display: flex;
      justify-content: space-between;
      height: 78px;
      width: 100%;
      padding: 0 28px;;
      margin-top: 28px;
      box-sizing: border-box;

      .invite-btn { background: url('../../assets/invite.png') no-repeat; }
      .do-it-btn { background: url('../../assets/do.png') no-repeat; }
      .emotion-btn {
        height: 78px;
        width: 285px;
        background-size: 100%;
      }
    }
  }

  .director {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 0px;
    background: url('../../assets/director.png') no-repeat;
    background-size: 100%;
    transition: all .2s;
    z-index: 999;
  }

  .show {
    height: 148px;
    transition: all .3s;
  }

  .fixed-award {
    position: fixed;
    height: 120px;
    width: 40px;
    top: 370px;
    right: 0;
    z-index: 10;
    .bgImage('../../assets/fixed-award.png');
  }

  .fixed-rank {
    position: fixed;
    z-index: 10;
    height: 130px;
    width: 46px;
    top: 510px;
    right: 0;
    .bgImage('../../assets/fixed-rank.png');
  }
}
</style>
