<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">硬件版本: </span>
                <span class="expand-value">{{ row.hardVersion }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">软件版本： </span>
                <span class="expand-value">{{ row.softVersion }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">频率： </span>
                <span class="expand-value">{{ row.frequency }}</span>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <span class="expand-key">公网IP： </span>
                <span class="expand-value">{{ row.outNetIp }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">完成时间：</span>
                <span class="expand-value">{{ row.completeTime }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
  name: 'routerExpand',
  props: {
    row: Object
  }
}
</script>
