<template>
  <div class="containAll">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :inline="false"
      label-width="80px"
      size="normal"
      class="formWidth">
      <el-form-item label="登录账号">
        <el-input v-model="form.loginName"/>
      </el-form-item>
      <el-form-item label="登录密码">
        <el-input v-model="form.password"/>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit('form')">立即创建</el-button>
        <el-button @click="resetForm('form')">清空</el-button>
      </el-form-item>
    </el-form>
    <div
      ref="divRef"
      style="display:flex;direction:row">
      <div
        v-for="(tag,index) in tags"
        :key="tag.name">
        <el-tag
          v-if="index!==showIndex"
          :key="tag.name"
          :type="tag.type"
          closable
          @dblclick.native.capture="e=>clickdb(index)">
          {{ tag.name }}
        </el-tag>
        <el-input
          v-else
          ref="saveTagInput"
          :style="{width:inputWidth || 0}"
          v-model="inputValue"
          @blur="()=>blurclear(index)"
        />
      </div>
      <el-input
        v-if="inputVisible"
        ref="saveTagInput"
        v-model="inputValue"
        class="input-new-tag"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <el-button
        v-else
        class="button-new-tag"
        size="small"
        @click="showInput">+ New Tag</el-button>

    </div>
    <el-input
      :style="{width:inputWidth}"
    />
    {{ inputWidth }}
  </div>
</template>
<script>
export default {
  name: 'Basic',
  data () {
    return {
      tags: [
        { name: '标签一', type: '' },
        { name: '标签二', type: 'success' },
        { name: '标签三', type: 'info' },
        { name: '标签四', type: 'warning' },
        { name: '标签五', type: 'danger' }
      ],
      showIndex: '',
      inputWidth: '',
      inputValue: '',
      inputVisible: false,
      form: {
        loginName: '',
        password: ''
      },
      rules: {
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'change' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formValue = this.$refs.form.model
          console.log(formValue, 'this.isvalue')
          console.log(this.$api, 'this.is.api')
          this.$api.loginAPI.getUser()
          // this.$axios({
          //   url: '/user/list',
          //   methods: 'get'
          // }).then(res => {
          //   console.log(res, 'this,is.res')
          // })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    clickdb (index) {
      const width = this.$refs.divRef.children[index].offsetWidth
      this.inputWidth = width
      this.inputValue = this.tags[index].name
      console.log(this.inputWidth, 'inputstyle')
      console.log(index, '111')
      this.showIndex = index
      this.$nextTick(() => {
        console.log(this.$refs.saveTagInput, 11111)
        this.$refs.saveTagInput[0].$refs.input.focus()
      })
    },
    blurclear (index) {
      if (!this.checkRepeat(index, this.inputValue)) {
        this.$message.error('重复名')
        return
      }
      this.tags[index].name = this.inputValue
      this.showIndex = ''
      this.inputValue = ''
    },
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.tags.push({name: inputValue})
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    checkRepeat (index, name) {
      for (let i = 0; i < this.tags.length; i++) {
        if (i !== index && this.tags[i].name === name) {
          return false
        }
      }
      return true
    }
  }
}
</script>
<style scoped lang="less">
.containAll{
  display: flex ;
  flex-direction: column;
  align-items: center;
}
.formWidth{
  width: 500px;
}
</style>
