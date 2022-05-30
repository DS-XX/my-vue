<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogTableVisible"
    width="450px"
    @closed="cancelSubmit">
    <el-input
      v-model="inputValue"
      maxlength="99"
      show-word-limit
      style="marginBottom:20px"
    />
    <el-row style="display:flex;justify-content:flex-end">
      <el-button @click="cancelSubmit">取消</el-button>
      <el-button
        type="primary"
        @click="submit">确定</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'EditDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    dialogTableVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      inputValue: ''
    }
  },
  // watch:{
  //     dialogTableVisible:{
  //         handler(val){
  //             if(!val){
  //                 this.cancelSubmit()
  //             }
  //         }
  //     }
  // },
  methods: {
    cancelSubmit () {
      this.$emit('changeDialogView', false)
      this.inputValue = ''
    },
    submit () {
      this.$emit('submitValue', this.inputValue)
    }
  }
}
</script>
<style scoped lang="less">
/deep/.el-input__inner{
    padding-right: 50px;
}
</style>
