<template>
  <div class="select-goods">
    <div class="button-groups">
      <div>
        <el-button
          class="btn"
          type="primary"
          @click="selectBtnClick"
        >选择门店
        </el-button>
      </div>
      <el-button
        type="text"
        @click="resetTableData">
        清空
      </el-button>
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="0px">
      <el-table
        ref="dataTable"
        :data="form.tableData"
        row-key="id"
        row-class-name="table-row"
        class="table-form-container"
        style="width: 100%"
      >
        <el-table-column
          key="storeName"
          :show-overflow-tooltip="!(stepIndex === 0)"
          min-width="180"
          prop="storeName"
          label="门店名称"
        />
        <el-table-column
          key="merchantName"
          :show-overflow-tooltip="!(stepIndex === 0)"
          min-width="180"
          prop="merchantName"
          label="商户名称"
        />
        <el-table-column
          v-if="operateColor==='orange'"
          key="checkMsg"
          :show-overflow-tooltip="!(stepIndex === 0)"
          min-width="180"
          prop="checkMsg"
          label="异常说明"
        >
          <template slot-scope="scope">
            <span style="color:red">{{ scope.row.checkMsg }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="stepIndex === 0 || stepIndex === 1"
          key="opearation"
          min-width="140"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="font-size: 12px; color: #e24156"
              @click="deleteRow(scope.$index)"
            >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <add-door-drawer
      ref="selectGoods"
      :visible.sync="dialogVisible"
      :row-selection="form.tableData"
      @closeDrawer="dialogVisible = false"
      @submitProduct="saveData"
    />
  </div>
</template>

<script>
import AddDoorDrawer from './add-door-drawer'

export default {
  name: 'GoodConfiguration',
  components: {
    AddDoorDrawer
  },
  props: {
    tagsSelect: {
      type: Array,
      default: () => []
    },
    stepIndex: {
      type: Number,
      default: 1
    },
    reSet: {
      type: Boolean,
      default: false
    },
    priceType: {
      type: Array,
      default: () => []
    },
    editTableData: {
      type: Array,
      default: () => []
    },
    testingForm: {
      type: Boolean,
      default: false
    },
    operateColor: {
      type: String,
      default: ''
    }
  },
  data () {
    const intValidate = (rule, value, callback) => {
      if (value < 0) {
        return callback('不能小于0')
      }
      return callback()
    }

    return {
      autofillShopList: [],
      tableDataClone: [],
      shopSelectLoading: false,
      importDialogVisible: false,
      form: {
        tableData: []
      },
      dialogVisible: false,
      options: [
        {
          value: 1,
          label: '是'
        },
        {
          value: 0,
          label: '否'
        }
      ],
      hasSalePrice: false,
      hasLowestPrice: false,
      hasAssessmentCost: false,
      salePriceList: '',
      lowestPriceList: '',
      assessmentCostList: '',
      // // 店铺列表
      shopOptions: {
        __flag_arr: []
      },
      errorInfo: [],
      shopList: [] // 门店列表
    }
  },
  computed: {
    storeData () {
      return JSON.parse(sessionStorage.getItem('businessstore')) || {}
    }
  },
  watch: {
    stepIndex (val) {
      if (val == 0) {
        this.form.tableData = JSON.parse(JSON.stringify(this.tableDataClone))
      }
    },
    // 添加更多时，进行重置弹窗内容
    reSet: {
      immediate: true,
      handler (val) {
        if (val) {
          this.form.tableData = []
          this.$refs.selectGoods && this.$refs.selectGoods.clearSelection()
          this.$emit('update:reSet', false)
        }
      }
    },
    priceType (val) {
      this.changePriceType(val)
    },
    editTableData (val) {
      this.form.tableData = val
    },
    testingForm () {
      console.log('start testing Form')
      this.handleVaildateAll().then(valid => {
        if (valid) {
          this.$emit('testingFormChange', true)
        } else {
          this.$emit('testingFormChange', false)
        }
      })
    }
  },
  created () {
    // this.fetchShopList()
  },
  methods: {
    // 一键全选
    checkAll (index) {
      const autofillShopList = this.shopList.map((v) => {
        return v.id
      })
      // 表格局部全选
      if (index > 0 || index === 0) {
        this.form.tableData[index].shopIdList = autofillShopList
        return
      }
      // 页面全选
      this.autofillShopList = autofillShopList
    },
    // 取消勾选
    unCheckAll (index) {
      // 表格局部全选
      if (index > 0 || index === 0) {
        this.form.tableData[index].shopIdList = []
        return
      }
      this.autofillShopList = []
    },
    // 关闭弹窗
    onDialogClose () {
      this.autofillShopList = []
      this.importDialogVisible = false
    },
    // 下一步点击之后,通过校验后执行该事件获取库存数量
    async nextStepHandle () {
      this.tableDataClone = JSON.parse(JSON.stringify(this.form.tableData))
      this.$emit('change', this.form.tableData)
    },
    // 渠道变化时,设置店铺列表, 为了用户体验, 对默认值进行优化
    // 选择按钮触发事件
    selectBtnClick () {
      if (!(this.tagsSelect?.length > 0)) {
        this.$emit('checkSelectTags')
        this.$message.error('请选择门店标签')
        return
      }
      this.dialogVisible = true
      // this.$refs.selectGoods &&
      //   this.$refs.selectGoods.setSelected(this.form.tableData)
    },
    // 删除行事件
    deleteRow (index) {
      this.form.tableData.splice(index, 1)
    },
    validForm () {
      let validResult = false
      this.$refs.form.validate((valid) => {
        validResult = valid
      })
      return validResult
    },
    // 确定
    saveData (data) {
      // console.log(this.form.tableData,'this.form.tableData')
      // console.log(data,'datadata')
      // let newData = []
      let long = this.form.tableData.length
      this.form.tableData = data.map(item => {
        for (var i = 0; i < long; i++) {
          if (item.id === this.form.tableData[i].id) {
            return this.form.tableData[i]
          }
        }
        // 防止获取的lowestPrice为0的时候，提交上去的参数为null
        // item.lowestPrice = item.lowestPrice+''
        // item.assessmentCost = item.assessmentCost+''
        // 导入的商品不需要原来的价格，置为空
        // item.salePrice = ''
        // item.lowestPrice = ''
        // item.assessmentCost = ''
        // 下面返回一个新的对象，避免这个对象使用和原来返回的对象共用一个地址
        // 有些属性没有的话，不能进行v-model的绑定
        // 也可以在传过来的对象上增加新的属性，进行v-model的绑定
        // return Object.assign({},item)
        return {
          ...item,
          salePrice: '',
          lowestPrice: '',
          assessmentCost: ''
        }
        // return item
      })
      // this.$set(this.form, 'tableData', tableData)

      // console.log(this.form.tableData,'this.form.tabledata')
      // console.log(newData,'newData')
      // this.form.tableData = this.form.tableData.concat(newData)

      // this.form.tableData = [
      //   ...data.map((item) => {
      //     return {
      //       ...item,
      //       shopIdList: [],
      //     }
      //   }),
      // ]
      // this.$emit('change', this.form.tableData)
      this.dialogVisible = false
    },
    // 导入处理
    importExcel (payload) {
      if (Array.isArray(this.autofillShopList)) {
        this.form.tableData?.forEach(
          (item) => (item.shopIdList = this.autofillShopList),
        )
      }
      this.autofillShopList = []
      this.importDialogVisible = false
    },
    handleImportSuccess (data) {
      this.importLoading = true,
      this.$nextTick(() => {
        this.submitForm(data)
      })
    },

    changePriceType (val) {
      let hasSale = false
      let hasLowest = false
      let hasAssess = false
      val.forEach(item => {
        if (item.length === 3) {
          hasSale = true
        } else if (item.length === 4) {
          hasAssess = true
        } else if (item.length === 5) {
          hasLowest = true
        }
      })
      this.hasSalePrice = hasSale
      this.hasLowestPrice = hasLowest
      this.hasAssessmentCost = hasAssess
    },
    cancelSale () {
      this.$refs.salePriceVisible.showPopper = false
    },
    cancelAssess () {
      this.$refs.assessmentCostVisible.showPopper = false
    },
    cancelLowest () {
      this.$refs.lowestPriceVisible.showPopper = false
    },
    changeSalePriceList () {
      const newPrice = this.dealInputPrice(this.salePriceList)
      if (String(newPrice).length > 0) {
        this.form.tableData.forEach(item => {
          item.salePrice = newPrice
        })
      }
    },
    changeAssessmentCostList () {
      const newPrice = this.dealInputPrice(this.assessmentCostList)
      if (String(newPrice).length > 0) {
        this.form.tableData.forEach(item => {
          item.assessmentCost = newPrice
        })
      }
    },
    changeLowestPriceList () {
      const newPrice = this.dealInputPrice(this.lowestPriceList)
      if (String(newPrice).length > 0) {
        this.form.tableData.forEach(item => {
          item.lowestPrice = newPrice
        })
      }
    },
    dealInputPrice (value) {
      let firstPoint = true
      let newValue = ''
      let afterPoint = 0
      for (let i of value) {
        if (afterPoint >= 2) break
        if ((i >= '0' && i <= '9') || (firstPoint && i == '.')) {
          newValue += i
          if (!firstPoint) {
            afterPoint++
          }
          if (i == '.') {
            firstPoint = false
          }
        }
      }
      return newValue
    },
    resetTableData () {
      this.form.tableData = []
    },
    // getSkuIdList(){
    //   let list = []
    //   if(this.form.tableData.length>0){
    //     this.form.tableData.forEach(item=>{
    //       list.push(item.skuId)
    //     })
    //   }
    //   return list
    // },
    // 校验全部form表单
    handleVaildateAll () {
      const forms = this.handleVaildateToPrimise(
        this.$refs.form
      )
      return new Promise((resolve, reject) => {
        Promise.all(forms).then(valid => {
          resolve(valid.every(el => !!el))
        })
      })
    },
    // 将单个form表单嵌套Promises
    handleVaildateToPrimise (...arg) {
      return arg.reduce((pre, next) => {
        if (typeof next !== null && typeof next === 'object' && next.validate) {
          pre.push(
            // 返回数据校验结果
            new Promise(resolve => {
              next.validate(resolve)
            })
          )
        }
        return pre
      }, [])
    },
    ArrayBufferTransToObject (data) {
      var enc = new TextDecoder('utf-8')
      var uint8_msg = new Uint8Array(data)
      return JSON.parse(enc.decode(uint8_msg))
    },
    // 这个似乎更快点,但是中文是乱码
    ArrayBufferTransToObject2 (data) {
      // data是ArrayBuffer
      // 将其转换为uint8字节流
      var uint8_msg = new Uint8Array(data)
      // 解码成字符串
      var decodedString = String.fromCharCode.apply(null, uint8_msg)
      // parse,转成json数据
      return JSON.parse(decodedString)
    }
  }
}
</script>
<style lang="less" scoped>
.select-goods {
  .button-groups {
    margin-bottom: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .btn {
      padding: 7px 10px;
      font-size: 12px;
      min-width: 70px;
      border-radius: 4px;
    }
  }

  .hidden {
    visibility: hidden;
  }
}
</style>
<style lang="less">

.select-goods {
  .table-row {
    td {
      padding-bottom: 0;

      & > div {
        padding-bottom: 18px;
      }
    }
  }

  .el-table__row {
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .stock-type {
    width: 98px;
  }

  .stock-num-input {
    width: 100px;
    margin-left: 10px;
  }

  .table-form-container {
    .cell {
      display: flex;
    }
  }

  .price-box {
    width: 98px;
  }
}

.el-option-store {
  width: 100%;
  height: 36px;
}
.check-all {
  position: absolute;
  left: 0;
  bottom: 0px;
  text-align: center;
  font-size: 16px;
  line-height: 36px;
  color: #eb6c00;
  background: #fff;
  width: 100%;
  cursor: pointer;
}
.popDiv{
  .topTitle{
    margin-bottom: 10px;
  }
  .middleInput{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 10px;
    div{
      flex: 1;
    }
    input{
      width: 100%;
      background-color: #FFF;
      background-image: none;
      border-radius: 4px;
      border: 1px solid #DCDFE6;
      box-sizing: border-box;
      color: #606266;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      outline: 0;
      padding: 0 5px;
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    }
  }
  .bottomClick{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
}

</style>
