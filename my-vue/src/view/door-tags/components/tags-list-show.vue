<template>
  <div
    ref="divRef"
    class="tagLine">
    <el-tooltip
      v-for="(tag) in showTags"
      ref="divItem"
      :content="tag.name"
      :disabled="getTextWidth(tag.name)<=limitLong"
      :key="tag.name"
      placement="top"
      class="flexItem">
      <el-tag
        :key="tag.name"
        :disable-transitions="true"
        :type="tag.type"
        size="medium"
      >
        {{ changeTextToOmit(tag.name) }}
      </el-tag>
    </el-tooltip>
    <el-popover
      v-if="tagsLengthOver"
      placement="right"
      title=""
      width="400"
      trigger="click"
      popper-class="tagLine">
      <el-tooltip
        v-for="(tag) in tags"
        ref="divItem"
        :content="tag.name"
        :disabled="getTextWidth(tag.name)<=limitLong"
        :key="tag.name"
        placement="top"
        class="flexItem">
        <el-tag
          :key="tag.name"
          :disable-transitions="true"
          :type="tag.type"
          size="medium"
        >
          {{ changeTextToOmit(tag.name) }}
        </el-tag>
      </el-tooltip>
      <el-tag
        v-if="tagsLengthOver"
        slot="reference"
        class="flexItem">...</el-tag>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: 'TagItem',
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showIndex: '', // 第几个显示为输入框
      inputValue: '', // tags中的输入框的值
      // inputVisible: false,
      limitLong: 50, // tagsitem中的最大长度显示...
      minWidth: 20, // tags中输入框的最小宽度
      maxWidth: 70, // tags中输入框的最大宽度
      dialogTableVisible: false,
      showTags: '',
      tagsLengthOver: ''
    }
  },
  watch: {
    tags: {
      handler (val) {
        this.getShowTags(val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getTextWidth (text, font) {
      // re-use canvas object for better performance
      var canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement('canvas'))
      var context = canvas.getContext('2d')
      context.font = font
      var metrics = context.measureText(text)
      return metrics.width
    },

    changeTextToOmit (value) {
      const long = this.getTextWidth(value)
      let outValue = ''
      for (let i of value) {
        if (this.getTextWidth(outValue + i) > this.limitLong) {
          break
        }
        outValue += i
      }
      if (long > this.limitLong) {
        return outValue + '...'
      } else {
        return value
      }
    },
    getShowTags (val) {
      if (!val) val = []
      this.showTags = val.slice(0, 3)
      this.tagsLengthOver = val.length > 3
    }
  }
}
</script>
<style scoped lang="less">
.tagLine{
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    overflow: hidden;
    .flexItem{
        height: 30px;
        max-width: 110px;
        box-sizing: content-box;
        margin-right: 5px;
        margin-bottom: 5px;
        /deep/.el-tag{
            height: 30px;
            line-height: 28px;
        }
    }
    /deep/.inputClass{
        margin: 0;
        height: 32px;
        .el-input__inner{
            margin: 0;
            height: 30px;
            width: 20px;
            min-width: 20px;
            max-width: 100px;
            box-sizing: content-box;
        }
        .el-input__suffix{
            right: 6px;
        }
        // width: 100px;
    }
}
.addTags{
    display: flex;
    flex-direction: row;
    align-items: center;
    background: rgba(255, 255, 255, 0);
    padding: 5px 5px;
    border-radius: 10%;
    border: 1px dashed #EB6C00;
    color: #EB6C00;
    height: 32px;
}
.addTags:hover{
    cursor:pointer;
    background: #eb6e001e;
}
.tagsWrap{
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    width: 400px;
    background: #FFFFFF;
    border: 1px solid #CCCCCC;
}
</style>
