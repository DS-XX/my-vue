<template>
<div class="div">
    <el-form
      :model="form"
      ref="form"
      :rules="form.rules"
      :inline="true"
      label-width="108px"
    >
        <el-table :data="form.tableData"
            :span-method="arraySpanMethod"
            :show-summary="showSummary"
            :border="true"
            :summary-method="getSummaries"
            :row-class-name="tableRowClassName"
            header-row-class-name="tableHeaderClassName"
            ref="dataTable"
            >
            <el-table-column
                prop="skuName"
                label="商品名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="shopName"
                label="要货门店"
                width="180">
            </el-table-column>
            <el-table-column
                prop="saleQty"
                label="本月销量"
                width="180">
            </el-table-column>
            <el-table-column
                prop="auditQty"
                label="审核数量"
                width="180">
                <template slot-scope="scope">
                    <el-form-item v-if="!scope.row.isAll"
                    :prop="'tableData.'+scope.$index+'.auditQty'"
                    :rules="form.rules.auditQty">
                        <el-input v-model="scope.row.auditQty" @input="inputNum(scope.row,scope.$index,scope.column.property)"></el-input>
                    </el-form-item>
                    <span v-else>{{scope.row.auditQty}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="supplier"
                label="供应商"
                width="180">
                <template slot-scope="scope">
                    <el-select v-if="scope.row.isAll" v-model="scope.row.supplier">
                        <el-option 
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column
                prop="auditPrice"
                label="审核金额"
                width="180">
            </el-table-column>
        </el-table>
    </el-form>
    <el-button @click="test">
        测试
    </el-button>
</div>
    
</template>
<script>
export default {
    name: 'newTable',
    data(){
        return{
            options:[],
            showSummary: true,
            form:{
                tableData:[],
                rules:{
                    auditQty:[
                        {required: true, message: '请输入审核数量', trigger: "blur"}
                    ]
                }
            }
        }
    },
    mounted(){
        //获取列表
        this.$api.newTableAPI.list().then(res=>{
            console.log(res)
            this.form.tableData = this.changeArraySpan(res.data)
        })
        //获取供应商下拉
        this.$api.newTableAPI.suppliers().then(res=>{
            console.log(res)
            this.options = res.data
        })
    },
    methods:{
        arraySpanMethod({ row, column, rowIndex, columnIndex }){
            if(columnIndex === 0){
                console.log(row,'this.is.arrrow')
                return [row.rowspan,1]
            }
        }
    ,
    getSummaries(params){
        console.log(1111111111111111111111)
        //data为row
        const {columns,data} = params
        const sums = ['总计']
        // const columnsList = ['shopName','saleQty','auditQty']
        //全部的列字段名
        const columnsList = this.$refs.dataTable.columns.map(item=>item.property).slice(1)
        //需要进行合计的名字
        const qtyColumnsList = ['saleQty','auditQty','auditPrice']
        const priceColumnsList = ['auditPrice']
        //存放需要合计字段名的hash表
        const hash = new Map()
        qtyColumnsList.forEach(item=>{
            hash.set(item,0)
        })
        //将所有的合计行上的数字进行增加
        data.forEach(item=>{
            if(item.isAll){
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
        if(row.isAll){
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
        if(row.isAll){
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
            if(this.form.tableData[i].isAll){
                chanegRow = this.form.tableData[i]
                break
            }
        }
        chanegRow.auditQty = this.summaryQty(chanegRow,i,columnName)
        // 更新合计行
        // this.showSummary=false;
        // this.$nextTick()
        // .then( ()=> {
        //     this.showSummary=true;
        // })
    },
    test(){
        this.$refs.form.validate()
    }
    }
}
</script>
<style scoped lang="less">
.div{
    /deep/.tableHeaderClassName th{
        background: #f4f6fa;
    }
    /deep/.hightLight{
        font-weight: bold;
    }
    /deep/.el-table__footer-wrapper{
        font-weight: bold;
    }
}

</style>