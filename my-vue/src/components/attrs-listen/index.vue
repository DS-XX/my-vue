<template>
    <el-button v-bind="$attrs" v-on="$listeners" @click="click">
        点击测试 attrs listen
    </el-button>
</template>
<script>
export default {
    name: 'attrs-listen',
    data(){
        return{

        }
    },
    mounted(){
        
    },
    methods:{
        click(){
            console.log(this.$attrs)
            console.log(this.$listeners)
        },
        height(){
            console.log('height.test')
        }
    }
}
</script>