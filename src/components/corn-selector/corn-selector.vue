<template>
    <div class="container">
        <Button :style="{margin:'10px'}" type="primary" @click="isShow=true">选择定时任务</Button>
        <Modal v-model="isShow" :mask-closable="false">
            <Tabs :animated="false">
                <TabPane label="秒">
                    <RadioGroup vertical v-model="second.radioSelected" class="radio-group">
                        <Radio label="everySec" class="radio">
                            每一秒钟
                        </Radio>
                        <Radio label="fromXstepYSec" class="radio">
                            每隔
                            <InputNumber :max="60" :min="1" v-model="second.step"></InputNumber>
                            秒执行 从
                            <InputNumber :max="59" :min="0" v-model="second.from"></InputNumber>
                            秒开始
                        </Radio>
                        <Radio label="selectedSec" class="radio">
                            具体秒数（可多选）
                            <Select v-model="second.selectedData" multiple transfer @click.native="(event)=>{event.preventDefault()}">
                                <Option v-for="n in 60" :value="n" :key="n">{{ n-1 }}</Option>
                            </Select>
                        </Radio>
                        <Radio label="fromXtoYSec" class="radio">
                            周期从
                            <InputNumber :max="60" :min="1" v-model="second.start"></InputNumber>
                            到
                            <InputNumber :max="59" :min="0" v-model="second.end"></InputNumber>
                            秒
                        </Radio>
                    </RadioGroup>
                </TabPane>
                <TabPane label="分">
                    <RadioGroup vertical v-model="minute.radioSelected" class="radio-group">
                        <Radio label="everyMin" class="radio">
                            每一分钟
                        </Radio>
                        <Radio label="fromXstepYMin" class="radio">
                            每隔
                            <InputNumber :max="60" :min="1" v-model="minute.step"></InputNumber>
                            分执行 从
                            <InputNumber :max="59" :min="0" v-model="minute.from"></InputNumber>
                            分开始
                        </Radio>
                        <Radio label="selectedMin" class="radio">
                            具体分钟数（可多选）
                            <Select v-model="minute.selectedData" multiple transfer @click.native="(event)=>{event.preventDefault()}">
                                <Option v-for="n in 60" :value="n" :key="n">{{ n-1 }}</Option>
                            </Select>
                        </Radio>
                        <Radio label="fromXtoYMin" class="radio">
                            周期从
                            <InputNumber :max="60" :min="1" v-model="minute.start"></InputNumber>
                            到
                            <InputNumber :max="59" :min="0" v-model="minute.end"></InputNumber>
                            分
                        </Radio>
                    </RadioGroup>
                </TabPane>
                <TabPane label="时">
                    <RadioGroup vertical v-model="hour.radioSelected" class="radio-group">
                        <Radio label="everyHour" class="radio">
                            每一小时
                        </Radio>
                        <Radio label="fromXstepYHour" class="radio">
                            每隔
                            <InputNumber :max="24" :min="1" v-model="hour.step"></InputNumber>
                            小时执行 从
                            <InputNumber :max="23" :min="0" v-model="hour.from"></InputNumber>
                            小时开始
                        </Radio>
                        <Radio label="selectedHour" class="radio">
                            具体小时数（可多选）
                            <Select v-model="hour.selectedData" multiple transfer @click.native="(event)=>{event.preventDefault()}">
                                <Option v-for="n in 24" :value="n" :key="n">{{ n-1 }}</Option>
                            </Select>
                        </Radio>
                        <Radio label="fromXtoYHour" class="radio">
                            周期从
                            <InputNumber :max="24" :min="1" v-model="hour.start"></InputNumber>
                            到
                            <InputNumber :max="23" :min="0" v-model="hour.end"></InputNumber>
                            小时
                        </Radio>
                    </RadioGroup>
                </TabPane>
                <TabPane label="日">
                    <RadioGroup vertical v-model="day.radioSelected" class="radio-group">
                        <Radio label="everyDay" class="radio">
                            每一天
                        </Radio>
                        <Radio label="fromXstepYWeek" class="radio">
                            每隔
                            <InputNumber :max="7" :min="1" v-model="day.stepWeek"></InputNumber>
                            周执行 从
                            <Select v-model="day.fromWeek" :style="{width:'240px'}" transfer @click.native="(event)=>{event.preventDefault()}">
                                <Option :value="0" >星期天</Option>
                                <Option :value="1" >星期一</Option>
                                <Option :value="2" >星期二</Option>
                                <Option :value="3" >星期三</Option>
                                <Option :value="4" >星期四</Option>
                                <Option :value="5" >星期五</Option>
                                <Option :value="6" >星期六</Option>
                            </Select>
                            开始
                        </Radio>
                        <Radio label="fromXstepYDay" class="radio">
                            每隔
                            <InputNumber :max="31" :min="1" v-model="day.stepDay"></InputNumber>
                            天执行 从
                            <InputNumber :max="31" :min="1" v-model="day.fromDay"></InputNumber>
                            天开始
                        </Radio>
                        <Radio label="selectedWeek" class="radio">
                            具体星期几（可多选）
                            <Select v-model="day.selectedDataWeek" multiple transfer @click.native="(event)=>{event.preventDefault()}">
                                <Option :value="0" >星期天</Option>
                                <Option :value="1" >星期一</Option>
                                <Option :value="2" >星期二</Option>
                                <Option :value="3" >星期三</Option>
                                <Option :value="4" >星期四</Option>
                                <Option :value="5" >星期五</Option>
                                <Option :value="6" >星期六</Option>
                            </Select>
                        </Radio>
                        <Radio label="selectedDay" class="radio">
                            具体天数（可多选）
                            <Select v-model="day.selectedDataDay" multiple transfer @click.native="(event)=>{event.preventDefault()}">
                                <Option v-for="n in 31" :value="n" :key="n">{{ n }}</Option>
                            </Select>
                        </Radio>
                        <Radio label="lastDay" class="radio">
                            在每月最后一天
                        </Radio>
                        <Radio label="lastWorkDay" class="radio">
                            在每月最后一个工作日
                        </Radio>
                        <Radio label="lastWeek" class="radio">
                            在每月最后一个
                            <Select v-model="day.lastWeek" transfer @click.native="(event)=>{event.preventDefault()}">
                                <Option :value="0" >星期天</Option>
                                <Option :value="1" >星期一</Option>
                                <Option :value="2" >星期二</Option>
                                <Option :value="3" >星期三</Option>
                                <Option :value="4" >星期四</Option>
                                <Option :value="5" >星期五</Option>
                                <Option :value="6" >星期六</Option>
                            </Select>
                        </Radio>
                        <Radio label="dayToLast" class="radio">
                            在每个月月底前
                            <InputNumber :max="31" :min="1" v-model="day.lastDay"></InputNumber>
                            天
                        </Radio>
                        <Radio label="dayToWork" class="radio">
                            离每月
                            <InputNumber :max="31" :min="1" v-model="day.nearWorkFrom"></InputNumber>
                            号最近的工作日（周一到周五）
                        </Radio>
                        <Radio label="weekToMonth" class="radio">
                            在每个月第
                            <InputNumber :max="5" :min="1" v-model="day.orderedWeek"></InputNumber>
                            个
                             <Select v-model="day.dayOfWeek" :style="{width:'240px'}" transfer @click.native="(event)=>{event.preventDefault()}">
                                <Option :value="0" >星期天</Option>
                                <Option :value="1" >星期一</Option>
                                <Option :value="2" >星期二</Option>
                                <Option :value="3" >星期三</Option>
                                <Option :value="4" >星期四</Option>
                                <Option :value="5" >星期五</Option>
                                <Option :value="6" >星期六</Option>
                            </Select>
                        </Radio>
                    </RadioGroup>
                </TabPane>
                <TabPane label="月">
                    <RadioGroup vertical v-model="month.radioSelected" class="radio-group">
                        <Radio label="everyMonth" class="radio">
                            每一月
                        </Radio>
                        <Radio label="fromXstepYMon" class="radio">
                            每隔
                            <InputNumber :max="12" :min="1" v-model="month.step"></InputNumber>
                            月执行 从
                            <InputNumber :max="12" :min="0" v-model="month.from"></InputNumber>
                            月开始
                        </Radio>
                        <Radio label="selectedMon" class="radio">
                            具体月数（可多选）
                            <Select v-model="month.selectedData" multiple transfer @click.native="(event)=>{event.preventDefault()}">
                                <Option v-for="n in 12" :value="n" :key="n">{{ n }}</Option>
                            </Select>
                        </Radio>
                        <Radio label="fromXtoYMon" class="radio">
                            周期从
                            <InputNumber :max="12" :min="1" v-model="month.start"></InputNumber>
                            到
                            <InputNumber :max="12" :min="1" v-model="month.end"></InputNumber>
                            月
                        </Radio>
                    </RadioGroup>
                </TabPane>
                <TabPane label="年">
                    <RadioGroup vertical v-model="year.radioSelected" class="radio-group">
                        <Radio label="everyYear" class="radio">
                            每一年
                        </Radio>
                        <Radio label="fromXstepYYear" class="radio">
                            每隔
                            <InputNumber :min="1" v-model="year.step"></InputNumber>
                            年执行 从
                            <InputNumber :min="2019" v-model="year.from"></InputNumber>
                            年开始
                        </Radio>
                        <Radio label="selectedYear" class="radio">
                            具体年份（可多选）
                            <Select v-model="year.selectedData" multiple transfer @click.native="(event)=>{event.preventDefault()}">
                                <Option v-for="n in 20" :value="n" :key="n">{{ 2018+n }}</Option>
                            </Select>
                        </Radio>
                        <Radio label="fromXtoYYear" class="radio">
                            周期从
                            <InputNumber :min="2019" v-model="year.start"></InputNumber>
                            到
                            <InputNumber :min="2019" v-model="year.end"></InputNumber>
                            年
                        </Radio>
                    </RadioGroup>
                </TabPane>
            </Tabs>
        </Modal>
    </div>
</template>
<script>
export default {
  name: 'cron-selector',
  data () {
    return {
      isShow: false,
      second: {
        radioSelected: 'everySec',
        from: 1,
        step: 1,
        selectedData: [],
        start: 1,
        end: 1

      },
      minute: {
        radioSelected: 'everyMin',
        from: 1,
        step: 1,
        selectedData: [],
        start: 1,
        end: 1

      },
      hour: {
        radioSelected: 'everyHour',
        from: 1,
        step: 1,
        selectedData: [],
        start: 1,
        end: 1

      },
      day: {
        radioSelected: 'everyDay',
        stepWeek: 1,
        fromWeek: '',
        fromDay: 1,
        stepDay: 1,
        selectedDataWeek: [],
        selectedDataDay: [],
        lastWeek: '',
        lastDay: 1,
        nearWorkFrom: 1,
        orderedWeek: 1,
        dayOfWeek: ''
      },
      month: {
        radioSelected: 'everyMonth',
        from: 1,
        step: 1,
        selectedData: [],
        start: 1,
        end: 1
      },
      year: {
        radioSelected: 'everyYear',
        from: 2019,
        step: 1,
        selectedData: [],
        start: 2019,
        end: 2019
      }
    }
  },
  methods: {

  }
}
</script>
<style scoped>
.radio-group{
    width: auto;
    height: 100%;
}
.radio{
    margin-bottom: 4px;
    height: 34px;
}
</style>
