<template>
  <div
    class="loading-wrapper"
    v-if="loading"
    @touchmove.prevent
  >
    <div class="loading-box">
      <div class="loading-main"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
    }
  },

  methods: {
    start() {
      this.loading = true
    },

    finish() {
      this.loading = false
    }
  },
}
</script>
<style lang="less" scoped>
.loading-wrapper {
  background-color: #f5f5f5;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
}

.is-small.loading-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.is-transparent.loading-wrapper {
  background-color: transparent;
}

.is-transparent .loading-main {
  border-left-color: transparent;
}

.is-small .loading-box {
  background-color: rgba(51, 51, 51, 0.56);
}

.loading-box {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  background-color: #000;
  opacity: .5;
  border-radius: 8px;
}

.loading-main,
.loading-main:after {
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.loading-main {
  margin: 0 auto;
  position: relative;
  border: 3px solid;
  /* border-top-color: #FEBF28;
        border-right-color: #FEBF28;
        border-bottom-color: #FEBF28; */
  border-top-color: #aaa;
  border-right-color: #aaa;
  border-bottom-color: #aaa;
  border-left-color: #ffffff;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 0.6s infinite linear;
  animation: load8 0.6s infinite linear;
}

@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
