<template>
    <div class="container" ref="container">
        <div class="top">
          <Card :bordered="false" v-bind:style="{ width: windowWidth*0.99 + 'px' }">
            <div slot="title">
              <Row type="flex" justify="start" align="middle">
                  <Col span="19"><p>商品信息</p></Col>
                  <Col span="1"><Button type="primary" @click="goodReload">刷新</Button></Col>
                  <Col span="2"><Button type="primary" @click="getWarGoods">筛选预警商品</Button></Col>
                  <Col span="2"><Button v-if="hasGoodAccess" type="primary" @click="addGood">添加商品</Button></Col>
              </Row>
            </div>
            <super_table :pageSize="countPerPageGood" @onSearch="onTableSearch" @onClick="searchTag" @onDoubleClick="onTableClick" :customRowClassFunc="rowClass" :current.sync="currentPage" :data="goodData" :columns="tableColumns" :isLoading="isTableLoading" :dataNum="dataNum"></super_table>
            <Button v-if="hasGoodAccess" type="primary" @click="isUploadShow=true">导入文件</Button>
            <Button v-if="hasGjAccess" type="primary" style="margin-left:10px;" @click="downloadGoodsData">导出文件</Button>
            <Button type="primary" style="margin-left:10px;" @click="downloadGoodsDataComp">导出商品计量数据</Button>
            <Button type="primary" style="margin-left:10px;" @click="downloadGoodsDataRep">导出补货预警数据</Button>
            <Modal v-model="isUploadShow" title="上传商品信息文件">
              <div>
                <Select v-model="uploadMode">
                  <Option :value="-1">商品基本数据</Option>
                  <Option :value="-2">商品变价数据</Option>
                </Select>
                <Upload style="margin-top:10px;"
                    multiple
                    :on-success="onUploadSucess"
                    :on-error="onUploadFail"
                    :show-upload-list="false"
                    :headers="headers"
                    type="drag"
                    :action="upLaodUrl">
                    <div style="padding: 20px 0;">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击上传或者拖拽文件上传</p>
                    </div>
                </Upload>
              </div>
            </Modal>
            <Modal :width="1040" v-model="editModal" title="修改商品信息" :loading="editOkLoading" @on-ok="asyncEditOK">
              <div>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>名称：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.name"/></Col>
                    <Col span="2"><p style="position:relative;left:10px;">产地：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.origin" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>规格：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.spec" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">类别：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.category" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p >供应商：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.provider" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">单位：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.unit" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>操作员：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.operator" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">货号：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.shelfNumber" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                  <Col span="2"><p>原价：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.price" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">价格</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.promotePrice" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>条形码：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.barCode" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">二维码：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.qrCode" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>促销理由：</p></Col>
                    <Col span="22"><Input type="text" v-model="currentSelectedRow.promotionReason" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                  <Col span="2"><p >店铺：</p></Col>
                  <Col span="10">
                    <div v-for="item in shoplist" :key="item.id">
                        <p v-if="item.number==currentSelectedRow.shopNumber">{{item.number+'--'+item.name}}</p>
                      </div></Col>
                  <Col span="2"><p style="position:relative;left:10px;">开启计件:</p></Col>
                  <Col span="10"><i-switch type="text" v-model="currentSelectedRow.isComputeOpen" :true-value="1" :false-value="0"></i-switch></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>图片链接：</p></Col>
                    <Col span="22"><Input type="text" v-model="currentSelectedRow.imageUrl" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p >重量规格：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.weightSpec" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">预警门限:</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.replenishNumber" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>导入时间：</p></Col>
                    <Col span="22"><p>{{currentSelectedRow.importTime==null?0:currentSelectedRow.importTime}}</p></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p >铺货：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.rfu01" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">自定义字段2：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.rfu02" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p >自定义字段3：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.rfus01" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">自定义字段4：</p></Col>
                    <Col span="10"><Input type="text" v-model="currentSelectedRow.rfus02" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p >商品图片：</p></Col>
                    <Col span="22">
                      <div>
                          <Upload
                              ref="imgUpload"
                              :on-success="onUploadImgSuccess"
                              :before-upload="handleUpload"
                              :headers="headers"
                              :action="upLaodImgUrl('id',currentSelectedRow.id)">
                              <Button icon="ios-cloud-upload-outline">选择商品图片</Button>
                          </Upload>
                          <div v-if="img !== null">选择图片: {{ img.name }} <Button type="text" @click="upload">{{'点击上传' }}</Button></div>
                      </div>
                    </Col>
                </Row>
              </div>
            </Modal>
            <Modal :width="1040" v-model="addModal" title="添加商品" :loading="addOkLoading" @on-ok="asyncAddOK">
              <div>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>名称：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.name"/></Col>
                    <Col span="2"><p style="position:relative;left:10px;">产地：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.origin" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>规格：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.spec" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">类别：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.category" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p >供应商：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.provider" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">单位：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.unit" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>操作员：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.operator" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">货号：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.shelfNumber" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                  <Col span="2"><p >原价：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.price" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">价格：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.promotePrice" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>条形码：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.barCode" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">二维码：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.qrCode" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>促销理由：</p></Col>
                    <Col span="22"><Input type="text" v-model="addGooddata.promotionReason" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                  <Col span="2"><p>店铺：</p></Col>
                  <Col span="10"><Select v-model="addGooddata.shopNumber">
                      <Option v-for="item in shoplist" :key="item.id" :value="item.number">{{item.number+'--'+item.name}}</Option>
                    </Select>
                  </Col>
                  <Col span="2"><p style="position:relative;left:10px;">开启计件:</p></Col>
                  <Col span="10"><i-switch type="text" v-model="addGooddata.isComputeOpen" :true-value="1" :false-value="0"></i-switch></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p>图片链接：</p></Col>
                    <Col span="22"><Input type="text" v-model="addGooddata.imageUrl" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p >重量规格：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.weightSpec" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">预警门限:</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.replenishNumber" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p >铺货：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.rfu01" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">自定义字段2：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.rfu02" /></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" class="Row">
                    <Col span="2"><p >自定义字段3：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.rfus01" /></Col>
                    <Col span="2"><p style="position:relative;left:10px;">自定义字段4：</p></Col>
                    <Col span="10"><Input type="text" v-model="addGooddata.rfus02" /></Col>
                </Row>
              </div>
            </Modal>
          </Card>
        </div>
        <div class="bottom" v-bind:style="{ marginTop:'10px'}">
          <div v-bind:style="{ width: windowWidth*0.99 + 'px',display:'flex',justifyContent: 'space-between',flexWrap:'wrap'}">
            <Card :bordered="false" v-bind:style="{ width: windowWidth*0.71 + 'px'}">
              <div slot="title">
                <Row type="flex" justify="center" align="middle">
                    <Col span="22"><p>价签信息</p></Col>
                    <Col span="2"><Button type="primary" @click="tagReload">刷新</Button></Col>
                </Row>
              </div>
              <super_table :pageSize="countPerPageTag" @onClick="onTagTableClick" :current.sync="currentTagPage" :data="tagData" :columns="tagTableColumns" :isLoading="isTagTableLoading" :dataNum="tagDataNum"></super_table>
            </Card>
            <Card :bordered="false" style="width:432px">
              <div slot="title">
                <Row type="flex" justify="center" align="middle">
                    <Col span="10"><p>预览</p></Col>
                    <Col span="14">
                      <Select @on-change="onShowIdChange" v-model="showId" style="width:200px">
                        <Option v-for="item in canShowData" :value="item.id" :key="item.id">{{item.barCode}}</Option>
                      </Select>
                    </Col>
                </Row>
              </div>
              <e_label v-bind="item" ref="label_canvas" ></e_label>
            </Card>
          </div>
        </div>
    </div>
</template>
<script>
// TODO: tag表格搜索
import super_table from '@/components/table/supertable.vue'
import { getAllGood, updateGood, deleteGood, getBindedTags, getGood, cronUpdate } from '@/api/good'
import { getAllTag, lightTag, flushTag, removeTag, scanTag, statusTag } from '@/api/tag'
import { getAllShop } from '@/api/shop'
import e_label from '@/components/e-label/e-lable.vue'
import { getStyleDisp, getStyle } from '@/api/style'
import store from '@/store'
import { VueContext } from 'vue-context'
import goodTagExpand from '@/components/table/good-tag-expand.vue'
import goodExpand from '@/components/table/good-expand.vue'
import { balance } from '@/api/eweigher'
import { getSystemArgs } from '@/api/systemsetting'
import config from '@/config'
export default {
  components: {
    e_label,
    super_table,
    goodTagExpand,
    VueContext,
    goodExpand
  },
  data () {
    return {
      selectLock: false,
      img: null,
      isOpenEBlance: -1,
      shoplist: [],
      headers: {
        ESLS: store.getters.token
      },
      cronExpr: '',
      cronMode: -1,
      isCronModalShow: false,
      cronFilePath: '',
      isCronSetShow: false,
      uploadMode: -1,
      isUploadShow: false,
      windowWidth: 0,
      isTableLoading: false,
      isTagTableLoading: false,
      editOkLoading: true,
      addOkLoading: true,
      addModal: false,
      dataNum: 0,
      tagDataNum: 0,
      countPerPageGood: 7,
      countPerPageTag: 3,
      goodData: [],
      tagData: [],
      tableColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          indexMethod: (row) => {
            return row._index + 1 + (this.currentPage - 1) * this.countPerPageGood
          }
        },
        {
          title: '商品条码',
          key: 'barCode',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '商品名称',
          key: 'name',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '原价',
          key: 'price',
          width: '80',
          render: (h, params) => {
            let t = params.row.price.toString()
            if (t.indexOf('.') === -1) {
              t = t + '.00'
            } else {
              if (t.split('.')[1].length < 2) {
                t = t + '0'
              }
            }
            return h('span', {}, t)
          }
        },
        {
          title: '价格',
          width: '80',
          key: 'promotePrice',
          render: (h, params) => {
            let t = params.row.promotePrice.toString()
            if (t.indexOf('.') === -1) {
              t = t + '.00'
            } else {
              if (t.split('.')[1].length < 2) {
                t = t + '0'
              }
            }
            return h('span', {}, t)
          }
        },
        {
          title: '是否促销',
          width: '90',
          key: 'isPromote',
          render: (h, params) => {
            var that = this
            return h('i-switch', {
              props: {
                value: params.row.isPromote === 1,
                disabled: !this.hasGoodAccess
              },
              on: {
                'on-change': (val, $event) => {
                  event.stopPropagation()
                  if (val) {
                    params.row.isPromote = 1
                  } else {
                    params.row.isPromote = 0
                  }
                  that.currentSelectedRow = params.row
                  updateGood(params.row).then(res => {
                    getBindedTags({ queryId: 'barCode', queryString: params.row.barCode }).then(res => {
                      that.tagData = res.data.data.slice(0, that.countPerPageTag)
                      if (that.tagDataNum.length === 0) {
                        return
                      }
                      that.canShowData = that.tagData.filter(function (item, index) {
                        if (item.styleId === 0) {
                          return false
                        }

                        getStyle(item.style.styleNumber, params.row.isPromote).then(r => {
                          item.styleId = r.data.data.id
                        })
                        return true
                      })

                      if (that.canShowData.length === 0) {
                        this.$refs.label_canvas.initData(null, 0, 0, null)
                      } else {
                        that.getLabelData(that.canShowData[0])
                      }
                    })
                  })
                }
              }
            })
          }
        },
        {
          title: '促销原因',
          key: 'promotionReason',
          render: (h, params) => {
            let t = ''
            if (params.row.promotionReason !== null) {
              t = params.row.promotionReason.toString()
            }
            if (params.row.isPromote === 1) { return h('span', {}, t) } else { return h('span', {}, '') }
          }
        },
        {
          title: '店铺',
          key: 'shopNumber',
          width: '140'
        },
        {
          title: '货号',
          width: '100',
          key: 'shelfNumber',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '数量',
          width: '50',
          key: 'computeNumber',
          render: (h, params) => {
            let num = params.row.computeNumber == null ? 0 : params.row.computeNumber
            return h('span', {}, num)
          }
        },
        {
          title: '二维码',
          key: 'qrCode',
          filter: {
            type: 'Input'
          }
        },
        {
          title: '绑定状态',
          width: '120',
          render: (h, params) => {
            const row = params.row
            const color = row.tagIdList.length !== 0 ? 'primary' : 'error'
            const text = row.tagIdList.length !== 0 ? '已绑' : '未绑'
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '更新状态',
          key: 'waitUpdate',
          width: '140',
          render: (h, params) => {
            const row = params.row
            const color = row.waitUpdate === 1 ? 'primary' : 'error'
            const text = row.waitUpdate === 1 ? '已经更新' : '等待更新'

            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '操作',
          key: 'action',
          width: '80',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: !this.hasGoodAccess
                },
                style: {
                  margin: '2px'
                },
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    let temp = this.goodData.find(function (item) { return item.barCode === params.row.barCode })
                    this.remove(temp.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      tagTableColumns: [
        {
          type: 'expand',
          width: 30,
          render: (h, params) => {
            return h(goodTagExpand, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '价签条码',
          key: 'barCode',
          width: '120'
        },
        {
          title: '价签类型',
          width: '110',
          render: (h, params) => {
            let size = ''
            let type = ''
            if (params.row.resolutionWidth === '212' || params.row.resolutionWidth === '250') {
              size = '2.13寸'
            } else if (params.row.resolutionWidth === '400') {
              size = '4.2寸'
            } else if (params.row.resolutionWidth === '296') {
              size = '2.9寸'
            }
            if (params.row.screenType.indexOf('三色') !== -1) {
              type = '三色'
            } else {
              type = '黑白'
            }
            return h('p', size + type + '屏')
          }
        },
        {
          title: '店铺',
          key: 'shopNameAndShopNumber'
        },
        {
          title: 'AP/信道',
          width: '134',
          key: 'routerBarCodeAndChannelId'
        },
        {
          title: '电量',
          key: 'power',
          width: '70'
        },
        {
          title: 'AP RSSI',
          key: 'apRssi',
          width: '70',
          render: (h, params) => {
            let color = '#515a6e'
            if (params.row.apRssi < -70) {
              color = 'red'
            }
            return h('div', {
              attrs: {
                style: 'color: ' + color
              }
            }, params.row.apRssi)
          }
        },
        {
          title: 'Tag RSSI',
          key: 'tagRssi',
          width: '70',
          render: (h, params) => {
            let color = '#515a6e'
            if (params.row.tagRssi < -70) {
              color = 'red'
            }
            return h('div', {
              attrs: {
                style: 'color: ' + color
              }
            }, params.row.tagRssi)
          }
        },
        {
          title: '通讯状态',
          width: '116',
          key: 'isWorking',
          render: (h, params) => {
            let row = params.row
            let isWorking = row.execTime === '' || row.completeTime === ''
            let color = !isWorking ? 'primary' : 'error'
            let text = !isWorking ? '正常' : '超时'

            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '使用状态',
          key: 'forbidState',
          width: '116',
          render: (h, params) => {
            const row = params.row
            const color = row.forbidState === 1 ? 'primary' : 'error'
            const text = row.forbidState === 1 ? '启用' : '禁用'

            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '等待变价',
          key: 'waitUpdate',
          width: '140',
          render: (h, params) => {
            const row = params.row
            const color = row.waitUpdate === 1 ? 'primary' : 'error'
            const text = row.waitUpdate === 1 ? '已经更新' : '等待更新'

            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '操作',
          key: 'action',
          width: '70',
          align: 'center',
          render: (h, params) => {
            let isCalOpen = params.row.goodIsComputeOpen
            let temp = this.tagData.find(function (item) { return item.barCode === params.row.barCode })
            let data = {}
            let tparams = {}
            let items = []
            tparams = {}
            this.$set(tparams, 'query', 'id')
            this.$set(tparams, 'queryString', temp.id)
            items.push(tparams)
            this.$set(data, 'items', items)
            let listitem = [
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送闪灯命令')
                    lightTag(data, 1, 0).then(res => {
                      this.tagReload()
                    }).catch(e => {
                      this.tagReload()
                    })
                  }
                }
              }, '闪灯'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送熄灯命令')
                    lightTag(data, 0, 0).then(res => {
                      this.tagReload()
                    }).catch(e => {
                      this.tagReload()
                    })
                  }
                }
              }, '熄灯'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送刷屏命令')
                    flushTag(data, 0).then(res => {
                      this.tagReload()
                    }).catch(e => {
                      this.tagReload()
                    })
                  }
                }
              }, '刷屏'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送巡检命令')
                    scanTag(data, 0).then(res => {
                      this.tagReload()
                    }).catch(e => {
                      this.tagReload()
                    })
                  }
                }
              }, '巡检'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送禁用命令')
                    statusTag(data, 0).then(res => {
                      this.tagReload()
                    }).catch(e => {
                      this.tagReload()
                    })
                  }
                }
              }, '禁用'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送启用命令')
                    statusTag(data, 1).then(res => {
                      this.tagReload()
                    }).catch(e => {
                      this.tagReload()
                    })
                  }
                }
              }, '启用'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    var that = this
                    this.$Modal.confirm({
                      title: '警告',
                      content: '确定移除该价签吗？',
                      onOk: function () {
                        removeTag(data, 0).then(res => { that.getTagTableData({ page: that.currentTagPage - 1, count: that.countPerPage }) }).catch(e => { that.tagReload() })
                      }
                    })
                  }
                }
              }, '移除')
            ]
            let dzcListItem = [
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送获取计量数据命令')
                    balance(0, data).then(res => this.tagReload())
                  }
                }
              }, '获取计量数据'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送电子秤置零命令')
                    balance(1, data).then(res => this.tagReload())
                  }
                }
              }, '电子秤置零'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送电子秤去皮命令')
                    balance(2, data).then(res => this.tagReload())
                  }
                }
              }, '电子秤去皮'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送获取电子秤电量命令')
                    balance(3, data).then(res => this.tagReload())
                  }
                }
              }, '获取电子秤电量'),
              h('DropdownItem', {
                nativeOn: {
                  click: (name) => {
                    this.$Message.info('发送清空计量数据命令')
                    balance(4, data).then(res => this.tagReload())
                  }
                }
              }, '清空计量数据')
            ]
            if (!this.hasBaseTagAccess) {
              listitem.splice(0, 4)
              if (!this.hasHighTagAccess) {
                listitem.splice(0, 3)
              }
            } else {
              if (!this.hasHighTagAccess) {
                listitem.splice(3, 3)
              }
            }
            return h('div', [
              h('Dropdown', {
                props: {
                  trigger: 'click',
                  transfer: true
                }
              }, [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: (listitem.length === 0)
                  }
                }, '操作'),
                h('DropdownMenu', {
                  slot: 'list'
                }, listitem)
              ]),
              h('Dropdown', {
                props: {
                  trigger: 'click',
                  transfer: true
                }
              }, [
                h('Button', {
                  style: {
                    marginTop: '5px',
                    display: this.isOpenEBlance === 1 || this.isOpenEBlance === 2 ? 'inline-block' : 'none'
                  },
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: !this.hasHighTagAccess || !isCalOpen
                  }
                }, '计量'),
                h('DropdownMenu', {
                  slot: 'list'
                }, dzcListItem)
              ])
            ])
          }
        }

      ],
      editModal: false,
      currentSelectedRow: {},
      addGooddata: {
        barCode: '默认条形码',
        category: '默认种类',
        id: 0,
        imageUrl: '',
        name: '默认名字',
        operator: '默认操作员',
        origin: '默认产地',
        price: 0,
        promotePrice: 0,
        promotionReason: '默认促销理由',
        provider: '默认供应商',
        qrCode: '默认二维码',
        shopNumber: '',
        regionNames: '',
        rfu01: '',
        rfu02: '',
        rfus01: '',
        rfus02: '',
        shelfNumber: '默认货号',
        spec: '默认规格',
        status: 0,
        unit: '默认单位',
        stock: 0,
        waitUpdate: 0,
        isComputeOpen: 0,
        weightSpec: 0,
        replenishNumber: 0
      },
      currentPage: 1,
      currentTagPage: 1,
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
        itemProvider: '',
        itemImgUrl: '',
        rfu01: '',
        rfu02: '',
        rfus01: '',
        rfus02: ''
      },
      canShowData: [],
      showId: 0,
      queryId: null,
      queryString: null
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
    getAllShop({ page: 0, count: 100 }).then(res => {
      this.shoplist = res.data.data
      if (store.getters.shopId !== 1) {
        this.shoplist = this.shoplist.filter((item) => {
          console.log(item.id === store.getters.shopId)
          return item.id === store.getters.shopId
        })
      }
    })
    getSystemArgs().then(res => {
      this.isOpenEBlance = res.data.data[0].computeType
    })
  },
  created () {
    this.currentPage = 1
    this.currentTagPage = 1
    this.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPageGood, queryId: this.queryId, queryString: this.queryString })
    this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPageTag })
  },
  computed: {
    upLaodUrl: function () {
      return config.baseUrl.dev + '/good/upload?mode=' + this.uploadMode
    },
    hasBaseTagAccess: () => {
      return store.getters.access.indexOf(3) !== -1
    },
    hasHighTagAccess: () => {
      return store.getters.access.indexOf(5) !== -1
    },
    hasGjAccess: () => {
      return store.getters.access.indexOf(6) !== -1
    },
    hasGoodAccess: () => {
      return store.getters.access.indexOf(7) !== -1
    }
  },
  watch: {
    currentPage () {
      this.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPageGood, queryId: this.queryId, queryString: this.queryString })
    },
    currentTagPage () {
      if (this.selectLock) {
        this.searchTagPage(this.currentTagPage - 1)
      } else {
        this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPageTag })
      }
    }
  },
  methods: {
    onUploadImgSuccess () {
      this.$refs.imgUpload.clearFiles()
    },
    handleUpload (file) {
      this.img = file
      return false
    },
    upload () {
      this.$refs.imgUpload.post(this.img)
      this.img = null
    },
    upLaodImgUrl (query, queryString) {
      return config.baseUrl.dev + '/good/photo?query=' + query + '&queryString=' + queryString
    },
    getUrl () {
      return config.baseUrl.dev
    },
    getWarGoods () {
      this.queryId = 'isReplenish'
      this.queryString = '1'
      this.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPageGood, queryId: this.queryId, queryString: this.queryString })
    },
    downloadGoodsData () {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', config.baseUrl.dev + '/common/database/exportCsvDataFile?tableName=goods')
      xhr.onload = function (a, b) {
        let blob = this.response
        let reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function (e) {
          let a = document.createElement('a')
          a.download = 'goodsData.csv'
          a.href = e.target.result
          a.click()
        }
      }
      xhr.responseType = 'blob'
      xhr.setRequestHeader('ESLS', store.getters.token)
      xhr.send()
    },
    downloadGoodsDataComp () {
      let xhr = new XMLHttpRequest()
      xhr.open('POST', config.baseUrl.dev + '/good/excelComputing')
      xhr.onload = function (a, b) {
        let blob = this.response
        let reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function (e) {
          let a = document.createElement('a')
          a.download = 'goodsDataCom.csv'
          a.href = e.target.result
          a.click()
        }
      }
      xhr.responseType = 'blob'
      xhr.setRequestHeader('ESLS', store.getters.token)
      xhr.send()
    },
    downloadGoodsDataRep () {
      let xhr = new XMLHttpRequest()
      xhr.open('POST', config.baseUrl.dev + '/good/excelWarning')
      xhr.onload = function (a, b) {
        let blob = this.response
        let reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = function (e) {
          let a = document.createElement('a')
          a.download = 'goodsDataWar.csv'
          a.href = e.target.result
          a.click()
        }
      }
      xhr.responseType = 'blob'
      xhr.setRequestHeader('ESLS', store.getters.token)
      xhr.send()
    },
    onUploadSucess () {
      this.isUploadShow = false
      this.$Message.info('上传成功')
      this.goodReload()
    },
    onUploadFail () {
      this.isUploadShow = false
      this.$Message.error('上传失败')
    },
    setCronUpdate () {
      cronUpdate(this.cronExpr, this.cronFilePath, this.cronMode).then(res => {
        this.$Message.info('设置成功')
      })
    },
    onCronIsShow (val) {
      this.isCronModalShow = val
    },
    onCron (data) {
      this.cronExpr = data
    },
    goodReload () {
      this.canShowData = []
      this.showId = 0
      this.$refs.label_canvas.initData(null, 0, 0, this.item)
      this.queryId = null
      this.queryString = null
      this.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPageGood, queryId: this.queryId, queryString: this.queryString })
    },
    tagReload () {
      this.selectLock = false
      this.getTagTableData({ page: this.currentTagPage - 1, count: this.countPerPageTag })
    },
    getTagTableData (page, count) {
      var that = this
      that.isTagTableLoading = true
      getAllTag(page, count).then(res => {
        that.tagDataNum = res.data.code
        const data = res.data.data
        that.tagData = data
        that.isTagTableLoading = false
      })
    },
    getGoodTableData (page, count) {
      var that = this
      that.isTableLoading = true
      getAllGood(page, count).then(res => {
        that.dataNum = res.data.code
        const data = res.data.data
        if (data.length === 0 && that.currentPage > 1) {
          that.currentPage = that.currentPage - 1
          that.getGoodTableData({ page: that.currentPage - 1, count: that.countPerPageGood, queryId: this.queryId, queryString: this.queryString })
        }
        that.goodData = data
        that.isTableLoading = false
      })
    },
    onTableSearch (search) {
      var key = Object.keys(search)
      if (key.length === 0) {
        this.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPageGood })
        this.queryId = null
        this.queryString = null
        return
      }
      var value = search[key]
      this.queryId = key[0]
      this.queryString = value
      if (search) { this.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPageGood, queryId: this.queryId, queryString: this.queryString }) }
    },
    onTableClick (currentRow) {
      if (!this.hasGoodAccess) {
        return
      }
      this.currentSelectedRow = this.goodData.find(function (item) { return item.barCode === currentRow.barCode })
      this.editModal = true
    },
    searchTag (currentRow) {
      this.selectLock = true
      this.currentTagPage = 1
      var that = this
      that.isTagTableLoading = true
      that.currentSelectedRow = currentRow
      getBindedTags({ queryId: 'barCode', queryString: currentRow.barCode }).then(res => {
        that.tagDataNum = res.data.data.length
        const data = res.data.data.slice(0, this.countPerPageTag)
        that.tagData = data
        that.canShowData = data.filter(function (item) {
          return item.styleId !== 0 && item.styleId !== 1
        })
        that.isTagTableLoading = false
        if (that.canShowData.length === 0) {
          this.$refs.label_canvas.initData(null, 0, 0, null)
        } else {
          that.getLabelData(that.canShowData[0])
        }
      })
    },
    searchTagPage (page) {
      var that = this
      that.isTagTableLoading = true
      getBindedTags({ queryId: 'barCode', queryString: that.currentSelectedRow.barCode }).then(res => {
        that.tagDataNum = res.data.data.length
        const data = res.data.data.slice(this.countPerPageTag * page, this.countPerPageTag * (page + 1))
        that.tagData = data
        that.canShowData = data.filter(function (item) {
          return item.styleId !== 0 && item.styleId !== 1
        })
        that.isTagTableLoading = false
        if (that.canShowData.length === 0) {
          this.$refs.label_canvas.initData(null, 0, 0, null)
        } else {
          that.getLabelData(that.canShowData[0])
        }
      })
    },
    onTagTableClick (currentRow) {
      var that = this
      that.isTableLoading = true
      if (currentRow.goodId === '' || currentRow.goodId === 0) {
        that.goodData = []
        that.isTableLoading = false
        return
      }
      getGood(currentRow.goodId).then(res => {
        that.dataNum = res.data.code
        const data = res.data.data
        that.goodData = data
        that.isTableLoading = false
      })
    },
    remove (id) {
      var that = this
      let dId = id
      console.log(id)
      this.$Modal.confirm({
        title: '警告',
        content: '确定删除该商品吗？',
        onOk: function () {
          deleteGood(dId).then(res => {
            that.getGoodTableData({ page: that.currentPage - 1, count: that.countPerPageGood, queryId: this.queryId, queryString: this.queryString })
          })
        }
      })
    },
    asyncEditOK () {
      var that = this
      let t = this.currentSelectedRow.price.toString()
      delete this.currentSelectedRow.imageUrl
      if (t.indexOf('.') === -1) {
        t = t + '.00'
      } else {
        if (t.split('.')[1].length < 2) {
          t = t + '0'
        }
      }
      this.currentSelectedRow.price = t
      let tp = this.currentSelectedRow.promotePrice.toString()
      if (tp.indexOf('.') === -1) {
        tp = tp + '.00'
      } else {
        if (tp.split('.')[1].length < 2) {
          tp = tp + '0'
        }
      }
      this.currentSelectedRow.promotePrice = tp
      this.getLabelData(this.canShowData[0])
      updateGood(that.currentSelectedRow).then(res => { that.editModal = false; that.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPageGood, queryId: this.queryId, queryString: this.queryString }) })
    },
    addGood () {
      this.addModal = true
    },
    asyncAddOK () {
      var that = this
      let t = this.addGooddata.price.toString()
      if (t.indexOf('.') === -1) {
        t = t + '.00'
      } else {
        if (t.split('.')[1].length < 2) {
          t = t + '0'
        }
      }
      this.addGooddata.price = t
      let tp = this.addGooddata.promotePrice.toString()
      if (tp.indexOf('.') === -1) {
        tp = tp + '.00'
      } else {
        if (tp.split('.')[1].length < 2) {
          tp = tp + '0'
        }
      }
      this.addGooddata.promotePrice = tp
      updateGood(that.addGooddata).then(res => { that.addModal = false; that.getGoodTableData({ page: this.currentPage - 1, count: this.countPerPageGood }) })
    },
    getLabelData (tag) {
      var that = this
      let goodInfo = that.goodData.filter(function (item) { return item.barCode === that.currentSelectedRow.barCode })
      if (goodInfo.length === 0) {
        return
      }
      that.item.itemName = goodInfo[0].name
      that.item.itemUnit = goodInfo[0].unit
      that.item.itemNorm = goodInfo[0].spec
      that.item.itemCategory = goodInfo[0].category
      that.item.itemOrigin = goodInfo[0].origin
      that.item.itemNo = goodInfo[0].shelfNumber
      that.item.itemQRCode = goodInfo[0].qrCode
      that.item.itemBarCode = goodInfo[0].barCode
      that.item.itemPrice = goodInfo[0].price
      that.item.itemOnSalePrice = goodInfo[0].promotePrice
      that.item.itemStock = goodInfo[0].stock
      that.item.itemImgUrl = goodInfo[0].imageUrl
      that.item.itemProvider = goodInfo[0].provider
      that.item.rfu01 = goodInfo[0].rfu01
      that.item.rfu02 = goodInfo[0].rfu02
      that.item.rfus01 = goodInfo[0].rfus01
      that.item.rfus02 = goodInfo[0].rfus02

      if (tag === null) {
        return
      }
      getStyleDisp(tag.styleId).then(res => {
        const dispData = res.data.data
        that.$refs.label_canvas.initData(dispData, tag.resolutionWidth, tag.resolutionHeight, that.item)
      })
    },
    onShowIdChange () {
      if (this.showId) {
        let tag = this.canShowData.find(item => item.id === this.showId)
        this.getLabelData(tag)
      }
    },
    onRightClick () {
      this.$Message.info('rbtn')
    },
    rowClass (row, index) {
      if (!store.getters.isWar) {
        return ''
      } else {
        let isReplenish = false
        if (row.isReplenish != null && row.isReplenish === 1) {
          isReplenish = true
        }
        if (isReplenish) {
          return 'replenish-class'
        } else {
          return ''
        }
      }
    }
  }

}
</script>
<style scoped>
.Row{
  margin-bottom: 6px;
}
</style>

<style>
.container{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}
.top{
  flex-shrink: 1;
}
.bottom{
  flex-shrink: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
</style>
