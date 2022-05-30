<!--添加商品抽屉组件-->
<template>
  <div class="add-product-drawer">
    <el-drawer
      :visible="visible"
      :size="size"
      title="添加门店"
      custom-class="el-drawer-custom"
      @close="closeDrawer"
    >
      <div class="goods-table">
        <!-- <el-radio-group v-model="activeName">
          <el-radio-button label="标准商品">标准商品</el-radio-button>
          <el-radio-button label="组合商品">组合商品</el-radio-button>
        </el-radio-group> -->
        <div class="total-text">
          当前已选择
          <span class="total-text-color">{{ selectedNumber }}</span>
          项
        </div>
        <el-data-table
          ref="dataTable"
          v-bind="tableConfig"
          :extra-query="extraQuery"
          @update="dataFormatter"
          @selection-change="onSelectionChange"
        />
      </div>
      <div class="buttons-group">
        <el-button @click="closeDrawer">取消</el-button>
        <el-button type="primary" @click="submitProduct">确认</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  getDoorListUrl,
} from '../../../services/door-tags'
import merchantList from './merchantList'
import {RadioButton, Select} from 'element-ui'
export default {
  components: {
    ElRadioButton: RadioButton,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    size: {
      type: [Number, String],
      default: '50%',
    },

    extraQuery: {
      type: Object,
      default: () => {
        return {
          // itemType: 1,
        //   needProperties: true,
        //   disabled: false
          // status: 1,
        }
      },
    },
    selectedSkuId: {
      type: Array,
      default: () => [],
    },
    rowSelection:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeName: '标准商品',
      selected: [],
      rawData: [], // 未经格式化的接口数据
      fakeRowSelection:[],
      id: 'id',
      tableConfig: {
        url: getDoorListUrl,
        hasDialog: false,
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        hasOperation: false,
        persistSelection: true,
        id: 'id',
        saveQuery: false,
        searchForm: [
          {
            // type: 'select',
            id: 'merchantIdList',
            component: merchantList,
            label: '',
            el: {
              placeholder: '商户名称',
              clearable: true,
              'prefix-icon': 'el-icon-search',
            },
          },
          {
            type: 'input',
            id: 'storeName',
            label: '',
            el: {
              placeholder: '门店名称',
              clearable: true,
              'prefix-icon': 'el-icon-search',
            },
          },
        ],
        columns: [
          {
            type: 'selection',
            // selectable: row => {
            //   if (this.fakeRowSelection.length > 0) {
            //     return !this.fakeRowSelection.some(i => {
            //       console.log(this.fakeRowSelection,'this.selectedSkuid')
            //       return row[this.id] === i
            //     })
            //   }
            //   return true
            // },
          },
          {
            prop: 'storeName',
            label: '门店名称',
            minWidth: 180,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'merchantName',
            label: '商户名称',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
        ],
      },
    }
  },
  computed: {
    selectedNumber() {
      return (this.selected && this.selected.length) || 0
    },
    rawSelected() {
      // 未经格式化的选中项
      return this.selected.map(item => {
        return this.rawData.find(rawItem => rawItem[this.id] === item[this.id])
      })
    },
  },
  watch: {
    extraQuery: {
      handler(val) {
        if (val) {
          this.tableConfig.extraQuery = {
            ...this.tableConfig.extraQuery,
            ...val,
          }
        }
      },
      immediate: true,
    },
    visible:{
      handler(val){
          if(val){
            const tableData = this.$refs.dataTable.data
            this.rowSelectJudg(tableData)
          }
      },
      deep:true,
    },
    rowSelection(val){
      this.fakeRowSelection = val
    }
  },
  mounted() {
    //?itemType=1
    // this.tableConfig.url = `${getDoorListUrl}`
  },
  methods: {
    closeDrawer() {
      this.$emit('closeDrawer')
    },
    submitProduct() {
      this.updateFakeSelect()
      // this.$emit('submitProduct', this.selected, this.rawSelected)
      const trueSelect = []
      this.fakeRowSelection.forEach(item=>{
        if(!item.noSelect){
          trueSelect.push(item)
        }
      })
      this.$emit('submitProduct',trueSelect)
      this.closeDrawer()
    },
    dataFormatter(val) {
      this.rawData = val
      this.rowSelectJudg(val)
      this.updateFakeSelect()
    //   const newData = val.map(item => {
    //     return {
    //       // ...item, // 整个sku
    //       systemGoodName: item.item && item.item.name,
    //       systemGoodCode: item.item && item.item.code,
    //       systemGoodSKU: item.sku && item.sku.code,
    //       skuName: item.sku && item.sku.skuName,
    //       categoryName: item.item && item.item.categoryName,
    //       chineseName: item.item && item.item.chineseName,
    //       lowestPrice: item.sku.lowestPrice && item.sku.lowestPrice.price,
    //       assessmentCost: item.sku.assessmentCost && item.sku.assessmentCost.price,
    //       price: item.sku && item.sku.price,
    //       skuId: item.sku && item.sku.id,
    //       itemId: item.item && item.item.id,
    //       // shopCode: '10086', // 暂时写死
    //       automaticShelvesDown: 0,
    //       automaticShelvesUp: 0,
    //     }
    //   })
      const newData = [...val]
      this.$refs.dataTable && (this.$refs.dataTable.data = newData)
    },
    onSelectionChange(val) {
        this.selected = [...val]
    },
    clearSelection() {
      // 重置选中
      this.$refs.dataTable && this.$refs.dataTable.clearSelection()
    },
    setSelected(data) {
      if (this.$refs.dataTable) {
        this.$set(this.$refs.dataTable, 'selected', [...data])
      }
    },
    rowSelectJudg(tableData){
      this.clearSelection();
      // if(this.fake.length>0){
      //   this.rowSelection.forEach(row => {
      //     for(let i of tableData){
      //       if(row.skuId === i.skuId){
      //         this.$refs.dataTable.toggleRowSelection(i)
      //         break
      //       }
      //     }
      //   });
      // }
      if(this.fakeRowSelection.length>0){
        this.fakeRowSelection.forEach(row => {
          for(let i of tableData){
            if(row[this.id] === i[this.id] && !row.noSelect){
              this.$refs.dataTable.toggleRowSelection(i)
              break
            }
          }
        });
      }
      else{
          this.clearSelection();
      }
    },
    updateFakeSelect(){
      const tableData = this.$refs.dataTable.data
      const selectLong = this.selected.length
      let fakeTableData = this.fakeRowSelection
      let fakeLong = fakeTableData.length
      let newSelect = []
      this.selected.forEach(item=>{
        item.noSelect = false
        for(var i =0;i<fakeLong;i++){
          if(item[this.id]===fakeTableData[i][this.id]){
            fakeTableData[i].noSelect = false
            break
          }
        }
        if(i>=fakeLong){
          newSelect.push(item)
        }
      })
      let noSelect = []
      tableData.forEach(item=>{
        for(var i =0;i<selectLong;i++){
          if(item[this.id]===this.selected[i][this.id]){
            break
          }
        }
        if(i>=selectLong){
          noSelect.push(item)
        }
      })
      console.log(noSelect,'noSelect')
      noSelect.forEach(item=>{
        for(var i =0;i<fakeLong;i++){
          if(item[this.id]===fakeTableData[i][this.id]){
            fakeTableData[i].noSelect = true
          }
        }
      })
      this.fakeRowSelection = fakeTableData.concat(newSelect)
    }
  },
}
</script>

<style lang="less">
.el-drawer-custom {
  .el-drawer__header {
    color: black;
  }

  .el-drawer__body {
    margin-top: -10px;
    padding: 0 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    // position: relative;

    .goods-table {
      flex: 1;

      .total-text {
        font-size: 12px;
        margin: 10px 0;
      }
      .el-data-table {
        height: calc(100vh - 145px);
        overflow-x: auto;
      }
    }

    .buttons-group {
      bottom: 0;
      right: 0;
      left: 0;
      position: absolute;
      width: 100%;
      // left: 0;
      // bottom: 0;
      // padding: 10px;
      text-align: center;
      background: #f4f6fa;
    }
  }
}
</style>
