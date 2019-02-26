<template>
  <div>
    <corn-selector>选择定时任务</corn-selector>
  </div>
</template>

<script>
import cronSelector from '@/components/corn-selector/corn-selector.vue'
export default {
  components: {
    'corn-selector': cronSelector
  }
}
</script>

<style scoped>

</style>
