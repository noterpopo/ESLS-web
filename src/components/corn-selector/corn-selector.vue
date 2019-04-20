<template>
    <div class="container">
        <Modal v-model="isShow" :mask-closable="false" draggable title="定时任务设置" @on-ok="onOk">
            <Tabs :animated="false">
                <TabPane label="秒">
                    <RadioGroup vertical v-model="second.radioSelected" class="radio-group" @on-change="onSecSelctChange">
                        <Radio label="everySec" class="radio">
                            每一秒钟
                        </Radio>
                        <Radio label="fromXstepYSec" class="radio">
                            每隔
                            <InputNumber :max="60" :min="1" v-model="second.step"  @on-change="onSecSelctChange"></InputNumber>
                            秒执行 从
                            <InputNumber :max="59" :min="0" v-model="second.from"  @on-change="onSecSelctChange"></InputNumber>
                            秒开始
                        </Radio>
                        <Radio label="selectedSec" class="radio">
                            具体秒数（可多选）
                            <Select v-model="second.selectedData" multiple transfer @click.native="(event)=>{event.preventDefault()}" @on-change="onSecSelctChange">
                                <Option v-for="n in 60" :value="n-1" :key="n">{{ n-1 }}</Option>
                            </Select>
                        </Radio>
                        <Radio label="fromXtoYSec" class="radio">
                            周期从
                            <InputNumber :max="60" :min="1" v-model="second.start"  @on-change="onSecSelctChange"></InputNumber>
                            到
                            <InputNumber :max="59" :min="0" v-model="second.end"  @on-change="onSecSelctChange"></InputNumber>
                            秒
                        </Radio>
                    </RadioGroup>
                </TabPane>
                <TabPane label="分">
                    <RadioGroup vertical v-model="minute.radioSelected" class="radio-group"  @on-change="onMinSelctChange">
                        <Radio label="everyMin" class="radio">
                            每一分钟
                        </Radio>
                        <Radio label="fromXstepYMin" class="radio">
                            每隔
                            <InputNumber :max="60" :min="1" v-model="minute.step" @on-change="onMinSelctChange"></InputNumber>
                            分执行 从
                            <InputNumber :max="59" :min="0" v-model="minute.from" @on-change="onMinSelctChange"></InputNumber>
                            分开始
                        </Radio>
                        <Radio label="selectedMin" class="radio">
                            具体分钟数（可多选）
                            <Select v-model="minute.selectedData" multiple transfer @click.native="(event)=>{event.preventDefault()}" @on-change="onMinSelctChange">
                                <Option v-for="n in 60" :value="n-1" :key="n">{{ n-1 }}</Option>
                            </Select>
                        </Radio>
                        <Radio label="fromXtoYMin" class="radio">
                            周期从
                            <InputNumber :max="60" :min="1" v-model="minute.start" @on-change="onMinSelctChange"></InputNumber>
                            到
                            <InputNumber :max="59" :min="0" v-model="minute.end" @on-change="onMinSelctChange"></InputNumber>
                            分
                        </Radio>
                    </RadioGroup>
                </TabPane>
                <TabPane label="时">
                    <RadioGroup vertical v-model="hour.radioSelected" class="radio-group" @on-change="onHourSelctChange">
                        <Radio label="everyHour" class="radio" >
                            每一小时
                        </Radio>
                        <Radio label="fromXstepYHour" class="radio">
                            每隔
                            <InputNumber :max="24" :min="1" v-model="hour.step" @on-change="onHourSelctChange"></InputNumber>
                            小时执行 从
                            <InputNumber :max="23" :min="0" v-model="hour.from" @on-change="onHourSelctChange"></InputNumber>
                            小时开始
                        </Radio>
                        <Radio label="selectedHour" class="radio">
                            具体小时数（可多选）
                            <Select v-model="hour.selectedData" multiple transfer @click.native="(event)=>{event.preventDefault()}" @on-change="onHourSelctChange">
                                <Option v-for="n in 24" :value="n-1" :key="n">{{ n-1 }}</Option>
                            </Select>
                        </Radio>
                        <Radio label="fromXtoYHour" class="radio">
                            周期从
                            <InputNumber :max="24" :min="1" v-model="hour.start" @on-change="onHourSelctChange"></InputNumber>
                            到
                            <InputNumber :max="23" :min="0" v-model="hour.end" @on-change="onHourSelctChange"></InputNumber>
                            小时
                        </Radio>
                    </RadioGroup>
                </TabPane>
                <TabPane label="日">
                    <RadioGroup vertical v-model="day.radioSelected" class="radio-group" @on-change="onDaySelctChange">
                        <Radio label="everyDay" class="radio">
                            每一天
                        </Radio>
                        <Radio label="fromXstepYDay" class="radio">
                            每隔
                            <InputNumber :max="31" :min="1" v-model="day.stepDay" @on-change="onDaySelctChange"></InputNumber>
                            天执行 从
                            <InputNumber :max="31" :min="1" v-model="day.fromDay" @on-change="onDaySelctChange"></InputNumber>
                            天开始
                        </Radio>
                        <Radio label="selectedDay" class="radio">
                            具体天数（可多选）
                            <Select v-model="day.selectedDataDay" multiple transfer :style="{width:'300px'}" @click.native="(event)=>{event.preventDefault()}" @on-change="onDaySelctChange">
                                <Option v-for="n in 31" :value="n" :key="n">{{ n }}</Option>
                            </Select>
                        </Radio>
                    </RadioGroup>
                </TabPane>
                <TabPane label="月">
                    <RadioGroup vertical v-model="month.radioSelected" class="radio-group" @on-change="onMonthSelctChange">
                        <Radio label="everyMonth" class="radio">
                            每一月
                        </Radio>
                        <Radio label="fromXstepYMon" class="radio">
                            每隔
                            <InputNumber :max="12" :min="1" v-model="month.step" @on-change="onMonthSelctChange"></InputNumber>
                            月执行 从
                            <InputNumber :max="12" :min="0" v-model="month.from" @on-change="onMonthSelctChange"></InputNumber>
                            月开始
                        </Radio>
                        <Radio label="selectedMon" class="radio">
                            具体月数（可多选）
                            <Select v-model="month.selectedData" multiple transfer @click.native="(event)=>{event.preventDefault()}" @on-change="onMonthSelctChange">
                                <Option v-for="n in 12" :value="n" :key="n">{{ n }}</Option>
                            </Select>
                        </Radio>
                        <Radio label="fromXtoYMon" class="radio">
                            周期从
                            <InputNumber :max="12" :min="1" v-model="month.start" @on-change="onMonthSelctChange"></InputNumber>
                            到
                            <InputNumber :max="12" :min="1" v-model="month.end" @on-change="onMonthSelctChange"></InputNumber>
                            月
                        </Radio>
                    </RadioGroup>
                </TabPane>
                <!-- <TabPane label="年">
                    <RadioGroup vertical v-model="year.radioSelected" class="radio-group" @on-change="onYearSelctChange">
                        <Radio label="everyYear" class="radio">
                            每一年
                        </Radio>
                        <Radio label="fromXstepYYear" class="radio">
                            每隔
                            <InputNumber :min="1" v-model="year.step" @on-change="onYearSelctChange"></InputNumber>
                            年执行 从
                            <InputNumber :min="2019" v-model="year.from" @on-change="onYearSelctChange"></InputNumber>
                            年开始
                        </Radio>
                        <Radio label="selectedYear" class="radio">
                            具体年份（可多选）
                            <Select v-model="year.selectedData" multiple transfer :style="{width:'320px'}" @click.native="(event)=>{event.preventDefault()}" @on-change="onYearSelctChange">
                                <Option v-for="n in 20" :value="2018+n" :key="n">{{ 2018+n }}</Option>
                            </Select>
                        </Radio>
                        <Radio label="fromXtoYYear" class="radio">
                            周期从
                            <InputNumber :min="2019" v-model="year.start" @on-change="onYearSelctChange"></InputNumber>
                            到
                            <InputNumber :min="2019" v-model="year.end" @on-change="onYearSelctChange"></InputNumber>
                            年
                        </Radio>
                    </RadioGroup>
                </TabPane> -->
            </Tabs>
        </Modal>
    </div>
</template>
<script>
export default {
  name: 'cron-selector',
  props: {
    isModalShow: {
      default: false
    },
    width: {
      default: 100
    },
    height: {
      default: 30
    }
  },
  data () {
    return {
      isShow: this.isModalShow,
      cronSec: '*',
      cronMin: '*',
      cronHour: '*',
      cronDay: '*',
      cronMonth: '*',
      cronWeek: '?',
      cornYear: '*',
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
  watch: {
    isModalShow (val) {
      this.isShow = val
    },
    isShow (val) {
      this.$emit('onIsShow', val)
    }
  },
  computed: {
    cronExp: function () {
      return this.cronSec + ' ' + this.cronMin + ' ' + this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronWeek
    }
  },
  methods: {
    init (cron) {
      let temp = cron.split(' ')
      console.log()

      // second
      if (temp[0].indexOf('*') !== -1) {
        this.second.radioSelected = 'everySec'
      } else if (temp[0].indexOf('/') !== -1) {
        this.second.radioSelected = 'fromXstepYSec'
        let secondTemp = temp[0].split('/')
        this.second.from = parseInt(secondTemp[0])
        this.second.step = parseInt(secondTemp[1])
      } else if (temp[0].indexOf('-') !== -1) {
        this.second.radioSelected = 'fromXtoYSec'
        let secondTemp = temp[0].split('-')
        this.second.start = parseInt(secondTemp[0])
        this.second.end = parseInt(secondTemp[1])
      } else {
        this.second.radioSelected = 'selectedSec'
        let arr = []
        let secondTemp = temp[0].split(',')
        secondTemp.map((item) => {
          arr.push(parseInt(item))
        })
        this.second.selectedData = arr
      }

      // minute
      if (temp[1].indexOf('*') !== -1) {
        this.minute.radioSelected = 'everyMin'
      } else if (temp[1].indexOf('/') !== -1) {
        this.minute.radioSelected = 'fromXstepYMin'
        let minuteTemp = temp[1].split('/')
        this.minute.from = parseInt(minuteTemp[0])
        this.minute.step = parseInt(minuteTemp[1])
      } else if (temp[1].indexOf('-') !== -1) {
        this.minute.radioSelected = 'fromXtoYMin'
        let minuteTemp = temp[1].split('-')
        this.minute.start = parseInt(minuteTemp[0])
        this.minute.end = parseInt(minuteTemp[1])
      } else {
        this.minute.radioSelected = 'selectedMin'
        let arr = []
        let minuteTemp = temp[1].split(',')
        minuteTemp.map((item) => {
          arr.push(parseInt(item))
        })
        this.minute.selectedData = arr
      }

      // hour
      if (temp[2].indexOf('*') !== -1) {
        this.hour.radioSelected = 'everyHour'
      } else if (temp[2].indexOf('/') !== -1) {
        this.hour.radioSelected = 'fromXstepYHour'
        let hourTemp = temp[2].split('/')
        this.hour.from = parseInt(hourTemp[0])
        this.hour.step = parseInt(hourTemp[1])
      } else if (temp[2].indexOf('-') !== -1) {
        this.hour.radioSelected = 'fromXtoYHour'
        let hourTemp = temp[2].split('-')
        this.hour.start = parseInt(hourTemp[0])
        this.hour.end = parseInt(hourTemp[1])
      } else {
        this.hour.radioSelected = 'selectedHour'
        let arr = []
        let hourTemp = temp[2].split(',')
        hourTemp.map((item) => {
          arr.push(parseInt(item))
        })
        this.hour.selectedData = arr
      }

      // day
      if (temp[3].indexOf('*') !== -1) {
        this.day.radioSelected = 'everyDay'
      } else if (temp[3].indexOf('/') !== -1) {
        this.day.radioSelected = 'fromXstepYDay'
        let dayTemp = temp[3].split('/')
        this.day.fromDay = parseInt(dayTemp[0])
        this.day.stepDay = parseInt(dayTemp[1])
      } else {
        this.day.radioSelected = 'selectedDay'
        let arr = []
        let dayTemp = temp[3].split(',')
        dayTemp.map((item) => {
          arr.push(parseInt(item))
        })
        this.day.selectedDataDay = arr
      }

      // month
      if (temp[4].indexOf('*') !== -1) {
        this.month.radioSelected = 'everyMonth'
      } else if (temp[4].indexOf('/') !== -1) {
        this.month.radioSelected = 'fromXstepYMon'
        let monthTemp = temp[4].split('/')
        this.month.from = parseInt(monthTemp[0])
        this.month.step = parseInt(monthTemp[1])
      } else if (temp[4].indexOf('-') !== -1) {
        this.month.radioSelected = 'fromXtoYMon'
        let monthTemp = temp[4].split('-')
        this.month.start = parseInt(monthTemp[0])
        this.month.end = parseInt(monthTemp[1])
      } else {
        this.month.radioSelected = 'selectedMon'
        let arr = []
        let monthTemp = temp[4].split(',')
        monthTemp.map((item) => {
          arr.push(parseInt(item))
        })
        this.month.selectedData = arr
      }

      // // year
      // if(temp[5].indexOf('*')!==-1){
      //   this.year.radioSelected='everyYear'
      // }else if(temp[5].indexOf('/')!==-1){
      //   this.year.radioSelected='fromXstepYYear'
      //   let yearTemp=temp[5].split('/')
      //   this.year.from=parseInt(yearTemp[0])
      //   this.year.step=parseInt(yearTemp[1])
      // }else if(temp[5].indexOf('-')!==-1){
      //   this.year.radioSelected='fromXtoYYear'
      //   let yearTemp=temp[5].split('-')
      //   this.year.start=parseInt(yearTemp[0])
      //   this.year.end=parseInt(yearTemp[1])
      // }else{
      //   this.year.radioSelected='selectedYear'
      //   let arr=[]
      //   let yearTemp=temp[5].split(',')
      //   yearTemp.map((item)=>{
      //     arr.push(parseInt(item))
      //   })
      //   this.year.selectedData=arr
      // }
    },
    onSecSelctChange () {
      var val = this.second.radioSelected
      if (val === 'everySec') {
        this.cronSec = '*'
      } else if (val === 'fromXstepYSec') {
        this.cronSec = this.second.from + '/' + this.second.step
      } else if (val === 'selectedSec') {
        var temp = ''
        var len = this.second.selectedData.length
        if (len === 0) {
          return
        }
        for (var i = 0; i < len - 1; ++i) {
          temp = temp + this.second.selectedData[i] + ','
        }
        temp = temp + this.second.selectedData[len - 1]
        this.cronSec = temp
      } else if (val === 'fromXtoYSec') {
        this.cronSec = this.second.start + '-' + this.second.end
      } else {
        console.error('error in onSecSelctChange')
      }
    },
    onMinSelctChange () {
      var val = this.minute.radioSelected
      if (val === 'everyMin') {
        this.cronMin = '*'
      } else if (val === 'fromXstepYMin') {
        this.cronMin = this.minute.from + '/' + this.minute.step
      } else if (val === 'selectedMin') {
        var temp = ''
        var len = this.minute.selectedData.length
        if (len === 0) {
          return
        }
        for (var i = 0; i < len - 1; ++i) {
          temp = temp + this.minute.selectedData[i] + ','
        }
        temp = temp + this.minute.selectedData[len - 1]
        this.cronMin = temp
      } else if (val === 'fromXtoYMin') {
        this.cronMin = this.minute.start + '-' + this.minute.end
      } else {
        console.error('error in onMinSelctChange')
      }
    },
    onHourSelctChange () {
      var val = this.hour.radioSelected
      if (val === 'everyHour') {
        this.cronHour = '*'
      } else if (val === 'fromXstepYHour') {
        this.cronHour = this.hour.from + '/' + this.hour.step
      } else if (val === 'selectedHour') {
        var temp = ''
        var len = this.hour.selectedData.length
        if (len === 0) {
          return
        }
        for (var i = 0; i < len - 1; ++i) {
          temp = temp + this.hour.selectedData[i] + ','
        }
        temp = temp + this.hour.selectedData[len - 1]
        this.cronHour = temp
      } else if (val === 'fromXtoYHour') {
        this.cronHour = this.hour.start + '-' + this.hour.end
      } else {
        console.error('error in onMinSelctChange')
      }
    },
    onDaySelctChange () {
      var val = this.day.radioSelected
      var temp = ''
      var len = 0
      var i = 0
      if (val === 'everyDay') {
        this.cronDay = '*'
        this.cronWeek = '?'
      } else if (val === 'fromXstepYWeek') {
        this.cronDay = '?'
        this.cronWeek = this.day.fromWeek + '/' + this.day.stepWeek
      } else if (val === 'fromXstepYDay') {
        this.cronDay = this.day.fromDay + '/' + this.day.stepDay
        this.cronWeek = '?'
      } else if (val === 'selectedWeek') {
        temp = ''
        len = this.day.selectedDataWeek.length
        if (len === 0) {
          return
        }
        for (i = 0; i < len - 1; ++i) {
          temp = temp + this.day.selectedDataWeek[i] + ','
        }
        temp = temp + this.day.selectedDataWeek[len - 1]
        this.cronDay = '?'
        this.cronWeek = temp
      } else if (val === 'selectedDay') {
        temp = ''
        len = this.day.selectedDataDay.length
        if (len === 0) {
          return
        }
        for (i = 0; i < len - 1; ++i) {
          temp = temp + this.day.selectedDataDay[i] + ','
        }
        temp = temp + this.day.selectedDataDay[len - 1]
        this.cronDay = temp
        this.cronWeek = '?'
      } else if (val === 'lastDay') {
        this.cronDay = 'L'
        this.cronWeek = '?'
      } else if (val === 'lastWorkDay') {
        this.cronDay = 'LW'
        this.cronWeek = '?'
      } else if (val === 'lastWeek') {
        this.cronDay = this.day.lastWeek + 'L'
        this.cronWeek = '?'
      } else if (val === 'dayToLast') {
        this.cronDay = 'L-' + this.day.lastDay
        this.cronWeek = '?'
      } else if (val === 'dayToWork') {
        this.cronDay = this.day.nearWorkFrom + 'W'
        this.cronWeek = '?'
      } else if (val === 'weekToMonth') {
        this.cronDay = '?'
        this.cronWeek = this.day.dayOfWeek + '#' + this.day.orderedWeek
      }
    },
    onMonthSelctChange () {
      var val = this.month.radioSelected
      if (val === 'everyMonth') {
        this.cronMonth = '*'
      } else if (val === 'fromXstepYMon') {
        this.cronMonth = this.month.from + '/' + this.month.step
      } else if (val === 'selectedMon') {
        var temp = ''
        var len = this.month.selectedData.length
        if (len === 0) {
          return
        }
        for (var i = 0; i < len - 1; ++i) {
          temp = temp + this.month.selectedData[i] + ','
        }
        temp = temp + this.month.selectedData[len - 1]
        this.cronMonth = temp
      } else if (val === 'fromXtoYMon') {
        this.cronMonth = this.month.start + '-' + this.month.end
      } else {
        console.error('error in onMonthSelctChange')
      }
    },
    onYearSelctChange () {
      var val = this.year.radioSelected
      if (val === 'everyYear') {
        this.cornYear = '*'
      } else if (val === 'fromXstepYYear') {
        this.cronMonth = this.year.from + '/' + this.year.step
      } else if (val === 'selectedYear') {
        var temp = ''
        var len = this.year.selectedData.length
        if (len === 0) {
          return
        }
        for (var i = 0; i < len - 1; ++i) {
          temp = temp + this.year.selectedData[i] + ','
        }
        temp = temp + this.year.selectedData[len - 1]
        this.cornYear = temp
      } else if (val === 'fromXtoYYear') {
        this.cornYear = this.year.start + '-' + this.year.end
      } else {
        console.error('error in onYearSelctChange')
      }
    },
    onOk () {
      this.$emit('onOk', this.cronSec + ' ' + this.cronMin + ' ' + this.cronHour + ' ' + this.cronDay + ' ' + this.cronMonth + ' ' + this.cronWeek)
    }

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
