<template>
  <component
    :is="isText ? 'text-button' : 'el-button'"
    v-bind="$attrs"
    :loading="loading"
    :type="type"
    v-on="$listeners"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script>
import TextButton from './text-button.vue'

export default {
  components: {TextButton},
  props: {
    /**
     * 是否是文字按钮。
     */
    isText: {
      type: Boolean,
      default: false
    },
    /**
     * 如果没有这个props，则通过attrs传`type`时，会导致el-button的`native-type`也被改变
     */
    type: String,
    /**
     * 点击按钮绑定的函数
     */
    click: {
      type: Function
    },
    /**
     * click函数的参数
     */
    params: {},
    /**
     * 点击事件的回调函数
     */
    callback: {
      type: Function,
      default: () => {}
    },
    // loading: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      loading: false
    }
  },
  watch:{
    loading(val){
      console.log(val,'this.is.watchloading')
    }
  },
  methods: {
    // 监控按钮的Promise进程
    handleClick() {
      if (!this.click) return

      this.loading = true
      console.log('lolaindg')
      this.$nextTick(()=>{
        Promise.resolve(this.click(this.params))
        .then(flag => {
          console.log(this.loading,'then,loading')
          if (flag === false) return
          // 调用父组件中的数据刷新方法
          this.callback()
        })
        .catch(e => {})
        .finally(e => {
          console.log(this.loading,'loaindg')
          this.loading = false
        })
      })
      
    }
  }
}
</script>
