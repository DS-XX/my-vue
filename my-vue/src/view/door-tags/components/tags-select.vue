<template>
  <el-cascader
    :options="options"
    :props="{ checkStrictly: true }"
    clearable/>
</template>
<script>
import {getMerchant} from '../../../services/merchant'
export default {
  name: 'MerchantListSelect',
  data () {
    return {
      options: [],
      value: this?.$getMerchantId() + ''
    }
  },
  mounted () {
    getMerchant().then(res => {
      this.options = res.payload
      // for(let i of this.options){
      //     if(i.id == this.value){
      //         this.value = i.id
      //         break
      //     }
      // }
    })
  }
}
</script>
