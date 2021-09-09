<script>
import { mapState } from 'vuex'

import { chooseImage, compressImage } from '@/utils/tools'
import services from '@/service/services'

import { NOTIFY_EVENT } from '../Home/constant'

export default {
  data() {
    return {
      tempList: [],

      materialId: '',

      mixedPic: '',

      activeIndex: 0,

      isLoading: false
    }
  },

  computed: {
    ...mapState(['isMGTV', 'isLogin']),
  },

  mounted() {
    this.getTempList(),
    this.setShareInfo()
    this.setSid()
  },

  methods: {
    async handleUpload() {
      if (this.isLoading) return

      try {
        const { file } = await chooseImage()

        this.isLoading = true

        console.time()
        console.log('file', file.size)
        const compressedFile = await compressImage(file)
        console.timeEnd()
        console.log('compressedFile', compressedFile.size)

        console.time()
        const res = await this.api.postImg(compressedFile, this.materialId)
        console.timeEnd()

        this.notify()
        this.mixedPic = res.data.image
      } catch (error) {
        console.error(error)
        this.utils.toast('合成失败，请选择其他照片；脸部明显合成效果更佳哦')
      } finally {
        this.isLoading = false
      }
    },

    notify() {
      this.api.notify(
        NOTIFY_EVENT.MakeEmoticon,
        undefined,
        this.materialId
      )
        .then(() => {
          this.utils.toast('恭喜您成功定制了一张打工人表情包！')
        })

      const shareId = this.utils.parseQuery().uuid
      const uid = this.$store.state.userInfo.uuid
      // 不是自己邀请自己
      if (shareId && shareId !== uid) {
        this.api.notify(
          NOTIFY_EVENT.InviteMakeEmoticon,
          shareId,
          uid
        )
          .then(() => { this.hasMade = true })
      }
    },

    selectMaterial(id, index) {
      this.materialId = id
      this.activeIndex = index
    },

    async getTempList() {
      try {
        const res = await services.getTempList()

        this.tempList = res.data.materialInfos
          .slice(0, 6)
          .map(x => ({ ...x, used: false }))
        this.materialId = this.tempList[0].materialId
      } catch (error) {
        console.error(error)
      }
    },

    handleSelect() {
      if (!this.materialId) {
        this.utils.toast('请选择一个表情包样式~')
        return
      }

      if (!this.mixedPic) {
        this.handleUpload()
      }
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
          appId: 'wxbbc6e0adf8944632', //应用的appid
          orginId: 'gh_be6b2bc87f24', //小程序原始ID 一般gh开头
          path: `/pages/common/index?code=34&sid=${myShareId}&uuid=${uuid}`, //小程序路径
          shareIcon:
            'https://ugc.hitv.com/platform_oss/8D4F5593A7714488926BC1303916A7A7.png',
        }
      }
      MgtvApi.callhandler('showShareMenus', shareInfo, null)
      this.utils.setWXShareInfo(shareInfo)
    },

    // 将url的sid保存到vue
    setSid(){
      const sid = this.utils.parseQuery().sid

      if(sid){
        this.setTarget({
          name: 'sid',
          value: sid,
        })
      }
    },

    // 打开分享菜单
    showShare(){
      MgtvApi.showShare()
    }
  }
}
</script>

<template>
  <div class="emotion">
    <div class="emotion-title" />

    <div class="type-selector-wrapper">
      <div
        v-for="(item, index) in tempList"
        :key="item.materialId"
        class="item-wrapper"
        @click="selectMaterial(item.materialId, index)"
      >
        <div class="item">
          <img :src="item.imageUrl" class="img" />
        </div>
        <div class="select-icon" v-if="activeIndex === index" />
        <div class="decorator" />
      </div>
    </div>

    <div class="emotion-tip" />

    <div class="self-img-wrapper" @click="handleSelect">
      <div class="spinner-wapper" v-if="isLoading">
        <div class="spinner" />
      </div>
      <img v-if="mixedPic" :src="mixedPic" class="mixed-pic" />
    </div>

    <div class="save-image-tip"></div>

    <template v-if="mixedPic">
      <div class="emotion-share btn" @click="showShare" />
      <div class="upload-btn btn" @click="handleUpload" />
    </template>
  </div>
</template>

<style lang="less" scoped>
.bgImage(@imageUrl) {
  background-image: url(@imageUrl);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-color: transparent;
}

.emotion {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  .bgImage('../../assets/upload-bgi.png');

  .emotion-title {
    width: 432px;
    height: 64px;
    margin-top: 50px;
    .bgImage('../../assets/emotion-title.png');
  }

  .type-selector-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 14px;
    margin-top: 36px;

    .item-wrapper {
      position: relative;
      flex-basis: 33.3%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 21px;

      :nth-child(3n+1) {
        justify-content: flex-start;
      }

      .item {
        width: 224px;
        height: 154px;
        padding: 18px 12px 8px 12px;
        .bgImage('../../assets/emotion-type.png');

        .img {
          width: 200px;
          height: 128px;
          object-fit: cover;
        }
      }

      .select-icon {
        position: absolute;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        right: -10px;
        top: 0;
        .bgImage('../../assets/select-icon.png')
      }

      .decorator {
        position: absolute;
        width: 43px;
        height: 28px;
        bottom: -4px;
        right: -4px;
        .bgImage('../../assets/niddle.png')
      }
    }
  }

  .emotion-tip {
    margin: 55px 0 28px;
    width: 400px;
    height: 30px;
    .bgImage('../../assets/emotion-tip.png')
  }

  .self-img-wrapper {
    position: relative;
    height: 520px;
    width: 680px;
    padding: 4px;
    background: #fff;
    .bgImage('../../assets/upload-click.png');

    .spinner-wapper {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      opacity: .5;

      .spinner {
        height: 48px;
        width: 48px;
        border: 5px solid rgba(150, 150, 150, 0.2);
        border-radius: 50%;
        border-top-color: rgb(150, 150, 150);
        animation: rotate 1s infinite ease-in-out;
      }
    }

    .mixed-pic {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .save-image-tip {
    width: 280px;
    height: 36px;
    margin-top: 10px;
    .bgImage('../../assets/save-image-tip.png')
  }

  .btn {
    width: 500px;
    height: 75px;
  }

  .emotion-share {
    margin: 50px 0 40px;
    .bgImage('../../assets/emotion-share.png')
  }

  .upload-btn {
    margin-bottom: 87px;
    .bgImage('../../assets/upload.png')
  }

  @keyframes rotate {
    0%   { transform: rotate(0);      }
    100% { transform: rotate(360deg); }
  }
}
</style>
