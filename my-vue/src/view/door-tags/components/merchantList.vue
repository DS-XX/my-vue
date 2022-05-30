<template>
  <el-select
    v-model="value"
    multiple
    collapse-tags
    clearable>
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.merchantName"
      :value="item.id"
    />
  </el-select>
</template>
<script>
import {getMerchant} from '../../../services/merchant'
export default {
  name: 'MerchantListSelect',
  data () {
    return {
      options: [],
      value: ''
    }
  },
  watch: {
    value: {
      handler (val) {
        this.$emit('input', val)
      }
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
    }).finally(() => {
      // this.value = this?.$getMerchantId()
    })
  }
}
</script>
