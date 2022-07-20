<template>
  <div class="headButtonStyle">
    <div
      v-for="(btn,index) in buttonItems"
      :key="index"
      class="headButtonItems"
    >
      <MoreHeaderButton
        v-if="('show' in btn ? (typeof btn.show === 'function' ? btn.show(clickData) : btn.show ): true) && (btn.buttonItems && btn.buttonItems.length>0)"
        v-bind="btn"
        :click-data="clickData"
      />
      <self-loading-button
        v-if="('show' in btn ? typeof btn.show === 'function' ? btn.show(clickData) : btn.show : true) && (!btn.buttonItems || btn.buttonItems.length===0)"
        class="spanStyle"
        :disabled="'disabled' in btn ? btn.disabled(clickData) : false"
        :type="btn.type"
        :click="()=>btn.atClick(clickData)"
      >
        {{ typeof btn.text === "function" ? btn.text(clickData) : btn.text }}
      </self-loading-button>
    </div>
  </div>
</template>
<script>
import MoreHeaderButton from '../more-header-button/index.vue'
import SelfLoadingButton from '../more-header-button/self-loading-button.vue';
export default {
    name: "newHeaderButton",
    components: { MoreHeaderButton, SelfLoadingButton },
    props: {
        buttonItems: {
            type: Array,
            default: ()=>[]
        },
        clickData: {
          type: Object,
          default: ()=>{}
        }
    },
    data() {
        return {
        };
    },
}
</script>
<style scoped lang="less">
    .marginLeft5{
        margin-left:5px;
    }
    .headButtonStyle{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      .headButtonItems{
        margin-left: 5px;
      }
    }
</style>
