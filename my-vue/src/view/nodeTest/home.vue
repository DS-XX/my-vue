<template>
    <div class="block">
        <el-carousel height="400px">
            <el-carousel-item v-for="item in homePicture" :key="item">
                <img :src="item"></img>
            </el-carousel-item>
        </el-carousel>
  </div>
</template>
<script>
export default {
    name: 'home',
    data(){
        return {
            homePicture: []
        }
    },
    mounted(){
        this.$api.nodeAPI.homePicture().then((res)=>{
            this.homePicture = res.data.url
        })
    }
}
</script>