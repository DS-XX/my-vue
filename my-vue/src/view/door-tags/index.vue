<template>
  <div>
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
      tags:[]
    }
  },
  mounted(){
    let name = '标签'
    for(let i =0;i<100;i++){
      this.tags.push({name:name+(i+1)})
    }
  }
}
</script>
