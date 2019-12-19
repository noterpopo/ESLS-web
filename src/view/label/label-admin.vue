<template>
  <div class="container" ref="container" :style="{flexDirection: 'row',alignItems: 'flex-start'}">
      <div class="left111" >
        <Card :bordered="false" :style="{width: windowWidth*0.6 + 'px'}" class="e-lable-table-card card">
            <div slot="title">
                <Row type="flex" justify="center" >
                    <Col span="18"><p>样式信息</p></Col>
                    <Col span="2" ><Button v-if="hasStyleAccess" type="primary" @click="addStyle">新建样式</Button></Col>
                    <Col span="2" >
                      <Upload style="margin-left:4px" :show-upload-list="false" action="" :before-upload="inputStyle">
                        <Button v-if="hasStyleAccess" icon="ios-cloud-upload-outline">导入样式</Button>
                    </Upload>
                  </Col>
                </Row>
              </div>
            <super_table :pageSize="countPerPage" :current.sync="currentPage" :dataNum="dataNum" class="e-label-table" @onSearch="onTableSearch" @onClick="onTableClick" :data="styleData" :columns="tableColumns" :isLoading="isTableLoading" :pageNum="dataNum"></super_table>
        </Card>
        <Modal
            :style="{flexDirection: 'row'}"
            v-model="isModal"
            @on-ok="onUpdate"
            width="auto"
            title="样式编辑器"
            :mask-closable="false"
            class-name="modal-style-designer">
            <modal_style_designer ref="designer" @reloadTable="reload" @onSava="isModal=false"></modal_style_designer>
        </Modal>
      </div>
      <div class="right" v-bind:style="{ marginLeft:'10px'}" >
        <div v-bind:style="{ width: windowWidth*0.3 + 'px',display:'flex',flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}">
          <Card :bordered="false" class="e-lable-card card">
            <p slot="title">价签样式预览</p>
            <div>
              <e_label class="e-label" v-bind="item" ref="label_canvas" >
                  <Spin size="large" fix v-if="isLabelLoading"></Spin>
              </e_label>
            </div>
          </Card>
          <!-- <Card :bordered="false" class="card input-card">
            <div slot="title">
                <Row type="flex" justify="start" align="middle">
                    <Col span="21"><p>信息修改</p></Col>
                    <Col span="3"><Button type="primary">保存</Button></Col>
                </Row>
            </div>
            <div>
              <Input type="text" v-model="item.itemName" />
              <Input type="text" v-model="item.itemUnit" />
              <Input type="text" v-model="item.itemNorm" />
              <Input type="text" v-model="item.itemCategory" />
              <Input type="text" v-model="item.itemOrigin" />
              <Input type="text" v-model="item.itemNo" />
              <Input type="text" v-model="item.itemQRCode" />
              <Input type="text" v-model="item.itemBarCode" />
              <Input type="text" v-model="item.itemStock" />
              <Input type="text" v-model="item.itemPrice" />
              <Input type="text" v-model="item.itemOnSalePrice" />
            </div>
          </Card> -->
        </div>
      </div>
  </div>
</template>

<script>
import e_label from '@/components/e-label/e-lable.vue'
import super_table from '@/components/table/supertable.vue'
import modal_style_designer from '@/components/modal/modal-style-designer.vue'
import { getStyle, getStyleDisp, getAllStyle, deleteStyle, updateStyle, newStyle } from '@/api/style'
import FileSaver from 'file-saver'
import store from '@/store'
export default {
  components: {
    e_label,
    super_table,
    modal_style_designer
  },
  data () {
    return {
      addNewStyle: false,
      windowWidth: 0,
      currentSelected: {},
      item: {
        itemName: '测试商品名称1',
        itemUnit: '罐',
        itemNorm: '205g',
        itemCategory: '衣物',
        itemOrigin: '北京',
        itemNo: '00012',
        itemQRCode: '692226641428',
        itemBarCode: '692226641428',
        itemStock: '110',
        itemisOnSale: true,
        itemPrice: '10.19',
        itemOnSalePrice: '444.44',
        labelStyle: '1',
        rfu01: '铺货',
        rfu02: '自定义字段2',
        rfus01: '自定义字段3',
        rfus02: '自定义字段4'
      },
      styleList: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6'
      ],
      isLabelLoading: false,
      isTableLoading: false,
      isModal: false,
      dataNum: 0,
      currentPage: 1,
      countPerPage: 20,
      styleData: [],
      tableColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          indexMethod: (row) => {
            return row._index + 1 + (this.currentPage - 1) * (this.countPerPage / 2)
          }
        },
        {
          title: '样式ID',
          width: 80,
          key: 'styleNumber',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '样式名称',
          key: 'styleType',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '宽度',
          key: 'width',
          width: 100,
          filter: {
            type: 'Input'
          }
        },
        {
          title: '高度',
          width: 100,
          key: 'height',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '促销',
          width: '100',
          render: (h, params) => {
            let temp = this.styleData.find(function (item) { return item.styleNumber === params.row.styleNumber })
            return h('i-switch', {
              props: {
                value: params.row.isPromote === 1
              },
              on: {
                'on-change': (val, $event) => {
                  event.stopPropagation()
                  if (val) {
                    temp.isPromote = 1
                  } else {
                    temp.isPromote = 0
                  }
                  this.onTableClick(temp)
                }
              }
            })
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 160,
          align: 'center',
          render: (h, params) => {
            let isDeletable = true
            if (params.row.styleNumber.indexOf('01') !== -1 || params.row.styleNumber.indexOf('02') !== -1) {
              isDeletable = false
            }
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: !this.hasStyleAccess
                },
                style: {
                  margin: '2px'
                },
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    let temp = this.styleData.find(function (item) { return item.styleNumber === params.row.styleNumber })
                    this.currentSelected = params.row
                    this.editStyle(temp.styleNumber, params.row.isPromote, temp.styleType, temp.width, temp.height)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: !this.hasStyleAccess
                },
                style: {
                  margin: '2px'
                },
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    let temp = this.styleData.find(function (item) { return item.styleNumber === params.row.styleNumber })
                    this.exportStyle(temp.styleNumber, temp.styleType)
                  }
                }
              }, '导出'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: !this.hasStyleAccess
                },
                style: {
                  margin: '2px',
                  display: !isDeletable ? 'none' : 'inline-block'
                },
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    this.remove(params.row.styleNumber)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      currentStyleID: 0,
      queryId: null,
      queryString: null
    }
  },
  created () {
    this.getStyleTableData({ page: this.currentPage - 1, count: this.countPerPage, queryId: this.queryId, queryString: this.queryString })
  },
  watch: {
    currentPage () {
      this.getStyleTableData({ page: this.currentPage - 1, count: this.countPerPage, queryId: this.queryId, queryString: this.queryString })
    }
  },
  computed: {
    hasStyleAccess: () => {
      return store.getters.access.indexOf(10) !== -1
    }
  },
  mounted () {
    var that = this
    this.$nextTick(() => {
      this.windowWidth = this.$refs.container.offsetWidth
    })
    window.onresize = function () {
      that.windowWidth = that.$refs.container.offsetWidth
    }
  },
  methods: {
    inputStyle (data) {
      let reader = new FileReader()
      let str = ''
      var that = this
      reader.addEventListener('load', function (e) {
        str = e.target.result
        let styledes = data.name.split('.json')[0]
        let styleData = str.split('this is magic')
        let styleDisp1 = JSON.parse(styleData[0])
        let styleDisp2 = JSON.parse(styleData[1])
        that.$Modal.confirm({
          title: '是否新建样式',
          render: (h, params) => {
            return h('span', [
              h('p', {
                attrs: {
                  style: 'margin-top:10px'
                }
              }, '新建样式:'),
              h('i-switch', {
                props: {
                  value: this.addNewStyle
                },
                on: {
                  'on-change': (value) => {
                    that.addNewStyle = value
                  }
                }
              })
            ])
          },
          onOk: () => {
            let sN = styleData[2]
            let index = 1
            for (let i = 0; i < styleDisp1.length; ++i) {
              if (styleDisp1[i].status === 1) {
                that.$set(styleDisp1[i], 'regionId', index++)
              } else {
                that.$set(styleDisp1[i], 'regionId', 0)
              }
            }
            index = 1
            for (let i = 0; i < styleDisp2.length; ++i) {
              if (styleDisp2[i].status === 1) {
                that.$set(styleDisp2[i], 'regionId', index++)
              } else {
                that.$set(styleDisp2[i], 'regionId', 0)
              }
            }
            // TODO
            getStyle(sN, 0).then(r => {
              console.log(r.data)
              console.log(that.addNewStyle)
              if (that.addNewStyle || (r.data.data === null || r.data.data === '')) {
                for (let i = 0; i < styleDisp1.length; ++i) {
                  delete styleDisp1[i].id
                }
                for (let i = 0; i < styleDisp2.length; ++i) {
                  delete styleDisp2[i].id
                }
                console.log(styleDisp1)
                console.log(styleDisp2)
                console.log(sN)
                newStyle(styledes).then(res => {
                  let newId = res.data.data[0].id
                  let newPromoteId = res.data.data[1].id
                  updateStyle(newId, styleDisp1, 0, 0).then(res => {
                    updateStyle(newPromoteId, styleDisp2, 0, 0).then(r => {
                      that.$emit('reloadTable')
                      that.$Message.info('新建样式成功')
                    })
                  })
                })
              } else {
                console.log(styleDisp1)
                console.log(styleDisp2)
                console.log(sN)
                updateStyle(r.data.data.id, styleDisp1, 1, 0).then(res => {
                  getStyle(sN, 1).then(r2 => {
                    updateStyle(r2.data.data.id, styleDisp2, 1, 0).then(r => {
                      that.$emit('reloadTable')
                      that.$Message.info('更新样式成功')
                    })
                  })
                })
              }
            }).catch(d => {

            })
          }
        })
      })
      reader.readAsText(data)
      return false
    },
    exportStyle (sN, name) {
      getStyle(sN, 0).then(res => {
        let str = null
        getStyleDisp(res.data.data.id).then(res => {
          str = JSON.stringify(res.data.data)
          getStyle(sN, 1).then(res => {
            getStyleDisp(res.data.data.id).then(res => {
              str = str + 'this is magic' + JSON.stringify(res.data.data)
              str = str + 'this is magic' + sN
              FileSaver.saveAs(new Blob([str], { type: 'text/plain;charset=utf-8' }), name + '.json')
            })
          })
        })
      })
    },
    getLabelData (sN, isPromote, w, h) {
      var that = this
      that.isLabelLoading = true
      getStyle(sN, isPromote).then(res => {
        getStyleDisp(res.data.data.id).then(res => {
          const dispData = res.data.data
          var len = dispData.length // 循环变量
          for (var i = 0; i < len; ++i) {
            if (dispData[i].sourceColumn === 'name') {
              that.item.itemName = dispData[i].text
            } else if (dispData[i].sourceColumn === 'oriPrice') {
              that.item.itemPrice = dispData[i].text
            } else if (dispData[i].sourceColumn === 'curPrice') {
              that.item.itemOnSalePrice = dispData[i].text
            } else if (dispData[i].sourceColumn === 'spec') {
              that.item.itemNorm = dispData[i].text
            } else if (dispData[i].sourceColumn === 'class') {
              that.item.itemCategory = dispData[i].text
            } else if (dispData[i].sourceColumn === 'unit') {
              that.item.itemUnit = dispData[i].text
            } else if (dispData[i].sourceColumn === 'origin') {
              that.item.itemOrigin = dispData[i].text
            } else if (dispData[i].sourceColumn === 'shelfNumber') {
              that.item.itemNo = dispData[i].text
            } else if (dispData[i].sourceColumn === 'qrCode') {
              that.item.itemQRCode = dispData[i].text
            } else if (dispData[i].sourceColumn === 'barCode') {
              that.item.itemBarCode = dispData[i].text
            } else if (dispData[i].sourceColumn === 'stock') {
              that.item.itemStock = dispData[i].text
            } else if (dispData[i].sourceColumn === 'rfu01') {
              that.item.rfu01 = dispData[i].text
            } else if (dispData[i].sourceColumn === 'rfu02') {
              that.item.rfu02 = dispData[i].text
            } else if (dispData[i].sourceColumn === 'rfus01') {
              that.item.rfus01 = dispData[i].text
            } else if (dispData[i].sourceColumn === 'rfus02') {
              that.item.rfus02 = dispData[i].text
            } else {

            }
          }
          that.isLabelLoading = false
          that.$refs.label_canvas.initData(dispData, w, h, null)
        })
      })
    },
    getStyleTableData (page, count) {
      var that = this
      that.isTableLoading = true
      getAllStyle(page, count).then(res => {
        let data = res.data.data.filter((item) => {
          return item.isPromote === 0
        })
        that.dataNum = res.data.code
        that.styleData = data
        that.isTableLoading = false
      })
    },
    reload () {
      this.getStyleTableData({ page: this.currentPage - 1, count: this.countPerPage, queryId: this.queryId, queryString: this.queryString })
    },
    onTableSearch (search) {
      var key = Object.keys(search)
      if (key.length === 0) {
        this.getStyleTableData({ page: this.currentPage - 1, count: this.countPerPage })
        this.queryId = null
        this.queryString = null
        return
      }
      var value = search[key]
      this.queryId = key[0]
      this.queryString = value
      this.getStyleTableData({ page: this.currentPage - 1, count: this.countPerPage, queryId: this.queryId, queryString: this.queryString })
    },
    onTableClick (currentRow) {
      this.getLabelData(currentRow.styleNumber, currentRow.isPromote, currentRow.width, currentRow.height)
    },
    remove (id) {
      var that = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定删除该样式吗？',
        onOk: function () {
          deleteStyle(id)
            .then(() => {
              that.getStyleTableData({ page: that.currentPage - 1, count: that.countPerPage, queryId: this.queryId, queryString: this.queryString })
            })
        }
      })
    },
    editStyle (styleid, isPromote, styletype, w, h) {
      this.isModal = true
      this.$refs.designer.getStyleData(styleid, isPromote, styletype, w, h)
    },
    onUpdate () {
      if (this.currentSelected.styleNumber) {
        getStyle(this.currentSelected.styleNumber, this.currentSelected.isPromote).then(res => {
          this.$refs.designer.update(res.data.data.id)
        })
      } else {
        this.$refs.designer.update(0)
      }
    },
    addStyle () {
      this.$Modal.confirm({
        title: '新样式信息',
        render: (h, params) => {
          var that = this
          return h('span', [
            h('p', '样式大小:'),
            h('Select', {
              props: {
                value: this.newStyleSize
              },
              on: {
                'on-change': (val) => {
                  that.newStyleSize = val
                }
              }
            }, [
              h('Option', {
                props: {
                  value: '4.2寸',
                  label: '4.2寸'
                }
              }),
              h('Option', {
                props: {
                  value: '2.13寸',
                  label: '2.13寸'
                }
              }),
              h('Option', {
                props: {
                  value: '2.9寸',
                  label: '2.9寸'
                }
              })
            ]),
            h('p', {
              attrs: {
                style: 'margin-top:10px'
              }
            }, '样式名字:'),
            h('Input', {
              props: {
                placeholder: '输入名字',
                value: this.newStyleName
              },
              on: {
                'on-change': (event) => {
                  that.newStyleName = event.target.value
                }
              }
            }),
            h('p', {
              attrs: {
                style: 'margin-top:10px'
              }
            }, '样式类型:'),
            h('Select', {
              props: {
                value: this.newStyleType
              },
              on: {
                'on-change': function (val) {
                  that.newStyleType = val
                }
              }
            }, [
              h('Option', {
                props: {
                  value: '黑白',
                  label: '黑白'
                }
              }),
              h('Option', {
                props: {
                  value: '三色',
                  label: '三色'
                }
              })
            ])
          ])
        },
        onOk: () => {
          let w = 0
          let h = 0
          let styleid = 0
          let styleType = this.newStyleSize + '-' + this.newStyleName + '-' + this.newStyleType
          if (this.newStyleSize === '4.2寸') {
            w = 400
            h = 300
          } else if (this.newStyleSize === '2.13寸') {
            if (this.newStyleType === '黑白') {
              w = 250
              h = 122
            } else if (this.newStyleType === '三色') {
              w = 212
              h = 104
            }
          } else if (this.newStyleSize === '2.9寸') {
            w = 296
            h = 128
          }
          this.isModal = true
          this.$refs.designer.getStyleData(styleid, 0, styleType, w, h, 'new')
        }

      })
    }
  }
}
</script>
<style lang="less">
Input{
  margin: 2px
}
.card{
  margin: 10px;
}
.container{
    display: flex;
    flex-wrap: nowrap;
    justify-content:center;
    align-items: flex-start;

}
.left111{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
}
.right{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
}
.e-label{
  width: 100%;
  height: auto;
}
.e-label-table{
  width: 100%;
}
.e-lable-card{
    width: auto;
    height: auto;
}
.e-lable-table-card{
    height: auto;
}
.input-card{
  width: 432px;
  height: auto;
}
.modal-style-designer{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .ivu-modal{
      top: 0;
  }
}
</style>

<style lang="less">

</style>
