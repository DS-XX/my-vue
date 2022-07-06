<template>
    <div>
        <el-form v-model="form" ref="form">
            <el-form-item prop="loginName">
                <el-input v-model="form.loginName">

                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="form.password">
                    
                </el-input>
            </el-form-item>
        </el-form>
        <el-button @click="clickRegister">
            注册
        </el-button>
        <el-button @click="jumpToLogin">
            跳转登陆
        </el-button>
    </div>
</template>
<script>
export default {
    name: 'register',
    data(){
        return{
            form:{
                loginName: '',
                password: ''
            }
        }
    },
    methods:{
        clickRegister(){
            const form = this.form
            this.$api.nodeAPI.register(form).then(res=>{
                if(res.isSuccess){
                    this.$message.success('成功注册')
                    this.jumpToLogin()
                }
                else{
                    this.$message.error('重新注册')
                }
            })
        },
        jumpToLogin(){
            this.$router.push('/du/nodeTest')
        }
    }
}
</script>