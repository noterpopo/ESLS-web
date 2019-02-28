<template>
  <div>
    <button @click="isModalShow=true">2333</button>
    <corn-selector  :isShow="isModalShow" @onOk="onCron">选择定时任务</corn-selector>
  </div>
</template>

<script>
import cronSelector from '@/components/corn-selector/corn-selector.vue'
export default {
  data () {
    return {
      isModalShow: false
    }
  },
  components: {
    'corn-selector': cronSelector
  },
  methods: {
    onCron (data) {
      this.$Message.info(data)
    }
  }
}
</script>

<style scoped>

</style>
