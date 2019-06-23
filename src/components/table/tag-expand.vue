<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="8">
                <span style="margin-left:4px" class="expand-key">硬件版本: </span>
                <span class="expand-value">{{ row.hardwareVersion }}</span>
            </Col>
            <Col span="8">
                <span style="margin-left:4px" class="expand-key">软件版本： </span>
                <span class="expand-value">{{ row.softwareVersion }}</span>
            </Col>
            <Col span="8">
                <span style="margin-left:4px" class="expand-key">总重量： </span>
                <span class="expand-value">{{ row.totalWeight }}</span>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <span style="margin-left:4px" class="expand-key">运行时间： </span>
                <span class="expand-value">{{ row.execTime +' ms' }}</span>
            </Col>
            <Col span="8">
                <span style="margin-left:4px" class="expand-key">完成时间：</span>
                <span class="expand-value">{{ row.completeTime }}</span>
            </Col>
            <Col span="8">
                <span style="margin-left:4px" class="expand-key">电子称电量： </span>
                <span class="expand-value">{{ row.measurePower }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
  name: 'tagExpand',
  props: {
    row: Object
  },
  methods: {
  }
}
</script>
