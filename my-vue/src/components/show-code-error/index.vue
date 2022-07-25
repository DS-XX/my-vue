<template>
  <el-dialog :visible.sync="dialogVisible" center>
    <el-table :data="tableData" header-row-class-name="tableHeaderClassName">
      <el-table-column prop="onlyOneCode" label="唯一码" min-width="180">
        <template slot-scope="scope">
          <span class="handShow" @click="copyCodeItem(scope.row.onlyOneCode)">{{
            scope.row.onlyOneCode
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="failReason" label="失败原因" min-width="180">
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button @click="copyCode">复制唯一码</el-button>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "showCodeError",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.dialogVisible = true;
      }
    },
    dialogVisible(val) {
      if (val) {
        this.getTableList();
      } else {
        this.$emit("changeVisible", false);
      }
    },
  },
  methods: {
    getTableList() {
      this.$api.tagsAPI.getOnlyOneCode().then((res) => {
        this.tableData = res.data;
      }).finally(()=>{
        const arr = this.tableData.map(i=>i.onlyOneCode)
        const rightArr = Array.from(new Set(arr))
        arr.push('test')
        this.tableData = this.judgeCodeList(arr,rightArr)
      });
    },
    copyCode() {
      let text = "";
      this.tableData.forEach((item) => {
        text += `${item.onlyOneCode}\n`;
      });
      this.$copyText(text)
        .then(() => {
          this.$message.success("已复制唯一码");
        })
        .catch(() => {
          this.$message.error("复制失败");
        });
    },
    copyCodeItem(text) {
      this.$copyText(text)
        .then(() => {
          this.$message.success(`成功复制${text}`);
        })
        .catch(() => {
          this.$message.error("复制失败");
        });
    },
    judgeCodeList(arr,rightArr){
        const hash = new Map()
        const errorCodeList = []
        for(let i of arr){
            if(!hash.has(i)){
                hash.set(i,1)
            }
            else{
                hash.set(i,hash.get(i)+1)
                errorCodeList.push({onlyOneCode:i,failReason:'唯一码重复'})
            }
            if(!rightArr.includes(i)){
                errorCodeList.push({onlyOneCode:i,failReason:'唯一码不存在'})
            }
        }
        console.log(errorCodeList)
        return errorCodeList
    }
  },
};
</script>
<style lang="less" scoped>
/deep/.tableHeaderClassName th {
  background: #f4f6fa;
  color: #605f5f;
}
.handShow{
    cursor:pointer;
}
</style>
