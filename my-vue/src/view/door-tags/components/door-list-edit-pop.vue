<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogTableVisible"
    width="400px">
    <tags-cascader
      :default-value="selectValue.tagIdList || []"
      :type="1"
      :mutex="true"
      placeholder="门店标签"
      label="name"
      children-name="tagInfoList"
      option-value="id"
      @input="changeValue"
    />
    <div
      slot="footer"
      class="dialog-footer">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button
        type="primary"
        @click="submitChange">确 定</el-button>
    </div>
    <!-- <el-select
            v-model="value"
            multiple
            collapse-tags>
            <option
                v-for="item in options"
                :key="item[optionValue]"
                :label="item[optionLabel]"
                :value="item[optionValue]">
            </option>
        </el-select> -->
  </el-dialog>
</template>
<script>
import {getMerchant} from '../../../services/merchant'
import tagsCascader from '@/components/tags-cascader'
export default {
  name: 'MerchantListSelect',
  components: { tagsCascader },
  props: {
    title: {
      type: String,
      default: ''
    },
    dialogTableVisible: {
      type: Boolean,
      default: false
    },
    selectValue: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    },
    optionValue: {
      type: String,
      default: ''
    },
    optionLabel: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      value: ''
    }
  },
  watch: {
    // selectValue:{
    //     handler(val){
    //         this.value = val.map(item=>{
    //             return item.id
    //         })
    //     }
    // }
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
  },
  methods: {
    changeValue (val) {
      this.value = val
    },
    changeOptionStructure () {
      this.options = this.options.map(item => {

      })
    },
    cancelDialog () {
      this.$emit('cancelDialogView', false)
    },
    submitChange () {
      this.$emit('submitValue', this.value)
    }
  }
}
</script>
<style scoped lang="less">
/deep/.el-cascader{
    width: 100%;
}
</style>
