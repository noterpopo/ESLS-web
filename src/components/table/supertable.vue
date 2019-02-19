<template>
    <div>
        <Table border :data="filters" :columns="tableColumnsFilters" stripe></Table>
        <Table border :data="data" :columns="columns" stripe></Table>
    </div>
</template>

<script>
// https://github.com/azhengyongqin/iview-filter-table
export default {
  name: 'super_table',
  props: {
    columns: Array,
    data: Array
  },
  data () {
    return {
      filters: [{
        title: ''
      }],
      tableColumnsFilters: [],
      search: {}
    }
  },
  created () {
    for (let index in this.columns) {
      let filter = {}
      this.$set(filter, 'title', this.columns[index].title)
      if (this.columns[index].width) {
        this.$set(filter, 'width', this.columns[index].width)
      }
      let render = (h) => {}
      if (this.columns[index].filter) {
        if (this.columns[index].filter.type && this.columns[index].filter.type === 'select') {
          render = (h) => {
            return h(this.columns[index].filter.type, {
              props: {
                value: 0
              },
              on: {
                'on-change': (val) => {
                  if (val === 0) {
                    this.$delete(this.search, this.columns[index].key)
                    this.load()
                    return
                  }
                  this.$set(this.search, this.columns[index].key, val)
                  this.load()
                }
              }
            }, this.createOptionsRender(index, h))
          }
        } else {
          render = (h) => {
            let inputValue = {}
            return h(this.columns[index].type, {
              props: {
                placeholder: '输入' + this.columns[index].title,
                icon: 'ios-search-strong'
              },
              on: {
                input: val => {
                  inputValue = val
                  if (!inputValue) {
                    this.validInputValue(index, inputValue)
                  }
                },
                'on-click': () => {
                  this.validInputValue(index, inputValue)
                },
                'on-enter': () => {
                  this.validInputValue(index, inputValue)
                }
              }
            })
          }
        }
      }
      this.$set(filter, 'render', render)
      this.tableColumnsFilters.push(filter)
    }
  },
  methods: {
    createOptionsRender (index, h) {
      // 选项渲染
      let optionRender = []
      if (this.columns[index].filter.option) {
        let option = this.columns[index].filter.option
        for (let i in option) {
          optionRender.push(h('Option', {
            props: {
              value: option[i].value
            }
          }, option[i].name))
        }
      }
      return optionRender
    },
    // 重新加载数据
    load () {
      // 会执行一个load的事件
      this.$emit('on-search', this.search)
    },
    // 验证输入框的值
    validInputValue (index, inputValue) {
      if (!inputValue) {
        this.$delete(this.search, this.columns[index].key)
        this.load()
        return
      }
      this.$set(this.search, this.columns[index].key, inputValue)
      this.load()
    }
  }
}
</script>
