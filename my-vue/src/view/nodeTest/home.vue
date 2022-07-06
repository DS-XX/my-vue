<template>
    <div class="block">
        <el-carousel height="400px">
            <el-carousel-item v-for="item in homePicture" :key="item">
                <img :src="item" @click="viewImg(item)"></img>
            </el-carousel-item>
        </el-carousel>
        <img ref="pictureDom" v-show="flase"></img>
  </div>
</template>
<script>
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
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
    },
    methods:{
        viewImg(url){
            const dom = this.$refs.pictureDom
            dom.src = url
            console.log(dom,111)
            var image = new Viewer(dom,{

            });
            dom.click()
        }
    }
}
</script>