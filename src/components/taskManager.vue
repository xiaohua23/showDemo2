<script>
import { mapState } from 'vuex'
import services from '@/service/services.js'

const STATUS = {
  Undone: 0, // 未完成
  Unaccalimed: 1, // 完成未领取
  Done: 2 // 已完成
}

const STATUS_IMG = {
  [STATUS.Undone]: require('../assets/undone.png'),
  [STATUS.Done]: require('../assets/done.png'),
}

export default {
  data() {
    return {
      STATUS_IMG,

      visible: false,
      taskList: []
    }
  },

  computed: {
    ...mapState(['userInfo', 'devicesInfo', 'isMGTV', 'isLogin', 'conf'])
  },

  methods: {
    show() {
      this.visible = true

      this.getTaskList(7294)
    },

    close() {
      this.visible = false
    },

    async getTaskList(id) {
      try {
        const res = await services.getTaskList(id)

        this.taskList = res.data.slice(0, 5)
      } catch (error) {
        console.error(error)
      }
    },

    // 点击任务列表
    handleClick(item, index) {
      const { status } = item

      if (status == STATUS.Done) {
        return
      }

      if (index === 0) {
        this.close()

        const [pre, queryString] = location.href.split('?')
        this.utils.jumpPage(pre + 'emotion?' + queryString)
      }

      if (index === 1 || index === 3) {
        MgtvApi.showShare()
      }

      if (index === 2) {
        this.close()
        this.$emit('watch')
      }
    }
  }
}
</script>

<template>
  <div v-if="visible" class="task-manager" @touchmove.prevent>
    <div class="mask" @click="close" />

    <div class="content-img-wrapper">
      <div class="content-wrapper">
        <div class="content">
          <div
            v-for="(item, index) in taskList"
            :key="item.task_id"
            class="task-item"
            @click.stop="handleClick(item, index)"
          >
            <div class="process" v-if="item.left_times > 0">
              <div class="process-title">({{ item.done_times + '/' + (item.done_times + item.left_times) }})</div>
            </div>
            <div style="flex: 1">
              <div class="title-wrapper">
                <div class="title">{{ item.title }}</div>
                <div class="desc">{{ item.subtitle }}</div>
              </div>
              <div class="limit-wrapper">
                <div class="limit">
                  {{ item.description }}
                </div>
              </div>
            </div>

            <div
              class="status-btn"
              :style="`background-image:url('${STATUS_IMG[item.status]}')`"
            />
          </div>
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

.task-manager {
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
    height: 784px;
    top: 268px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 26px;
    box-sizing: border-box;
    .bgImage('../assets/task-wrapper.png');

    .content-wrapper {
      margin: 130px 0 0 70px;
      width: 510px;
      height: 550px;
    }

    .content {
      .task-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #6EA5FF;
        padding: 16px 0;

        .process {
          position: absolute;
          background-color: #FFE163;
          width: 72px;
          height: 35px;
          border-radius: 35px;
          top: 0;
          right: -50px;
          font-size: 24px;
          text-align: center;
          line-height: 35px;

          .process-title {
            font-size: 24px;
            transform: scale(.8);
            color: #FF6C4A;
          }
        }

        .title-wrapper {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: space-between;
          color: #3B4FEA;
          font-family: HYXiaoBoHuaBaoHeiJ;
          margin: 24px 0 15px;
          height: 26px;

          .title {
            color: #3B4FEA;
            font-size: 22px;
            font-family: HYXiaoBoHuaBaoHeiJ;
            font-weight: bold;
          }

          .desc {
            font-size: 24px;
            margin: 0 20px;
            font-weight: bold;
            color: #FF6C4A;
          }
        }

        .limit-wrapper {
          margin-top: 30px;
          height: 20px;

          .limit {
            height: 20px;
            line-height: 20px;
            color: #707070;
            font-size: 20px;
            transform: scale(.8);
            width: 120%;
            transform-origin: 0;
          }
        }

        .status-btn {
          flex-shrink: 0;
          width: 108px;
          height: 43px;
          line-height: 43px;
          text-align: center;
          background-color: #6EA5FF;
          border-radius: 10px;
          font-weight: bold;
          color: #fff;
          background-size: 100% auto;
          background-repeat: no-repeat;
          background-color: transparent;
        }
      }
    }
  }
}
</style>
