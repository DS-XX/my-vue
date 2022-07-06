<template>
    <div>
        <el-form v-model="form">
            <el-form-item prop="loginName">
                <el-input v-model="form.loginName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.password"></el-input>
            </el-form-item>
        </el-form>
        <div class="displayFlexRow">
            <el-button @click="clickButton">
            点击测试get
            </el-button>
            <el-button @click="clickPost">
                点击测试post
            </el-button>
            <el-button @click="clickLogin">
                点击登陆
            </el-button>
        </div>
        <el-button @click="jumpToRegister">
            注册
        </el-button>
    </div>
</template>
<script>
export default {
    name: 'nodeTest',
    data(){
        return{
            form:{
                loginName: '',
                password: ''
            }
        }
    },
    methods:{
        clickLogin(){
            const form = this.form
            this.$api.nodeAPI.login(form).then(res=>{
                if(res.isSuccess){
                    this.$message.success('登陆成功')
                    sessionStorage.setItem('token',res.token)
                }
                else{
                    this.$message.success(res.msg)
                }
            })
        },
        jumpToRegister(){
            this.$router.push('/du/register')
        },
        clickButton(){
            const params = {
                name: '1'
            }
            this.$api.nodeAPI.user(params).then(res=>{
                console.log(res)
            })
        },
        clickPost(){
            const params = {
                loginName : 'test',
                password : 'test'
            }
            this.$api.nodeAPI.insertUser(params).then(res=>{
                console.log(res)
            })
        }
    }
}
</script>
<style scoped>
.displayFlexRow{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
</style>