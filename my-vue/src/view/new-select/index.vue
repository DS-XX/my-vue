<template>
  <el-select
    v-model="selectValue"
    popper-class="selectPopperClassPandian"
    multiple
    collapse-tags
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
        :data="data"
        show-checkbox
        check-strictly
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
        @click="selectAllMethods"
      >
        全选
      </el-button>
      <el-button
        v-else
        class="check-all"
        type="text"
        @click="cancelSelectAll"
      >
        取消全选
      </el-button>
    </template> 
  </el-select>
</template>
<script>
//监听selectId来修改tree的节点，会卡顿
export default {
  name: "newTreeSelect",
  props:{
    data: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      selectValue: [],
      value: "",
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
            },
            {
              id: 6,
              label: "二级 2-2",
            },
          ],
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1",
            },
            {
              id: 8,
              label: "二级 3-2",
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  computed:{
    //select的options的数据
    shopList(){
        return this.arrayPeace([],this.data)
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
        handler(val){
            this.$refs.tree.setCheckedKeys(val)
        }
    }
  },
  methods:{
    //获取到tree选中后的值
    treeClick(object,node,dom){
        const x = this.$refs.tree.getCheckedKeys()
        this.selectValue = x
    },
    //对tree的数据进行处理，得到符合select的数据结果
    arrayPeace(arr = [],newArr){
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
        this.selectValue = [...this.selectAllValue]
    },
    cancelSelectAll(){
        //将select中的值置空
        this.selectValue = []
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
