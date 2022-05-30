<template>
  <el-cascader
    v-model="selectValue"
    :options="options"
    :placeholder="placeholder"
    :show-all-levels="false"
    :props="{children: childrenName,label: label,
             value: optionValue, multiple: true, checkStrictly: true,
             emitPath: false, expandTrigger:'click'
    }"
    collapse-tags
    filterable
    clearable/>
</template>
<script>
import { tagsList } from '../../services/door-tags'
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
    },
    type: {
      type: Number,
      default: 1
    },
    label: {
      type: String,
      default: ''
    },
    childrenName: {
      type: String,
      default: ''
    },
    optionValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Array],
      default: ''
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
          const x = new Set(this.selectValue)
          let out = Array.from(x)
          this.$emit('input', out)
          return
        }
        if (this.mutex) {
          if (n.length > 20) {
            this.$nextTick(() => {
              this.selectValue = old
            })
            this.$message.error('最多选择20个标签')
            return
          }
          let clickItem = this.getClickItem(n, old)
          const index = this.getParentIndex(clickItem)
          // this.changeItemState(index,clickItem)
          this.cancelSameLevelSelect(index, clickItem)
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
          // this.defaultValueSelect(n)
          this.firstDefault = true
          this.selectValue = [...n]
        })
      },
      deep: true,
      immediate: true
    },
    value: {
      handler (newValue) {
        if (!newValue) this.selectValue = []
        else this.selectValue = newValue
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.getOptions()
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
        if (this.options[i][this.childrenName]) {
          for (let j of this.options[i][this.childrenName]) {
            if (j[this.optionValue] == clickItem) {
              return i
            }
          }
        }
      }
    },
    changeItemState (index, clickItem) {
      if (clickItem == undefined) {
        return
      }
      const arr = this.options[index][this.childrenName]
      for (let i of arr) {
        if (i[this.optionValue] != clickItem) {
          i.disabled = this.add
        } else {
          i.disabled = false
        }
      }
      return this.options
    },
    cancelSameLevelSelect (index, clickItem) {
      if (clickItem == undefined) {
        return
      }
      const arr = this.options[index][this.childrenName]
      for (let i of arr) {
        let indexSelect = 0
        for (let j of this.selectValue) {
          if (i[this.optionValue] == j && j != clickItem) {
            this.selectValue.splice(indexSelect, 1)
            this.firstDefault = true
            return
          }
          indexSelect++
        }
      }
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
            for (let j of i[this.childrenName]) {
              if (j[this.optionValue] == item) {
                return item
              }
            }
          })[0]
          // this.changeItemState(index++,clickItem)
        }
      }
      this.options = this.changeOptionsDeep(this.options)
    },
    // 遍历树更新options
    changeOptionsDeep (options) {
      let newArr = []
      for (let i of options) {
        newArr.push(i)
        if (i[this.childrenName]?.length > 0) {
          newArr[this.childrenName] = this.changeOptionsDeep(i[this.childrenName])
        }
      }
      return newArr
    },
    getOptions () {
      const params = {
        type: this.type
      }
      tagsList(params).then(res => {
        this.options = res?.payload.map(item => {
          return {
            ...item,
            disabled: true
          }
        })
        // if(this.defaultValue.length>0){
        //     this.defaultValueSelect(this.defaultValue)
        // }
      })
    }
  }
}
</script>
