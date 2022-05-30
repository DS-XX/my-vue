<template>
  <el-dialog
    :visible="visible"
    title="导入"
    width="500px"
    @close="onDialogClose"
  >
    <div
      v-show="importedData.length === 0 && importErrorData.length === 0"
      class="import-data"
      v-loading="importLoading"
    >
      <div v-if="priceDialog">
        <div class="step-item">
          <span style="color:red">*</span>请选择需要进行价格编辑的商户：
        </div>
        <el-select
          v-model="value"
          filterable
          multiple
          clearable
          collapse-tags
          placeholder="请选择"
          class="step-select"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.merchantName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="step-item">
        {{ `第一步：下载${typeLabel}导入模板` }}
      </div>
      <div class="step-item__excel">
        {{ `${typeLabel}导入模板.xls` }}
        <a
          :download="`${typeLabel}导入模板.xls`"
          style="color:#EB6C00;"
          :href="typeLabel == '商品' ? xls2 : xls"
          >下载</a
        >
      </div>
      <div class="step-item">
        第二步：导入填写完成的Excel文件
      </div>
      <div class="step-item__upload">
        <div
          class="upload-area"
          @click="handleImportExcel"
          @drop="onUploadAreaDrop"
          @dragover="onUploadAreaDragOver"
        >
          <img class="upload-area-icon" src="../../assets/img/excel.svg" />
          <div class="upload-area-title">
            {{ `上传 excel ${typeLabel}初始化表` }}
          </div>
          <div class="el-upload__text drop-tip">
            将文件拖到此处，或
            <el-button type="text" size="mini">点击上传</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { importExcel, parseExcel } from "@/utils/excel-it";
import dayjs from "dayjs";
import demoxls from "@/assets/商品价格编辑导入模板.xls";
import demoxls2 from "@/assets/商品导入模板.xls";
import { getMerchant } from "@/services/commercial";
export default {
  name: "ImportMembersDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    typeLabel: {
      type: String,
      default: ""
    },
    importFields: {
      type: Array,
      default: []
    },
    priceDialog: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      importLoading: false,
      importedData: [],
      importErrorData: [],
      xls: demoxls,
      xls2: demoxls2,
      options: [],
      value: []
    };
  },
  watch: {
    value: {
      handler(n, old) {
        if (n.length > 5) {
          this.value = old;
          this.$message.error("一次最多选5个商户");
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    if (this.priceDialog) {
      getMerchant({ merchantId: this.$getMerchantId() }).then(res => {
        this.options = res.payload;
        if (this.options.length === 1) {
          this.value = [this.options[0].id];
        }
      });
    }
  },
  methods: {
    setImportedData(data) {
      const params = {
        merchantIdList: this.value || [],
        importList: data
      };
      this.$emit("close-dialog");
      this.$emit("import-success", params);
    },
    // 消息弹框
    showMessage(message, type = "success") {
      this.$message({
        message,
        type
      });
    },
    // 导入会员
    handleImportExcel() {
      this.importedData = [];
      this.importErrorData = [];
      importExcel([], res => {
        this.conditionalJudgment(res);
      });
    },
    // 重置dialog
    onDialogClose() {
      this.importedData.length = 0;
      this.importErrorData.length = 0;
      this.$emit("close-dialog");
    },
    // 拖拽操作
    onUploadAreaDrop(e) {
      e.preventDefault();
      parseExcel(e.dataTransfer.files[0], [], res => {
        this.conditionalJudgment(res);
      });
    },
    transformArticleCodeProductSheetData(excelData, context) {
      const columns = this.importFields;
      validateData(excelData, columns, context);
      const transformedData = excelData.map((item, rowIndex) => {
        let obj = {};
        columns.forEach((column, index) => {
          if (!item[column.label] && item[column.label] !== 0) return;
          obj[column.prop] = item[column.label];
          if (column.type === "date") {
            if (isNaN(Number(item[column.label]))) {
              obj[column.prop] = dayjs(item[column.label]).format("YYYY-MM-DD");
            } else {
              obj[column.prop] = dayjs(Number(item[column.label])).format(
                "YYYY-MM-DD"
              );
            }
          }
        });
        return obj;
      });
      return transformedData;
    },
    onUploadAreaDragOver: e => e.preventDefault(),
    conditionalJudgment(res) {
      if (
        (!this.value || this.value.length === 0) &&
        this.typeLabel === "商品价格编辑"
      ) {
        return this.showMessage("请选择需要进行价格编辑的商户。", "error");
      }
      if (!res[1]) {
        return this.showMessage(
          "导入文件与当前编辑内容不符，请重新下载最新的模板。",
          "error"
        );
      }
      const { data: hasCodeData, columns } = res[1]; //根据导入的数据获取到相应的值
      if (columns.length !== this.importFields.length) {
        return this.showMessage(
          "导入文件与当前编辑内容不符，请重新下载最新的模板。",
          "error"
        );
      }
      const importColumns = this.importFields.map(item => item.label);
      for (let i of importColumns) {
        if (!columns.includes(i)) {
          return this.showMessage(
            "导入文件与当前编辑内容不符，请重新下载最新的模板。",
            "error"
          );
        }
      }
      if (!hasCodeData.length) {
        return this.showMessage("导入数据不能为空", "error");
      }
      if (hasCodeData.length > 10000) {
        return this.$message.error("导入失败，上限不能超过10000条。");
      }
      const articleCodeProductSheetData = this.transformArticleCodeProductSheetData(
        hasCodeData,
        this
      );
      //校验是否有必填项
      if (
        articleCodeProductSheetData &&
        articleCodeProductSheetData.length > 0
      ) {
        const columns = this.importFields;
        for (let item of columns) {
          if (item.require == true) {
            const { prop, label } = item;
            if (
              !!articleCodeProductSheetData.find(i => !i[prop] && i[prop] != 0)
            ) {
              return this.$message.error(`${label}必填`);
            }
          }
        }
      }
      this.setImportedData([...articleCodeProductSheetData]);
    },
    getShopList() {}
  }
};

function validateData(excelData, columns, context) {
  for (let item of excelData) {
    columns.forEach((column, index) => {
      let rules = column.rules;
      if (rules && rules.length > 0) {
        for (let rule of rules) {
          if (rule.required) {
            if (
              item[column.label] == null ||
              item[column.label] === undefined
            ) {
              context.$message.error(rule.message);
              throw new Error("error");
            }
          } else if (rule.validator) {
            if (
              item[column.label] !== undefined &&
              item[column.label] != null &&
              !rule.validator(item[column.label])
            ) {
              context.$message.error(rule.message);
              throw new Error("error");
            }
          }
        }
      }
    });
  }
}
</script>

<style lang="less" scoped>
.import-data {
  text-align: center;
}

.imported-page {
  .imported-counter {
    margin: 10px 0;
  }
}

.upload-area {
  border-radius: 4px;
  border: dashed #ccc 1px;
  padding: 20px 0;

  .upload-area-icon {
    width: 20px;
  }

  .upload-area-title {
    font-weight: bold;
  }

  & .drop-tip,
  & .import-data-tip {
    font-size: 12px;
  }

  &:hover {
    cursor: pointer;
    background-color: rgb(244, 248, 255);
  }
}
.step-item {
  font-weight: bold;
  text-align: left;
}
.step-select {
  margin: 10px 0px 20px 60px;
  display: flex;
  justify-content: flex-start;
  width: 50%;
}
.step-item__excel {
  margin: 10px 0px 20px 60px;
  text-align: left;
}
.step-item__upload {
  margin: 10px 30px 20px 60px;
}
</style>
