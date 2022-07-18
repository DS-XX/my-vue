<template>
    <div>
        <NewTableOld ref="newTable"></NewTableOld>
        <el-row>
            <el-button type="primary" @click="submit">
                提交
            </el-button>
        </el-row>
    </div>
</template>
<script>
import NewTableOld from './newTableOld.vue'
export default {
    name: 'newTable',
    components:{NewTableOld},
    data(){
        return{

        }
    },
    methods:{
        submit(){
            this.$refs.newTable.$refs.form.validate(valid=>{
                if(valid){
                    const params = this.$refs.newTable.form.tableData
                    this.$api.newTableAPI.submitTable(params).then(res=>{
                        if(res.isSuccess){
                            this.$message.success('成功')
                        }
                    })
                    console.log(this.$refs.newTable.form.tableData,11111111)
                }
            })
        }
    }
}
</script>