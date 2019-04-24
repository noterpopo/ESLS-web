<template>
    <div>
        <Table v-if="hasSearchAccess" size="small" border :data="filters" :columns="tableColumnsFilters" stripe></Table>
        <Table ref="st" size="small" highlight-row @on-row-click="handleClick" @on-row-dblclick="handleDoubleClick" @on-selection-change="handleSelection" :show-header="!hasSearchAccess" border :data="data" :columns="columns" :loading="isLoading" stripe></Table>
        <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="dataNum" :page-size="pageSize" :current="current" @on-change="changePage"></Page>
        </div>
    </div>
    </div>
</template>

<script>
// https://github.com/azhengyongqin/iview-filter-table
import store from '@/store'
export default {
  name: 'super_table',
  props: {
    columns: Array,
    data: Array,
    isLoading: Boolean,
    dataNum: Number,
    current: Number,
    pageSize: Number
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
  mounted () {
    for (let index in this.columns) {
      let filter = {}
      this.$set(filter, 'title', this.columns[index].title)
      if (this.columns[index].width) {
        this.$set(filter, 'width', this.columns[index].width)
      }
      let render = (h) => {}
      if (this.columns[index].filter) {
        if (this.columns[index].filter.type && this.columns[index].filter.type === 'Select') {
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
            return h(this.columns[index].filter.type, {
              props: {
                placeholder: '输入' + this.columns[index].title
              },
              attrs: {
                style: 'padding-left:10px;padding-right:10px;'
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
  computed: {
    hasSearchAccess: () => {
      return store.getters.access.indexOf(11) !== -1
    }
  },
  methods: {
    clearHighlight () {
      this.$refs.st.clearCurrentRow()
    },
    createOptionsRender (index, h) {
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
    load () {
      this.$emit('onSearch', this.search)
    },
    validInputValue (index, inputValue) {
      if (!inputValue) {
        this.$delete(this.search, this.columns[index].key)
        this.load()
        return
      }
      this.$set(this.search, this.columns[index].key, inputValue)
      this.load()
    },
    changePage (page) {
      this.$emit('update:current', page)
    },
    handleClick (currentRow) {
      this.$emit('onClick', currentRow)
    },
    handleDoubleClick (currentRow) {
      this.$emit('onDoubleClick', currentRow)
    },
    handleSelection (selection) {
      this.$emit('onSelectionChange', selection)
    }
  }
}
</script>
<style>
tr.ivu-table-row-hover td{
  background-color:rgb(220, 244, 253)!important;
}
.ivu-table-row-highlight td {
  background-color: rgb(220, 241, 255)!important;
}
.ivu-table-cell{
  padding: 0px;
  text-align:center;
}
.ivu-table-header th{
  padding: 0px;
  text-align:center;
}
.ivu-table td{
  display: table-cell;
  height: 0px;
  padding: 0px;
}
</style>
