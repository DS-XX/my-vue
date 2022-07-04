<template>
  <el-select
    v-model="selectValue"
    popper-class="selectPopperClassPandian"
    multiple
    clearable
    filterable 
    :filter-method="filterMethod"
    :reserve-keyword="true"
    @visible-change="selectVisibel"
  >
    <el-option
      v-for="item in shopList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <div />
    </el-option>
    <template>
      <el-tree
        ref="tree"
        v-loading="treeLoading"
        :data="treeSelectData"
        show-checkbox
        check-strictly
        :check-on-click-node="false"
        node-key="id"
        default-expand-all
        :props="defaultProps"
        :filter-node-method="filterNode"
        @check-change="treeClick"
      />
      <el-button
        v-if="selectValue.length < selectAllValue.length"
        class="check-all"
        type="text"
        :disabled="treeLoading"
        @click="selectAllMethods"
      >
        全选
      </el-button>
      <el-button
        v-else
        class="check-all"
        type="text"
        :disabled="treeLoading"
        @click="cancelSelectAll"
      >
        取消全选
      </el-button>
    </template> 
  </el-select>
</template>
<script>
export default {
  name: "newTreeSelect",
  props:{
    data: {
      type: Array,
      default: ()=>[]
    },
    defaultProps: {
        type: Object,
        default: ()=>{
          {
            return {
              label: 'label',
              value:'id',
              children: 'children'
            }
          }
        },
    },
    selectValue:{
      type: Array,
      default: ()=>[]
    },
    clearable:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // selectValue: [],
      value: "",
      treeSelectData: [],
      treeLoading: false,
    //   defaultProps: {
    //     children: "children",
    //     label: "label",
    //   },
    };
  },
  computed:{
    //select的options的数据
    shopList(){
        return this.arrayPeace([],this.treeSelectData)
    },
    //select全选时候的值
    selectAllValue(){
        return this.shopList.map(item=>{
            return item.value
        })
    },
  },
  watch:{
    //当select中的值改变时，更新tree中选中的值
    selectValue:{
        handler(val,old){
          //判断新老数组内的数组是否相同，优化性能
          if(!this.isArrayEqual(val,old)){
            this.$refs.tree.setCheckedKeys(val)
            this.$emit('dataChange',val)
          }
          // if(val.length === this.selectAllValue.length){
            // this.treeLoading = false
          // }
          // debugger
          // this.treeLoading = true
          // console.time("sort")
          // this.selectTreeNode(val)
          // console.timeEnd("sort")
          // this.$nextTick(()=>{
          //   this.treeLoading = false
          // })
        }
    },
    data:{
      handler(val){
        const defaultProps = this.defaultProps
        if(defaultProps?.label!=='label' || defaultProps?.children!=='children' || defaultProps?.id!=='id'){
          this.treeSelectData = this.changeDataOptions([...val],defaultProps)
        }
      }
    }
  },
  methods:{
    //获取到tree选中后的值
    treeClick(object,node,dom){
        // const x = this.$refs.tree.getCheckedKeys()
        const value = object.id
        let index = this.selectValue.indexOf(value)
        if(node && index===-1){
          this.selectValue.push(value)
        }
        else if(!node && index>-1){
          this.selectValue.splice(index,1)
        }
    },
    //对tree的数据进行处理，得到符合select的数据结果
    arrayPeace(arr = [],newArr = []){
        newArr.forEach(item => {
            arr.push({
                value: item.id,
                label: item.label
            })
            if(item?.children && item?.children.length>0){
                this.arrayPeace(arr,item.children)
            }
        });
        return arr
    },
    selectAllMethods(){
        //获取全部的select值
        //在tree组件内部进行选择时，loading无效，页面不能点击
        // this.treeLoading = true
        // console.time("sort")
        // this.selectTreeNode(arr)
        this.selectValue = [...this.selectAllValue]
        this.$refs.tree.setCheckedKeys(this.selectAllValue)
        // console.timeEnd("sort")
        this.$nextTick(()=>{
          // this.treeLoading = false
        })
    },
    cancelSelectAll(){
        //将select中的值置空
        this.selectValue = []
        this.$refs.tree.setCheckedKeys([])
    },
    filterMethod(val){
        //使用这个方法进行tree的过滤
        this.$refs.tree.filter(val);
    },
    filterNode(val,data){
        //定义了tree过滤的方法
        if(!val || val === true) return true;
        return data.label.indexOf(val) !== -1;
    },
    //每次显示下拉框时，将tree中可选的值全部展示
    selectVisibel(value){
        //这里的value是true或者false，true代表显示下拉框时
        if(value){
            this.$refs.tree.filter(true)
        }
    },
    changeDataOptions(options,defaultOptions){
      const newArr = options.map(item=>{
        if(item[defaultOptions.children] && item[defaultOptions.children].length>0){
          item.children = this.changeDataOptions(item[defaultOptions.children],defaultOptions)
        }
        item.value = item[defaultOptions.value]
        item.label = item[defaultOptions.label]
        return item
      })
      return newArr
    },
    selectTreeNode(val){
      // let arr = [...val]
      // let out  = arr.splice(0,50)
      // debugger
        console.time('left')
      new Promise((resolve)=>{
        this.$refs.tree.setCheckedKeys(val)
        // this.$refs.tree.setCheckedKeys([...this.selectValue,...out])
        // resolve(true)
      }).then(()=>{
        this.$nextTick(()=>{
          // this.selectTreeNode(arr)  
        })
      })
        console.timeEnd('left')
    },
    //下面判断两个数组内的元素是否相等
    copy(value) {
      return JSON.parse(JSON.stringify(value));
    },
    isArrayEqual(value1 = [], value2 = []) {
      let hash = this.copy(value2);
      if (value1.length === value2.length) {
        for(let i = 0; i < value1.length;i++) {
          const index = hash.indexOf(value1[i]);
          if (index > -1) {
            hash.splice(index, 1);
          } else {
            return false;
          }
        }
        return true;
      }
      return false;
    }
  }
};
</script>
<style lang="less">
.selectPopperClassPandian {
    width: 300px;
  .el-scrollbar__wrap {
    overflow: hidden;
    width: 100%;
    margin-bottom: 0 !important;
    .el-select-dropdown__list {
      height: 100%;
      overflow: hidden; 
    }
    .el-scrollbar__bar{
        display: none;
    }
  }
  .el-select-dropdown__item {
    display: none;
  }
  .el-tree {
    overflow: auto;
    overflow-x: hidden;
    max-height: 200px;
    margin-bottom: 32px;
  }
  .check-all {
    position: absolute;
    left: 0;
    bottom: 0px;
    text-align: center;
    font-size: 16px;
    line-height: 32px;
    padding: 0;
    color: #eb6c00;
    background: #fff;
    width: 100%;
    cursor: pointer;
    z-index: 10;
    border-top: 1px solid #ccc;
  }
}
</style>
