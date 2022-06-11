<template>
  <!-- <el-select v-model="shopList" >
    <el-option
      v-for="item in shopList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
    <template>
        <div>11111111111</div>
    </template>
  </el-select> -->
  <TreeSelect>
    
  </TreeSelect>
</template>
<script>

export default {
  name: "NewSelect",
  data(){
    return{
        shopList: [{
            value:1,
            label:1
        }]
    }
  }
};
</script>
