<template>
  <div>
    <el-data-table
      ref="dataTable"
      v-bind="tableConfig">
      <el-table-column
        v-if="tagsGroupPermission"
        label="标签组名称"
        prop="name"
        width="180px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-input
            v-focus
            v-if="scope.row.isEditing"
            v-model="scope.row.name"
            @blur="(e) => handleBlur(scope.row, e.target.value, scope.$index)"
          />
          <div
            v-else
            :title="scope.row.name"
            class="input-tagsGroup"
            @click="handleClick(scope.row, scope.$index)"
          >
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-else
        label="标签组名称"
        prop="name"
        width="180px"
        show-overflow-tooltip
      />
      <el-table-column
        label="标签名称"
        prop="tagInfoVOList"
        min-width="220px"
      >
        <template slot-scope="scope">
          <tag-item
            :type="1"
            :tags="scope.row.tagInfoList"
            :tags-group="{id:scope.row.id,name:scope.row.name}"
            @updateList="updateList"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="tagsGroupPermission"
        width="80px">
        <template
          slot="header">
          操作
        </template>
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="handleDelete(scope.row)">删除组</el-button>
        </template>
      </el-table-column>
    </el-data-table>
    <edit-dialog
      :dialog-table-visible="dialogTableVisible"
      title="新建标签组"
      @changeDialogView="changeDialogView"
      @submitValue="submitValue"
    />
  </div>
</template>
<script>
import tagItem from '../components/tag-item'
import editDialog from '../components/edit-dialog'
import tableEdingMixins from '../../../../mixins/tableEdingMixins'
import {viewTagsGroupUrl, createTagsGroup, updateTagsGroup, deleteTagsGroup} from '../../../../services/door-tags'

export default {
  name: 'DoorTags',
  components: {
    tagItem,
    editDialog
  },
  mixins: [tableEdingMixins(updateTagsGroup)],
  data () {
    return {
      dialogTableVisible: false,
      tableConfig: {
        url: viewTagsGroupUrl,
        hasEdit: false,
        hasDelete: false,
        hasNew: false,
        hasOperation: false,
        extraQuery: {type: 1},
        // extraButtons:[
        //     {
        //         type: 'primary',
        //         text: '删除组',
        //         style: "width:80px",
        //         atClick: (row)=>{
        //             console.log(row)
        //         }
        //     }
        // ],
        headerButtons: [
          {
            type: 'primary',
            text: '新增标签组',
            show: () => {
              return this.tagsGroupPermission
            },
            atClick: (row) => {
              this.changeDialogView(true)
            }
          }
        ],
        searchForm: [
          {
            type: 'input',
            id: 'groupName',
            el: {
              placeholder: '标签组名称',
              clearable: true,
              'prefix-icon': 'el-icon-search'
            }
          },
          {
            type: 'input',
            id: 'tagName',
            el: {
              placeholder: '标签名称',
              clearable: true,
              'prefix-icon': 'el-icon-search'
            }
          }
        ]
      }
    }
  },
  computed: {
    // 标签组的权限点控制
    tagsGroupPermission: () => {
      return sessionStorage
        .getItem('authMenuButtons')
                  ?.includes(
                    '/merchant/business/dictionary/tags-management_tagGroup_/merchant/business/dictionary/tags-management_tagGroup_标签组'
                  )
    }
  },
  mounted () {
  },
  methods: {
    changeDialogView (val) {
      this.dialogTableVisible = val
    },
    handleDelete (row) {
      const h = this.$createElement
      this.$msgbox(
        {
          title: '提示',
          message:
                h('div', null, [
                  h('p', null, [
                    h('span', null, '删除标签组后，标签组内的'),
                    h('span', {style: 'color:#EB6C00'}, '标签将全部删除'),
                    h('span', null, '。')
                  ]),
                  h('p', null, '是否确定删除标签组？')
                ]),
          showCancelButton: true,
          cancelButtonText: '取消',
          confirmButtonText: '确定'
        })
        .then(() => {
          const params = {
            id: row.id
          }
          deleteTagsGroup(params).then(res => {
            if (res?.payload?.isSuccess) {
              this.$message.success('删除标签组成功')
              this.updateList()
            }
          })
        })
    },
    submitValue (val) {
      const params = {
        type: 1,
        name: val,
        mutex: true
      }
      createTagsGroup(params).then(res => {
        if (res?.payload?.isSuccess) {
          this.$message.success('新增标签组成功')
          this.dialogTableVisible = false
          // this.updateList()
          this.$refs.dataTable.resetSearch()
        }
      })
    },
    updateList () {
      this.$refs.dataTable.getList()
    }
  }
}
</script>
<style scoped lang="less">
.input-tagsGroup{
    cursor: pointer;
    height:32px;
    width:160px;
    line-height:32px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.input-tagsGroup:hover{
  border: 1px solid rgb(220, 223, 230);
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
