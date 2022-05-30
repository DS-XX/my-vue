<template>
  <el-cascader
    v-model="selectValue"
    :options="options"
    :show-all-levels="false"
    :props="{children: 'children',label: 'label',
             value:'value', multiple: true, checkStrictly: true,
             emitPath: false, expandTrigger:'click'
    }"
    collapse-tags
    clearable/>
</template>
<script>
export default {
  name: 'TagsCascader',
  props: {
    defaultValue: {
      type: Array,
      default: () => []
    },
    // 组内是否互斥
    mutex: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      options: [],
      add: true,
      selectValue: [],
      firstDefault: false
    }
  },
  watch: {
    selectValue: {
      handler (n, old) {
        // 由于n的地址会因为tempSelectValue不断的变化，所以通过这个和父组件传入的地址比较
        // 让第一次父组件传入的值不会级联选择chilren的元素
        if (this.firstDefault) {
          this.firstDefault = false
          return
        }
        if (this.mutex) {
          if (n.length > 20) {
            this.$message.error('最多选择20个标签')
            return
          }
          let clickItem = this.getClickItem(n, old)
          const index = this.getParentIndex(clickItem)
          this.changeItemState(index, clickItem)
          this.options = this.changeOptionsDeep(this.options)
        }
        this.$emit('input', this.selectValue)
      },
      deep: true,
      immediate: true
    },
    defaultValue: {
      handler (n) {
        this.$nextTick(() => {
          this.defaultValueSelect(n)
          this.firstDefault = true
          this.selectValue = [...n]
        })
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.options = [{
      value: 1,
      label: 1,
      children: [{
        value: 2,
        label: 2
      }, {
        value: 6,
        label: 6
      }
      ]
    }, {
      value: 3,
      label: 3,
      children: [{
        value: 4,
        label: 4
      }, {
        value: 5,
        label: 5
      }]
    }
    ]
  },
  methods: {
    getClickItem (newArr, oldArr) {
      if (oldArr?.length === 0 || !oldArr) {
        this.add = true
        return newArr[0]
      }
      if (newArr.length === 0) {
        this.add = false
        return oldArr[0]
      }
      if (newArr.length > oldArr.length) {
        this.add = true
        for (let i of newArr) {
          if (!oldArr.includes(i)) {
            return i
          }
        }
      } else {
        this.add = false
        for (let i of oldArr) {
          if (!newArr.includes(i)) {
            return i
          }
        }
      }
    },
    getParentIndex (clickItem) {
      for (let i = 0; i < this.options.length; i++) {
        for (let j of this.options[i].children) {
          if (j.value == clickItem) {
            return i
          }
        }
      }
    },
    changeItemState (index, clickItem) {
      if (clickItem == undefined) {
        return
      }
      const arr = this.options[index].children
      for (let i of arr) {
        if (i.value != clickItem) {
          i.disabled = this.add
        } else {
          i.disabled = false
        }
      }
      return this.options
    },
    // 设置默认选择项
    defaultValueSelect (n) {
      const defulatArr = n
      let index = 0
      this.add = true
      for (let i of this.options) {
        i.disabled = true
        // 如果组内互斥，将其他的禁用
        if (this.mutex) {
          const clickItem = defulatArr.filter((item) => {
            for (let j of i.children) {
              if (j.value == item) {
                return item
              }
            }
          })[0]
          this.changeItemState(index++, clickItem)
        }
      }
      this.options = this.changeOptionsDeep(this.options)
    },
    // 遍历树更新options
    changeOptionsDeep (options) {
      let newArr = []
      for (let i of options) {
        newArr.push(i)
        if (i.children?.length > 0) {
          newArr.children = this.changeOptionsDeep(i.children)
        }
      }
      return newArr
    }
  }
}
</script>
