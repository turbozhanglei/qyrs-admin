<template>
  <div>
    <!--表格栏-->
    <el-table
      :data="content"
      :highlight-current-row="highlightCurrentRow"
      @selection-change="selectionChange"
      @current-change="handleCurrentChange"
      v-loading="loading"
      :element-loading-text="$t('action.loading')"
      :border="border"
      :stripe="stripe"
      :show-overflow-tooltip="showOverflowTooltip"
      :max-height="maxHeight"
      :size="size"
      :align="align"
      style="width:100%;"
      :header-cell-style="{ 'color': '#FFF','background-color': '#409EFF'}">
      <el-table-column type="selection" width="50" v-if="showSelection" fixed="left"></el-table-column>
      <el-table-column type="index" width="50" v-if="showIndex"></el-table-column>

      <template v-for="column in columns">
        <el-table-column
          header-align="center"
          align="center"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :key="column.prop"
          :type="column.type"
          :formatter="column.formatter"
          :sortable="column.sortable==null?true:column.sortable">
          <template slot-scope="scope">
            <template v-if="!column.render">
                <template v-if="column.formatter">
                  <div v-html="column.formatter(scope.row, column,scope.row[column.prop],scope.index)"></div>
                </template>
                <template v-else>
                    <template v-if="column.showImg">
                      　<img :src="scope.row[column.prop]" width="30" height="30"/>
                    </template>
                    <template v-else>
                      <span>{{scope.row[column.prop]}}</span>
                    </template>
                  </template>
                </template>
            <template v-else>
                <expand-dom :column="column" :row="scope.row" :render="column.render" :index="index"></expand-dom>
            </template>
          </template>
        </el-table-column>
      </template>

      <el-table-column
        :label="$t('action.operation')"
        :width="operationWidth"
        fixed="right"
        v-if="showOperation"
        header-align="center"
        align="center">
          <template slot-scope="scope">
            <kt-button
              icon="fa fa-edit"
              :label="$t('action.edit')"
              :show="showEditOperation"
              :perms="permsEdit"
              :size="size"
              @click="handleEdit(scope.$index, scope.row)"/>
            <kt-button
              icon="fa fa-trash"
              :label="$t('action.delete')"
              :show="showDeleteOperation"
              :perms="permsDelete"
              :size="size"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"/>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.detail')"
              :show="showDetailOperation"
              :size="size"
              type="success"
              @click="handleDetail(scope.$index, scope.row)"/>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.detail')"
              :show="showMockOperation"
              :size="size"
              type="success"
              @click="clinkMock()"/>
            <kt-button
              :label="customLabel"
              :show="showCustomOperation"
              :size="size"
              type="active"
              @click="handleCustom(scope.$index, scope.row)"/>
          </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <kt-button
        :label="$t('action.batchDelete')"
        :perms="permsDelete"
        :size="size"
        type="danger"
        @click="handleBatchDelete()"
        :disabled="this.selections.length===0"
        style="float:left;"
        v-if="showBatchDelete & showOperation"/>
      <kt-button
        :label="$t('action.batchReview')"
        :size="size"
        type="primary"
        @click="handleBatchReview()"
        :disabled="this.selections.length===0"
        style="float:left;"
        v-if="showBatchReview & showOperation"/>
      <el-pagination
        layout="total, prev, pager, next, jumper,sizes"
        @current-change="refreshPageRequest"
        :current-page="pageRequest.pageNum"
        :page-size="pageRequest.pageSize"
        :total="totalSize"
        style="float:right;"
        :page-sizes="[10, 20, 30, 40]"
        @size-change="handleSizeChange"></el-pagination>
    </div>
  </div>
</template>

<script>
  import KtButton from "@/views/Core/KtButton";
  import {exportExcel} from "@/utils/excel";
  import {formatDate} from "@/utils/datetime";

  export default {
    name: "CyTable",
    components: {
      KtButton
    },
    props: {
      columns: Array, // 表格列配置
      data: Object, // 表格分页数据
      permsEdit: String, // 编辑权限标识
      permsDelete: String, // 删除权限标识
      permsDetail: String, // 详情权限标识
      operationWidth: {
        type: Number,
        default: 185
      },
      size: {
        // 尺寸样式
        type: String,
        default: "mini"
      },
      align: {
        // 文本对齐方式
        type: String,
        default: "left"
      },
      maxHeight: {
        // 表格最大高度
        type: Number,
        default: 900
      },
      height: {
        // 表格最大高度
        type: Number,
        default: 500
      },
      showOperation: {
        // 是否显示操作组件
        type: Boolean,
        default: true
      },
      border: {
        // 是否显示边框
        type: Boolean,
        default: false
      },
      stripe: {
        // 是否显示斑马线
        type: Boolean,
        default: true
      },
      highlightCurrentRow: {
        // // 是否高亮当前行
        type: Boolean,
        default: true
      },
      showOverflowTooltip: {
        // 是否单行显示
        type: Boolean,
        default: true
      },
      showBatchDelete: {
        // 是否显示操作组件
        type: Boolean,
        default: true
      },
      showDeleteOperation: {
        // 是否显示操作组件
        type: Boolean,
        default: true
      },
      showEditOperation: {
        // 是否显示操作组件
        type: Boolean,
        default: true
      },
      showDetailOperation: {
        // 是否显示操作组件
        type: Boolean,
        default: false
      },
      showIndex: {
        // 是否显示操作组件
        type: Boolean,
        default: false
      },
      showSelection: {
        // 是否显示操作组件
        type: Boolean,
        default: true
      },
      customLabel: {
        // 是否显示操作组件
        type: String,
        default: ""
      },
      showCustomOperation: {
        // 是否显示操作组件
        type: Boolean,
        default: false
      },
      showMockOperation: {
        //mock操作按钮
        type: Boolean,
        default: false
      },
      showBatchReview: {
        // 是否显示批量审核按钮
        type: Boolean,
        default: false
      },
       showhandExamine: {
        // 是否审核按钮
        type: Boolean,
        default: false
      },
      content: {
        type: Array,
        default: []
      },
      totalSize: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        // 分页信息
        pageRequest: {
          pageNum: 1,
          pageSize: 10
        },
        loading: false, // 加载标识
        selections: [],// 列表选中列
        mock_title: null,
      };
    },
    methods: {
      //根据日期来进行查询
      findPageByDate: function (filters) {
        //this.loading = true
        var this_ = this;
        if (filters == undefined || filters == null) {
          filters = {};
        }
        this.utils.request.queryUserList(filters, function (res) {
          if (res.data == null) {
            res.data = [];
          }
          this_.content = res.data;
          this_.totalSize = res.data.length;
        });
      },

      //excle导出
      exportData(filters, filterColumns, fileName) {
        if (filters == undefined || filters == null) {
          filters = {};
        }
        filters.start = null;
        filters.limit = null;
        this.utils.request.queryUserPage(filters, function (res) {
          if (fileName == undefined || fileName == null) {
            fileName = "excel-list";
          }

          fileName = fileName + "_" + formatDate(new Date(), "yyyyMMdd");

          exportExcel(res.rows, filterColumns, fileName);
        });
      },
      init: function (pageNum) {
        this.$emit("findPage",pageNum);
      },
      // 选择切换
      selectionChange: function (selections) {
        this.selections = selections;
        this.$emit("selectionChange", {selections: selections});
      },
      // 选择切换
      handleCurrentChange: function (val) {
        this.$emit("handleCurrentChange", {val: val});
      },
      // 换页刷新
      refreshPageRequest: function (pageNum) {
        this.pageRequest.pageNum = pageNum;
        this.init(pageNum);
      },
      // 换页刷新
      handleSizeChange: function (pageSize) {
        this.pageRequest.pageSize = pageSize;
        this.pageRequest.pageNum = 1;
        this.init();
      },
      // 编辑
      handleEdit: function (index, row) {
        this.$emit("handleEdit", {index: index, row: row});
      },
      // 删除
      handleDelete: function (index, row) {
        this.delete(row.id);
      },
      // 批量删除
      handleBatchDelete: function () {
        let ids = this.selections.map(item => item.id).toString();
        this.delete(ids);
      },
      // 批量审核
      handleBatchReview: function () {
        let ids = this.selections.map(item => item.id).toString();
        this.$emit("handleBatchReview", {ids:ids});
      },
      handleDetail: function (index, row) {
        this.$emit("handleDetail", {index: index, row: row});
      },
      //审核
      handExamine: function (index, row) {
        this.$emit("handExamine", {index: index, row: row});
      },
      handleCustom: function (index, row) {
        this.$emit("handleCustom", {index: index, row: row});
      },
      // 删除操作
      delete: function (ids) {
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        })
          .then(() => {
            let params = [];
            let idArray = (ids + "").split(",");
            for (var i = 0; i < idArray.length; i++) {
              params.push({id: idArray[i]});
            }
            //this.loading = true
            let callback = res => {
              if (res.code == "0000") {
                this.$message({message: "删除成功", type: "success"});
                this.init();
              } else {
                this.$message({message: "操作失败, " + res.msg, type: "error"});
              }
              this.loading = false;
            };
            this.$emit("handleDelete", {params: params, callback: callback});
          })
          .catch(() => {
          });
      },
      findPageMock: function (pageResultDetail) {
        var this_ = this;
        this_.content = pageResultDetail.rows;
        this_.totalSize = Number(pageResultDetail.total);
        this_.mock_title = pageResultDetail.mock_title;
      },
      clinkMock: function () {
        this.$alert(this.mock_title);
      },
      batchOperationMock: function (mock_title) {
        var this_ = this;
        this.$alert(this.selections.length);
        if (this.selections.length.toString() == "0") {
          this_.mock_title = "请选择至少一条记录";
          this.clinkMock();
        } else {
          this_.mock_title = mock_title;
          this.clinkMock();
        }
      }
    },
    mounted() {
      this.refreshPageRequest(1);
    }
  };
</script>

<style scoped>
  /deep/ .el-table .sort-caret.ascending {
    border-bottom-color: #FFF;
    top: 5px;
  }

  /deep/ .el-table .sort-caret.descending {
    border-top-color: #FFF;
    bottom: 7px;
  }

  /deep/ .el-table .ascending .sort-caret.ascending {
    border-bottom-color: #409eff;
  }

  /deep/ .el-table .descending .sort-caret.descending {
    border-top-color: #409eff;
  }
</style>
