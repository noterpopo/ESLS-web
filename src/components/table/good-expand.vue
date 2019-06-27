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
                <span style="margin-left:4px" class="expand-key">重量规格： </span>
                <span class="expand-value">{{ row.weightSpec }}</span>
            </Col>
            <Col span="8">
                <span style="margin-left:4px" class="expand-key">总件数： </span>
                <span class="expand-value">{{ row.computeNumber }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="8">
                <span style="margin-left:4px" class="expand-key">预警门限: </span>
                <span class="expand-value">{{ row.replenishNumber }}</span>
            </Col>
            <Col span="8">
                <span style="margin-left:4px" class="expand-key">是否点计件: </span>
                <span class="expand-value">{{ row.isComputeOpen==null?0:row.isComputeOpen }}</span>
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
