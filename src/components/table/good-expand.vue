<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="8">
                <span style="margin-left:4px" class="expand-key">导入时间: </span>
                <span class="expand-value">{{ row.importTime }}</span>
            </Col>
            <Col span="8">
                <span style="margin-left:4px" class="expand-key">数量： </span>
                <span class="expand-value">{{ row.computeNumber }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
  name: 'goodExpand',
  props: {
    row: Object
  },
  methods: {
  }
}
</script>
