<script>
export default {
  methods: {
    handleClick() {
      this.utils.jumpPage('https://d.mgtv.com/eys7e')
    }
  }
}
</script>

<template>
  <div class="floater" @click="handleClick" />
</template>

<style lang="less" scoped>
.floater {
  position: fixed;
  z-index: 10;
  height: 90px;
  width: 90px;
  right: 12px;
  bottom: 200px;
  background-image: url('../assets/floater.jpeg');
  background-size: 100%;
  background-repeat: no-repeat;
  background-color: transparent;
}
</style>
