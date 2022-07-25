<template>
  <div>
    <el-row>
      <el-input-number v-model="num" @change="handleChange" :min="1" :max="9990" label="描述文字"></el-input-number>
      <el-input v-model="inputValue"></el-input>
    </el-row>
    <el-button @click="addTags">
        添加标签
    </el-button>
    <show-code-error :visible="visible" @changeVisible="()=>visible = false">

    </show-code-error>
    <el-button @click="()=>visible = true">
        显示唯一码
    </el-button>
    <!-- <tags-item
    :tags="tags"/> -->
  </div>
</template>
<script>
import tagsItem from './tags-management/components/tag-item'
import ShowCodeError from '@/components/show-code-error/index.vue'
export default {
  name: 'DoorTags',
  components:{
    tagsItem,
    ShowCodeError
},
  data(){
    return{
      num: 1,
      inputValue: '',
      tags:[],
      visible: false,
    }
  },
  mounted(){
     this.updateTagsData()
  },
  methods:{
    addTags(){
      const parmaList = []
      for(let i =1;i<=this.num;i++){
        parmaList.push(this.inputValue+i)
      }
      const parmas = {
        tagsList: parmaList
      }
      console.log(parmas,'11111111')
      this.$api.tagsAPI.createTagsList(parmas).then(res=>{

      })
    },
    updateTagsData(){
      this.$api.tagsAPI.searchAll().then(res=>{
        if(res?.data?.payload){
          this.tags = res.data.payload
        }
      }) 
    },
  }
}
</script>
