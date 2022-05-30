<template>
  <div style="padding:20px">
    <div style="font-size:20px;font-weight:bolder;margin-bottom:15px;color:black">{{ batchTitle }}标签</div>
    <hr style="height:1px;border:none;border-top:1px solid #EAEAEA;margin-bottom:1em">
    <p class="stepStyle">第①步：请选择需要<span class="red">{{ batchTitle }}</span>的<span class="orange">标签</span></p>
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="100px"
      style="marginBottom:60px">
      <el-form-item
        v-model="form.tags"
        label="门店标签："
        prop="tags">
        <tags-cascader
          :type="1"
          :mutex="operateColor=='red'?false:true"
          label="name"
          children-name="tagInfoList"
          option-value="id"
          @input="changeTags"/>
      </el-form-item>
    </el-form>
    <p class="stepStyle">第②步：请选择需要<span class="red">{{ batchTitle }}</span>此标签的<span class="orange">门店</span></p>
    <p
      v-if="operateColor==='orange'"
      class="red smallSize stepStyle">说明：同一标签组下的标签，将被自动替换</p>
    <select-door-add-tags
      ref="selectDoorRef"
      :tags-select="form.tags"
      :operate-color="operateColor"
      @checkSelectTags="checkSelectTags"/>
    <div
      v-if="pageType!=='view'"
      class="buttons_group">
      <el-button
        :loading="nextStepLoading"
        type="primary"
        size="small"
        @click="submitPrice"
      >提交</el-button>
      <el-button
        size="small"
        @click="goBack"
      >取消</el-button
      >
    </div>
  </div>
</template>
<script>
import SelectDoorAddTags from './components/select-door-add-tags.vue'
import tagsCascader from '@/components/tags-cascader'
import {batchAddTags,batchDeleteTags} from '../../services/door-tags'

export default {
    name: 'BatchChangeTags',
    components: {
      tagsCascader,
      SelectDoorAddTags
    },
    data(){
        return{
            batchTitle: '',
            operateColor: '',
            form:{
                tags:[]
            },
            rules:{
                tags: [
                    { required: true, message: '请选择门店标签', trigger: 'blur' },
                ],
            }
        }
    },
    mounted(){
        const operate = this.$route.query.operate
            if(operate==='add'){
                this.batchTitle = '批量添加'
                this.operateColor = 'orange'
            }
            else{
                this.batchTitle = '批量删除'
                this.operateColor = 'red'
            }
    },
    methods:{
        changeTags(val){
            this.form.tags = val
        },
        saveData(val){
            console.log(val,'this.isval')
        },
        submitPrice(){
            this.checkSelectTags().then(valid=>{
                if(valid){
                    const data = this.$refs.selectDoorRef.$refs.dataTable.data
                    const storeIdList = data.map(item=>{
                        return item.id
                    })
                    if(this.operateColor === 'red'){
                        const h = this.$createElement;
                        this.$msgbox(
                            {
                            title: '提示',
                            message:
                            h('div', null, [
                                h('p',null,[
                                    h('span', null , '提交后，所选的门店将'),
                                    h('span', {style: 'color:#EB6C00'}, '批量删除'),
                                    h('span', null , '所选的门店标签。'),
                                ]),
                                h('p',null,'是否确定提交？')
                            ]),
                            showCancelButton: true,
                            cancelButtonText: '取消',
                            confirmButtonText: '确定',
                            })
                        .then(()=>{
                            const params = {
                                storeIdList,
                                tagIdList: this.form.tags
                            }
                            batchDeleteTags(params).then(res=>{
                                if(res?.payload?.isSuccess){
                                    this.$message.success('批量删除标签成功')
                                    this.goBack()
                                }
                            })
                        })
                    }
                    else{
                        const params = {
                            storeIdList,
                            tagIdList: this.form.tags
                        }
                        batchAddTags(params).then(res=>{
                            if(res?.payload?.isSuccess){
                                this.$message.success('批量添加标签成功')
                                this.goBack()
                            }
                            else{
                                this.$refs.selectDoorRef.$refs.dataTable.data = res.payload.tagCheckMsgList.map(item=>{
                                    return {
                                        ...item,
                                        id: item.storeId
                                    }
                                })
                            }
                        })
                    }
                }
            })
        },
        checkSelectTags(){
            return this.$refs.form.validate()
        },
        goBack(){
            this.$history.goBack()
        }
    }

}
</script>
<style scoped lang="less">
.orange{
    color: #eb6c00;
}
.red{
    color:red;
}
.stepStyle{
    margin-bottom: 20px;
}
.smallSize{
    font-size: 12px;
}
.buttons_group {
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f4f6fa;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 100px;
    z-index: 100;
}
</style>
