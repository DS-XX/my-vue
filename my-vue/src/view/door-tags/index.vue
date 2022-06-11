<template>
  <div>
    <el-row>
      <el-input-number v-model="num" @change="handleChange" :min="1" :max="9990" label="描述文字"></el-input-number>
      <el-input v-model="inputValue"></el-input>
    </el-row>
    <el-button @click="addTags">
        添加标签
    </el-button>
    <tags-item
    :tags="tags"/>
  </div>
</template>
<script>
import tagsItem from './tags-management/components/tag-item'
export default {
  name: 'DoorTags',
  components:{
    tagsItem
  },
  data(){
    return{
      num: 1,
      inputValue: '',
      tags:[]
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
    }
  }
}
</script>
