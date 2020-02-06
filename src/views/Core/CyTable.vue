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
      :max-height="countHeight(maxHeight)"
      :size="size"
      :align="align"
      style="width:100%;"
      :header-cell-style="{ 'color': '#FFF','background-color': 'rgb(20, 136, 154)'}"
    >
      <el-table-column type="selection" width="50" v-if="showBatchDelete || showBatchDisableOperation || showBatchEnableOperation" fixed="left"></el-table-column>
      <el-table-column type="index" width="50" v-if="showIndex" fixed="left"></el-table-column>

      <template v-for="(column,index) in columns">
        <el-table-column
          header-align="center"
          align="center"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="countfixed(index)"
          :key="column.prop"
          :type="column.type"
          :formatter="column.formatter"
          :sortable="column.sortable==null?true:column.sortable"
          :show-overflow-tooltip="column.showOverflowTooltip == null ? false : true"
        >
          <template slot-scope="scope">
            <template v-if="!column.render">
              <template v-if="column.formatter">
                <div
                  v-html="column.formatter(scope.row, column,scope.row[column.prop],scope.index)"
                ></div>
              </template>
              <template v-else>
                <span>{{scope.row[column.prop]}}</span>
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
        width="185"
        fixed="right"
        v-if="showOperation"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <kt-button
            icon="fa fa-edit"
            :label="permsEditLable == null ? $t('action.edit'):permsEditLable"
            :show="showEditOperation"
            :perms="permsEdit"
            :size="size"
            :disabled="scope.row.disabled"
            @click="handleEdit(scope.$index, scope.row)"
          />
          <kt-button
            icon="fa fa-trash"
            :label="$t('action.delete')"
            :show="showDeleteOperation"
            :perms="permsDelete"
            :size="size"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          />
          <kt-button
            :label="$t('action.enable')"
            :show="showEnableOperation && scope.row.status == 1"
            :perms="permsEnable"
            :size="size"
            type="success"
            @click="handleUpStatus(scope.row,0)"
          />
          <kt-button
            :label="$t('action.disable')"
            :show="showDisableOperation  && scope.row.status == 0"
            :perms="permsDisable"
            :size="size"
            type="danger"
            @click="handleUpStatus(scope.row,1)"
          />
          <kt-button
            icon="fa fa-search"
            :label="$t('action.detail')"
            :show="showDetailOperation"
            :size="size"
            type="success"
            @click="handleDetail(scope.$index, scope.row)"
          />
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
        v-if="showBatchDelete & showOperation"
      />
      <kt-button
        :label="$t('action.batchDisable')"
        :perms="permsDisable"
        :size="size"
        type="danger"
        @click="handleBatchUpStatus(1)"
        :disabled="this.selections.length===0"
        style="float:left;"
        v-if="showBatchDisableOperation & showOperation"
      />
      <kt-button
        :label="$t('action.batchEnable')"
        :perms="permsEnable"
        :size="size"
        type="success"
        @click="handleBatchUpStatus(0)"
        :disabled="this.selections.length===0"
        style="float:left;"
        v-if="showBatchEnableOperation & showOperation"
      />
      <el-pagination
        layout="total, prev, pager, next, jumper,sizes"
        @current-change="refreshPageRequest"
        :current-page="pageRequest.pageNum"
        :page-size="pageRequest.pageSize"
        :total="totalSize"
        style="float:right;"
        :page-sizes="[5,10, 20, 30, 40]"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton";
import { exportExcel } from "@/utils/excel";
import { formatDate } from "@/utils/datetime";

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
    permsDisable: String, // 禁用权限标识
    permsEnable: String, // 启用权限标识
    permsDetail: String, // 详情权限标识
    permsEditLable: String,
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
    // 是否显示禁用
    showDisableOperation: {
      type: Boolean,
      default: false
    },
    //是否显示启用
    showEnableOperation: {
      type: Boolean,
      default: false
    },
    // 是否显示批量禁用
    showBatchDisableOperation: {
      type: Boolean,
      default: false
    },
    //是否显示批量启用
    showBatchEnableOperation: {
      type: Boolean,
      default: false
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
    }
  },
  data() {
    return {
      totalSize: 0,
      content: [],
      // 分页信息
      pageRequest: {
        pageNum: 1,
        pageSize: 10
      },
      loading: false, // 加载标识
      selections: [] // 列表选中列
    };
  },
  methods: {
    // 分页查询
    findPage: function(filters) {
      //this.loading = true
      var this_ = this;
      if (filters == undefined || filters == null) {
        filters = {};
      }
      filters.start = this.pageRequest.pageNum;
      filters.limit = this.pageRequest.pageSize;
      this.utils.request.queryUserPage(filters, function(res) {
        if (res.rows == null) {
          res.rows = [];
        }
        // this_.content = res.rows;
        // this_.totalSize = Number(res.total);
        this_.content = filters.content;
        this_.totalSize = Number(filters.total);
      });


    },
    /*findPage: function (res) {
      this.content = res.content;
      this.totalSize = Number(res.total);
      this.loading = false
    },*/

    // 分页查询
    findPageBeforeRestPages: function(filters) {
      //this.loading = true
      var this_ = this;
      if (filters == undefined || filters == null) {
        filters = {};
      }
      filters.start = 1;
      filters.limit = this.pageRequest.pageSize;
      this.utils.request.queryUserPage(filters, function(res) {
        if (res.rows == null) {
          res.rows = [];
        }
        this_.content = res.rows;
        this_.totalSize = Number(res.total);
      });
    },

    //excle导出
    exportData(filters, filterColumns, fileName) {
      if (filters == undefined || filters == null) {
        filters = {};
      }
      filters.start = null;
      filters.limit = null;
      this.utils.request.queryUserPage(filters, res => {
        if (fileName == undefined || fileName == null) {
          fileName = "excel-list";
        }

        fileName = fileName + "_" + formatDate(new Date(), "yyyyMMdd");

        if (res.rows == null) {
          this.$message({ message: "暂无需要导出的数据 ", type: "error" });
          return;
        }

        exportExcel(res.rows, filterColumns, fileName);
      });
    },
    init: function() {
      this.$emit("findPage");
    },
    // 选择切换
    selectionChange: function(selections) {
      this.selections = selections;
      this.$emit("selectionChange", { selections: selections });
    },
    // 选择切换
    handleCurrentChange: function(val) {
      this.$emit("handleCurrentChange", { val: val });
    },
    // 换页刷新
    refreshPageRequest: function(pageNum) {
      this.pageRequest.pageNum = pageNum;
      this.init();
    },
    // 换页刷新
    handleSizeChange: function(pageSize) {
      this.pageRequest.pageSize = pageSize;
      this.pageRequest.pageNum = 1;
      this.init();
    },
    // 编辑
    handleEdit: function(index, row) {
      this.$emit("handleEdit", { index: index, row: row });
    },
    // 删除
    handleDelete: function(index, row) {
      this.delete(row.id);
    },
    // 批量删除
    handleBatchDelete: function() {
      let ids = this.selections.map(item => item.id).toString();
      this.delete(ids);
    },
    handleDetail: function(index, row) {
      this.$emit("handleDetail", { index: index, row: row });
    },
    //修改状态：禁用启用
    handleUpStatus:function (row,type) {
      this.upStatus(row.id,type)
    },
    //批量修改状态：禁用启用
    handleBatchUpStatus:function (type) {
      let ids = this.selections.map(item => item.id).toString();
      this.upStatus(ids,type);
    },
    //修改状态：禁用启用
    upStatus:function (ids,type) {
      let statusTxt = "启用";
      if (type && Number(type) == 1){
        statusTxt = "禁用";
      }
      this.$confirm("确认" + statusTxt +"选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          let params = [];
          let idArray = (ids + "").split(",");
          for (var i = 0; i < idArray.length; i++) {
            params.push({ id: idArray[i] });
          }
          this.$emit("handleUpStatus", { params: params,type:type});
        })
        .catch(() => {});
    },

    // 删除操作
    delete: function(ids) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          let params = [];
          let idArray = (ids + "").split(",");
          for (var i = 0; i < idArray.length; i++) {
            params.push({ id: idArray[i] });
          }
          //this.loading = true
          let callback = res => {
            if (res.code == "0000") {
              this.$message({ message: "删除成功", type: "success" });
              this.init();
            } else {
              this.$message({ message: "操作失败, " + res.msg, type: "error" });
            }
            this.loading = false;
          };
          this.$emit("handleDelete", { params: params, callback: callback });
        })
        .catch(() => {});
    },
    countfixed(index) {
      if (index <= 3) {
        return true;
      } else {
        return false;
      }
    },
    resetForm() {
      this.pageRequest = {
        pageNum: 1,
        pageSize: 10
      };
    },
    countHeight(height) {
      var winHeight =
        document.body.clientHeight || document.documentElement.clientHeight;
      if (height > winHeight * 0.7) {
        height = winHeight * 0.7;
      }
      return height;
    },
    countIdDisabled(){
      return true;
    }
  },
  mounted() {
    this.refreshPageRequest(1);
  }
};
</script>

 <<style   scoped>
  /deep/  .el-table .sort-caret.ascending {
  border-bottom-color: #FFF;
  top: 5px;
}
  /deep/  .el-table .sort-caret.descending {
  border-top-color: #FFF;
  bottom: 7px;
}

 /deep/  .el-table .ascending .sort-caret.ascending {
    border-bottom-color: rgb(20, 136, 154);
}

 /deep/  .el-table .descending .sort-caret.descending {
    border-top-color: rgb(20, 136, 154);
}


/*
/deep/ .el-table__body .el-table__row.hover-row td{
	   	 background: #ffdd40!important
	}  */
/*
/deep/ .el-table__body .el-table__row.hover-row td{
	   	color: rgb(255, 255, 255); background-color: rgb(64, 158, 255);
	}


 /deep/ .el-table--striped .el-table__body tr.el-table__row--striped.current-row td {
    	color: rgb(255, 255, 255);
     background-color: rgb(64, 158, 255);
}
  */
 </style>
