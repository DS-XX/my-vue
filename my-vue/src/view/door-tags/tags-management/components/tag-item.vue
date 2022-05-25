<template>
  <div
    ref="divRef"
    class="tagLine">
    <div
      v-for="(tag,index) in tags"
      ref="divItem"
      :key="tag.name"
      class="flexItem"
    >
      <el-tooltip
        v-if="index!==showIndex"
        :content="tag.name"
        :disabled="getTextWidth(tag.name)<=limitLong"
        placement="top">
        <el-tag
          :key="tag.name"
          :closable="tagsPermission"
          :disable-transitions="true"
          :type="tag.type"
          size="medium"
          @close="deleteTag(index)"
          @dblclick.native.capture="e=>{
            if(tagsPermission){
              clickdb(index)
            }
        }">
          {{ changeTextToOmit(tag.name) }}
        </el-tag>
      </el-tooltip>
      <el-input
        v-else
        ref="saveTagInput"
        v-model="inputValue"
        class="inputClass"
        maxlength="99"
        @input="changeWidth(index)"
        @blur="blurclear(index)"
      />

    </div>
    <button
      v-if="tagsPermission"
      class="addTags"
      @click="addTags"
    >
      <i class="el-icon-plus"/>
      添加标签
    </button>
    <edit-dialog
      :dialog-table-visible="dialogTableVisible"
      title="添加标签"
      @changeDialogView="changeDialogView"
      @submitValue="addNewTags"
    />
  </div>
</template>
<script>
import editDialog from '../components/edit-dialog'
import {updateTag,createTag,deleteTag} from '.././../../../services/door-tags'

export default {
    name:'TagItem',
    components:{
        editDialog
    },
    props:{
        tags:{
            type: Array,
            default: ()=>[]
        },
        tagsGroup:{
            type: Array,
            default: ()=>{}
        },
        type: {
            type: String,
            default: ''
        }
    },
    data(){
        return{
            showIndex: '',  //第几个显示为输入框
            beforeInputValue: '', //双击tags时的值
            inputValue: '', //tags中的输入框的值
            // inputVisible: false,
            limitLong: 50,   //tagsitem中的最大长度显示...
            minWidth: 20,  //tags中输入框的最小宽度
            maxWidth: 70,  //tags中输入框的最大宽度
            dialogTableVisible: false,
        }
    },
    computed:{
        tagsPermission:()=>{
            return sessionStorage
                  .getItem("buttons")?.includes("tags")
        }
    },
    methods:{
        clickdb (index) {
            // const width = this.$refs.divRef.children[index].offsetWidth
            this.beforeInputValue = this.tags[index].name
            const width = this.getTextWidth(this.tags[index].name)
            this.inputValue = this.tags[index].name
            this.showIndex = index
            this.$refs.divRef.getElementsByClassName('flexItem')[index].style.width = width+50+'px'
            this.$nextTick(() => {
                // const input = this.$refs.saveTagInput[0].$refs.input
                // input.style.width = width
                this.changeInputWidth(width+20)
                // console.log(input.style,'this.isinput')
                this.$refs.saveTagInput[0].$refs.input.focus()
                // this.$refs.divRef.getElementsByClassName('flexItem')[index].style.width = ''
            })
        },
        blurclear (index) {
            if(this.beforeInputValue === this.inputValue){
                this.showIndex = ''
                return
            }
            const params ={
                type: this.type,
                id: this.tags[index].id,
                name: this.inputValue
            }
            updateTag(params).then(res=>{
                if(res?.payload?.isSuccess){
                    this.$message.success('更新标签成功')
                    this.$emit('updateList')
                }
            })
            // if (!this.checkRepeat(index, this.inputValue)) {
            //     this.$message.error('重复名')
            //     return
            // }
            // this.tags[index].name = this.inputValue
            this.showIndex = ''
            this.inputValue = ''
        },
        handleClose (tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
        },
        // 模拟点击最后一个添加按钮变成输入框添加
        // showInput () {
        //     this.inputVisible = true
        //     this.$nextTick(_ => {
        //         this.$refs.saveTagInput.$refs.input.focus()
        //     })
        // },
        // handleInputConfirm () {
        //     let inputValue = this.inputValue
        //     if (inputValue) {
        //         this.tags.push({name: inputValue})
        //     }
        //     this.inputVisible = false
        //     this.inputValue = ''
        // },
        checkRepeat (index, name) {
            for (let i = 0; i < this.tags.length; i++) {
                if (i !== index && this.tags[i].name === name) {
                return false
                }
            }
            return true
        },
        addTags(){
            if(this.tags?.length>=50){
                this.$message.error('每个标签组最多添加50个标签')
                return
            }
            this.changeDialogView(true)
            // this.getTextWidth('添加标签','')
        },
        getTextWidth(text, font) {
        // re-use canvas object for better performance
            var canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement("canvas"));
            var context = canvas.getContext("2d");
            context.font = font;
            var metrics = context.measureText(text);
            return metrics.width;
        },
        changeWidth(index) {
            // let input = document.getElementsByClassName("inputClass")[0].getElementsByTagName('input')[0];
            const input = this.$refs.saveTagInput[0].$refs.input
            const l = this.getTextWidth(input.value,'')
            const long = l + 20
            this.$refs.divRef.getElementsByClassName('flexItem')[index].style.width = ''
            this.changeInputWidth(long)
            // input.style.width = long + "px";
        },
        changeInputWidth(width){
            const input = this.$refs.saveTagInput[0].$refs.input
            // const inputWidth = this.getTextWidth(input.value)
            // console.log(inputWidth,'inputWidthinputWidth')
            // console.log(input,'this.is.changeInput')
            width = width>this.maxWidth?this.maxWidth:width<this.minWidth?this.minWidth:width
            input.style.width = width+'px'
        },
        changeTextToOmit(value){
            const long = this.getTextWidth(value)
            // console.log(long,'longChangeto')
            let outValue = ''
            for(let i of value){
                if(this.getTextWidth(outValue+i)>this.limitLong){
                    break
                }
                outValue += i
            }
            if(long>this.limitLong){
                return outValue+'...'
            }
            else{
                return value
            }
        },
        deleteTag(index){
            const h = this.$createElement;
            this.$msgbox(
                {
                title: '提示',
                message:
                h('div', null, [
                    h('p',null,[
                        h('span', null , '删除标签后，'),
                        h('span', {style: 'color:#EB6C00'}, '已标记该标签'),
                        h('span', null , '的门店，将'),
                        h('span', {style: 'color:#EB6C00'}, '自动删除此标签'),
                        h('span', null , '。'),
                    ]),
                    h('p',null,'是否确定删除标签？')
                ]),
                showCancelButton: true,
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                })
                .then(() => {
                    const params = {
                        type: this.type,
                        id: this.tags[index].id
                    }
                    deleteTag(params).then(res=>{
                        if(res?.payload?.isSuccess){
                            this.$message.success('删除标签成功')
                            this.$emit('updateList')
                        }
                    })
                })
        },
        changeDialogView(val){
            this.dialogTableVisible = val
        },
        addNewTags(val){
            const params = {
                type: this.type,
                groupId: this.tagsGroup.id,
                name: val
            }
            createTag(params).then(res=>{
                if(res?.payload?.isSuccess){
                    this.dialogTableVisible = false
                    this.$message.success('新增标签成功')
                    this.$emit('updateList',true)
                }
            })
        }

    }
}
</script>
<style scoped lang="less">
.tagLine{
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    overflow: hidden;
    .flexItem{
        height: 30px;
        max-width: 110px;
        box-sizing: content-box;
        margin-right: 5px;
        margin-bottom: 5px;
        /deep/.el-tag{
            height: 30px;
            line-height: 28px;
        }
    }
    /deep/.inputClass{
        margin: 0;
        height: 32px;
        .el-input__inner{
            margin: 0;
            height: 30px;
            width: 20px;
            min-width: 20px;
            max-width: 100px;
            box-sizing: content-box;
        }
        .el-input__suffix{
            right: 6px;
        }
        // width: 100px;
    }
}
.addTags{
    display: flex;
    flex-direction: row;
    align-items: center;
    background: rgba(255, 255, 255, 0);
    padding: 5px 5px;
    border-radius: 10%;
    border: 1px dashed #EB6C00;
    color: #EB6C00;
    height: 30px;
    line-height: 28px;
    margin-bottom: 5px;
}
.addTags:hover{
    cursor:pointer;
    background: #eb6e001e;
}
</style>
