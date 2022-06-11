<template>
    <div>
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
                @click="onSubmit('form','create')">立即创建</el-button>
                <el-button
                type="primary"
                @click="onSubmit('form','login')">登录</el-button>
                <el-button @click="resetForm('form')">清空</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'homeIndex',
    data(){
        return{
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
    methods:{
        onSubmit (formName,type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formValue = this.$refs.form.model
          const params = {
            loginName: formValue.loginName,
            password: formValue.password
          }
          if(type==='login'){
            this.$api.loginAPI.login(params).then(res=>{
              if(res?.data?.payload){
                this.$router.push('/du/business/basic')
                this.$message.success(res.msg)
              }
              else{
                this.$message.error(res.msg)
              }
          })
          }
          else{ 
            this.$api.loginAPI.createName(params).then(res=>{
              console.log(res,'this.is.res')
            })
          }
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
    }
}
</script>