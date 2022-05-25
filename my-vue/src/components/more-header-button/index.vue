<template>
    <el-dropdown trigger="click" class="marginLeft5" v-if="showButtonItems.length>0">
        <el-button :type="nameType">
        <span>{{name}}</span>
        <span class="vertical" v-if="verticalLine"></span>
        <i class="el-icon-arrow-down"/>
        <!-- <i class="el-icon-arrow-down"/> -->
        </el-button>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item 
            v-for="(btn,i) in buttonItems" 
            :key="i"
            >
                <span
                class="spanStyle"
                v-if="'show' in btn ? typeof btn.show === 'function' ? btn.show(clickData) : btn.show : true"
                @click="btn.atClick(clickData)">
                    {{btn.text}}
                </span>
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<script>
export default {
    name: 'more-header-button',
    props:{
        name: {
            type: String,
            default: ''
        },
        nameType:{
            type: String,
            default: ''
        },
        verticalLine:{
            type: Boolean,
            default: false
        },
        clickData:{
            type: Object,
            default: () => {{}}
        },
        buttonItems:{
            type: Array,
            default: () => {[]}
        }
    },
    data(){
        return{
            showButtonItems:[]
        }
    },
    mounted(){
        this.showButtonItems = this.getShowButtonItems()
    },
    methods:{
        getShowButtonItems(){
            const arr = []
            for(let btn of this.buttonItems){
                if('show' in btn ? typeof btn.show === 'function' ? btn.show(this.clickData) : btn.show : true){
                    arr.push(btn)
                }
            }
            return arr
        }
    }
    
}
</script>
<style scoped lang="less">
    .marginLeft5{
        margin-left:5px;
    }
    .spanStyle{
        display: inline-block;
        height: 100%;
        width: 100%;
    }
    .vertical{
        margin:0 3px;
        display: inline-block;
        height:10px;
        border:2px solid #FFFFFF;
        border-width:0 1px 0 0;
    }
</style>