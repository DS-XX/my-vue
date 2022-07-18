<template>
<div class="div">
    <el-form
      :model="form"
      ref="form"
      :rules="form.rules"
      :inline="true"
      style="height:100%"
    >
        <el-table 
            :data="form.tableData"
            :span-method="arraySpanMethod"
            :show-summary="showSummary"
            :border="true"
            :summary-method="getSummaries"
            :row-class-name="tableRowClassName"
            header-row-class-name="tableHeaderClassName"
            height="100%"
            ref="dataTable"
            :row-style="{'height': '30px'}"
            :cell-style="{'padding':'9px'}"
            v-loading="loading"
            element-loading-text="正在生成汇总表格，请稍等"
            >
            <el-table-column
                prop="skuName"
                label="商品名称"
                min-width="180"
                fixed
                >
            </el-table-column>
            <el-table-column
                prop="shopName"
                label="要货门店"
                min-width="180"
                fixed
                >
            </el-table-column>
            <el-table-column
                prop="last7DaysSellCount"
                label="近7天销量"
                min-width="180"
                align="right">
            </el-table-column>
            <el-table-column
                prop="thisMonthSellCount"
                label="本月销量"
                min-width="180"
                align="right">
            </el-table-column>
            <el-table-column
                prop="shopStockQty"
                label="门店库存"
                min-width="180"
                align="right">
            </el-table-column>
            <el-table-column
                prop="merchantStockQty"
                label="商户库存"
                min-width="180"
                align="right">
                <template slot-scope="scope">
                    <span v-if="scope.row.isSummary" v-text="scope.row.merchantStockQty"></span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="skuQty"
                label="要货数量"
                min-width="180"
                align="right">
            </el-table-column>
            <el-table-column
                prop="skuVerifyQty"
                label="审核数量"
                min-width="180"
                align="right">
                <template slot="header">
                    <span style="color:red">* </span>审核数量
                </template>
                <template slot-scope="scope"  v-if="viewType!=='view'">
                    <el-form-item v-if="!scope.row.isSummary"
                    :prop="'tableData.'+scope.$index+'.skuVerifyQty'"
                    :rules="form.rules.skuVerifyQty">
                        <el-input v-model="scope.row.skuVerifyQty" @input="inputNum(scope.row,scope.$index,scope.column.property)"></el-input>
                    </el-form-item>
                    <span v-else>{{scope.row.skuVerifyQty}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="supplierName"
                label="供应商"
                min-width="180">
                <template slot="header">
                    <span style="color:red">* </span>供应商
                </template>
                <template slot-scope="scope">
                    <el-form-item v-if="scope.row.isSummary  && viewType!=='view'"
                    :prop="'tableData.'+scope.$index+'.supplierName'"
                    :rules="form.rules.supplierName">
                        <el-select v-model="scope.row.supplierName">
                            <el-option 
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <span v-else-if="scope.row.isSummary && viewType==='view'" v-text="scope.row.purchasePrice"></span>
                    <span v-else>
                        --
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="purchasePrice"
                label="采购价"
                min-width="180"
                align="right">
                <template slot="header">
                    <span style="color:red">* </span>采购价
                </template>
                <template slot-scope="scope">
                    <el-form-item v-if="scope.row.isSummary && viewType!=='view'"
                    :prop="'tableData.'+scope.$index+'.purchasePrice'"
                    :rules="form.rules.purchasePrice">
                        <el-input v-model="scope.row.purchasePrice"></el-input>
                    </el-form-item>
                    <span v-else-if="scope.row.isSummary && viewType==='view'" v-text="scope.row.purchasePrice"></span>
                    <span v-else>
                        --
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="purchaseVerifyPrice"
                label="审核金额"
                min-width="180"
                align="right">
                <template slot-scope="scope">
                    <span v-if="scope.row.isSummary" v-text="scope.row.purchaseVerifyPrice"></span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="purchaseRequestOrderRemark"
                label="要货备注"
                min-width="180"
                >
                <template slot-scope="scope" v-if="viewType !== 'view'">
                   <el-form-item v-if="scope.row.isSummary"
                    :prop="'tableData.'+scope.$index+'.purchaseRequestOrderRemark'"
                    :rules="form.rules.purchaseRequestOrderRemark">
                        <el-input v-model="scope.row.purchaseRequestOrderRemark"></el-input>
                    </el-form-item>
                </template>
            </el-table-column>
        </el-table>
    </el-form>
</div>
    
</template>
<script>
export default {
    name: 'newTable',
    props: {
        viewType: {
            type: String,
            default: ""
        }
    },
    data(){
        return{
            options:[],
            showSummary: true,
            loading: false,
            form:{
                tableData:[],
                rules:{
                    skuVerifyQty:[
                        {required: true, message: '请输入审核数量', trigger: "blur"}
                    ],
                    supplierName:[
                        {required: true, message: '请选择供应商', trigger: "change"}
                    ],
                    purchasePrice:[
                        {required: true, message: '请输入采购价', trigger: "blur"}
                    ],
                }
            }
        }
    },
    mounted(){
        //获取列表
        this.loading = true
        this.$api.newTableAPI.list().then(res=>{
            this.form.tableData = this.changeArraySpan(res.data)
            this.loading = false
        })
        //获取供应商下拉
        this.$api.newTableAPI.suppliers().then(res=>{
            this.options = res.data
        })
    },
    updated(){
        this.$nextTick(() => {
            console.log(1111111111111)
            this.$refs.dataTable.doLayout()
        })
    },
    methods:{
        arraySpanMethod({ row, column, rowIndex, columnIndex }){
            if(columnIndex === 0){
                return [row.rowspan,1]
            }
        }
    ,
    getSummaries(params){
        //data为row
        const {columns,data} = params
        const sums = ['总计']
        // const columnsList = ['shopName','saleQty','auditQty']
        //全部的列字段名
        const columnsList = this.$refs.dataTable?.columns.map(item=>item.property).slice(1) || []
        //需要进行合计的名字
        const qtyColumnsList = ['last7DaysSellCount','thisMonthSellCount','shopStockQty','merchantStockQty','skuQty','skuVerifyQty','purchaseVerifyPrice']
        const priceColumnsList = ['purchaseVerifyPrice']
        //存放需要合计字段名的hash表
        const hash = new Map()
        qtyColumnsList.forEach(item=>{
            hash.set(item,0)
        })
        //将所有的合计行上的数字进行增加
        data.forEach(item=>{
            if(item.isSummary){
                qtyColumnsList.forEach(column=>{
                    const pre = hash.get(column)
                    if(priceColumnsList.includes(column)){
                        hash.set(column,Number(pre+Number(`${item[column]}`.replaceAll(',',''))))
                    }
                    else{
                        hash.set(column,Number(pre+Number(item[column])))
                    }
                })
            }
        })
        console.log(hash,'hash')
        //遍历所有的列，如果hash表上有就显示值，没有显示空
        for(let i of columnsList){
            if(hash.has(i)){
                if(priceColumnsList.includes(i)){
                    sums.push(hash.get(i).toLocaleString()+'.00')
                }
                else{
                    sums.push(hash.get(i))
                }
            }   
            else{
                sums.push('')
            }
        }
        return sums
    },
    summaryQty(row,index,columnName){
        if(row.isSummary){
            //从list中向前遍历数据计算合计
            const {skuCode} = row
            let sum = 0
            for(let i=index-1;i>=0;i--){
                //如果skuCode不同时，停止计算
                if(skuCode === this.form.tableData[i].skuCode){
                    sum += Number(this.form.tableData[i][columnName])
                }
                else{
                    break
                }
            }
            return sum
        }
    },
    //对获取的表格数据进行处理，设置其rowspan
    changeArraySpan(data){
        let preObj
        let preSkuCode
        let rowspan = 0
        data.forEach(item=>{
            if(item.skuCode !== preSkuCode){
                if(preObj){
                    preObj.rowspan = rowspan
                }
                rowspan = 1
                preSkuCode = item.skuCode
                preObj = item
            }
            else{
                rowspan++
                item.rowspan = 0
            }
        })
        preObj.rowspan = rowspan
        console.log(data,'datadta')
        return data
    },
    tableRowClassName({row,rowIndex}){
        if(row.isSummary){
            return 'hightLight'
        }
        else{
            return ''
        }
    },
    inputNum(row,index,columnName){
        //遍历找到下面的汇总的行的对象地址和index值
        let chanegRow
        let i
        for(i=index+1;i<this.form.tableData.length;i++){
            if(this.form.tableData[i].isSummary){
                chanegRow = this.form.tableData[i]
                break
            }
        }
        chanegRow[columnName] = this.summaryQty(chanegRow,i,columnName)
        // 更新合计行
        // this.showSummary=false;
        // this.$nextTick()
        // .then( ()=> {
        //     this.showSummary=true;
        // })
    },
    }
}
</script>
<style scoped lang="less">
.div{
    height: calc(100vh - 40px);
    /deep/.tableHeaderClassName th{
        background: #f4f6fa;
        color:#605f5f;
    }
    /deep/.hightLight{
        font-weight: bold;
    }
    /deep/.el-table__footer-wrapper{
        font-weight: bold;
    }
    /deep/.el-form-item{
        margin: 0;
    }
}

</style>