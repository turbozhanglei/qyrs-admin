<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-row>
          <el-form-item>
            <el-input v-model="filters.number" placeholder="申请单编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.product_code" placeholder="客户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              type="primary"
              @click="$refs.CyTable.findPageBeforeRestPages(filters)"
            />
          </el-form-item>
          <!-- <el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.excel')" perms="sys:user:add" type="primary" @click="handleAdd" />
          </el-form-item>-->
          <el-form-item>
            <kt-button
              :label="$t('action.reset')"
              type="primary"
              @click="reset"
              icon="el-icon-refresh"
            />
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
      <el-form :inline="true" :size="size">
        <el-form-item>
          <el-button-group>
            <el-tooltip content="刷新" placement="top">
              <el-button icon="fa fa-refresh" @click="$refs.CyTable.findPageBeforeRestPages(filters)"></el-button>
            </el-tooltip>
            <el-tooltip content="列显示" placement="top">
              <el-button icon="fa fa-filter" @click="displayFilterColumnsDialog"></el-button>
            </el-tooltip>
            <el-tooltip content="导出" placement="top">
              <el-button icon="fa fa-file-excel-o" @click="downloadExcel" id="downloadExcel"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-form-item>
      </el-form>
      <!-- 表格显示列界面 -->
      <table-column-filter-dialog
        ref="tableColumnFilterDialog"
        :columns="columns"
        @handleFilterColumns="handleFilterColumns"
      ></table-column-filter-dialog>
    </div>
    <!--表格内容栏-->
    <cy-table
      :height="350"
      ref="CyTable"
      :data="pageResult"
      :columns="filterColumns"
      :showBatchDelete="false"
      :showDeleteOperation="false"
      :showEditOperation="false"
      :showDetailOperation="true"
      @handleDetail="handleDetail"
      @findPage="findPage"
    ></cy-table>
    <!--详情页面-->
    <el-dialog
      title="非订单出库明细"
      width="80%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="true"
    >
      <el-table :data="tableData" :columns="columnsdetail">
        <el-table-column fixed prop="number" label="申请单号" width="150"></el-table-column>
        <el-table-column fixed prop="sku_name" label="产品名称" width="150"></el-table-column>
        <el-table-column fixed prop="client_name" label="客户名称" width="150"></el-table-column>
        <el-table-column prop="sku_level" label="产品规格" width="150"></el-table-column>
        <el-table-column prop="sku_number" label="产品代码" width="150"></el-table-column>
        <el-table-column prop="sku_type_number" label="类别编号" width="150"></el-table-column>
        <el-table-column prop="sku_type_text" label="类别名称" width="150"></el-table-column>
        <el-table-column prop="roduction_date" label="生产日期" width="150"></el-table-column>
        <el-table-column prop="create_time" label="入库时间" width="150"></el-table-column>
        <el-table-column prop="setting_num" label="存放货位" width="150"></el-table-column>
        <el-table-column prop="num" label="出库数量（件数）" width="150"></el-table-column>
      </el-table>
      <!--分页栏-->
      <div class="toolbar" style="padding:10px;">
        <el-pagination
          layout="total, prev, pager, next, jumper,sizes"
          @current-change="refreshPageRequest"
          @size-change="handleSizeChange"
          :current-page="pageRequest.pageNum"
          :page-size="pageRequest.pageSize"
          :total="totalSize"
          style="float:right;"
          :page-sizes="[5,10, 20, 30, 40]"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import CyTable from "@/views/Core/CyTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format } from "@/utils/datetime";
export default {
  components: {
    PopupTreeInput,
    CyTable,
    KtButton,
    TableColumnFilterDialog
  },
  data() {
    return {
      size: "small",
      filters: {
        name: ""
      },
      pageResult: {},
      columns: [],
      tableData: [],
      columnsdetail: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {},
      deptData: [],
      totalSize: 0,
      deptTreeProps: {
        label: "name",
        children: "children"
      },
      roles: [],
      query: {}
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "wOrderNoSaleSku";
      this.filters.sql = "queryListByCustomer";
      this.filters.sqlCount = "queryListByCustomerCount";

      this.$refs.CyTable.findPage(this.filters);
    },
    refreshPageRequest: function(pageNum) {
      this.pageRequest.pageNum = pageNum;
      this.handleDetail();
    },
    // 换页刷新
    handleSizeChange: function(pageSize) {
      this.pageRequest.pageSize = pageSize;
      this.pageRequest.pageNum = 1;
      this.handleDetail();
    },

    handleDetail: function(data) {
      this.dialogVisible = true;

      let this_ = this;

      if (data != null) {
        this.query._sku_number = data.row.sku_number;
        this.query.customer_id = data.row.customer_id;
      }

      this.query.t = "wOrderNoSaleSku";
      this.query.sql = "queryList";
      this.query.start = this.pageRequest.pageNum;
      this.query.limit = this.pageRequest.pageSize;
      this.utils.request.queryUserPage(this.query, res => {
        if (res.rows == null) {
          res.rows = [];
        }
        this_.tableData = res.rows;
        this_.totalSize = Number(res.total);
      });
    },

    // 显示编辑界面
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
      let userRoles = [];
      for (let i = 0, len = params.row.userRoles.length; i < len; i++) {
        userRoles.push(params.row.userRoles[i].roleId);
      }
      this.dataForm.userRoles = userRoles;
    },

    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            let userRoles = [];
            for (let i = 0, len = params.userRoles.length; i < len; i++) {
              let userRole = {
                userId: params.id,
                roleId: params.userRoles[i]
              };
              userRoles.push(userRole);
            }
            params.userRoles = userRoles;
            this.$api.user.save(params).then(res => {
              this.editLoading = false;
              if (res.code == 200) {
                this.$message({ message: "操作成功", type: "success" });
                this.dialogVisible = false;
                this.$refs["dataForm"].resetFields();
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
              this.findPage(null);
            });
          });
        }
      });
    },
    reset: function() {
      this.filters = {};
      this.$refs.CyTable.resetForm();
      this.findPage();
    },
    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let filename = "非订单出库客户货物统计";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    },

    // 处理表格列过滤显示
    displayFilterColumnsDialog: function() {
      this.$refs.tableColumnFilterDialog.setDialogVisible(true);
    },
    // 处理表格列过滤显示
    handleFilterColumns: function(data) {
      this.filterColumns = data.filterColumns;
      this.$refs.tableColumnFilterDialog.setDialogVisible(false);
    },
    //库存详细
    handleFilterColumnsDetail: function(data) {
      this.filterColumns = data.filterColumns;
      this.$refs.tableColumnFilterDialog.setDialogVisible(false);
    },
    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: "client_name", label: "客户名称", minWidth: 120 },
        { prop: "sku_name", label: "产品名称", minWidth: 120 },
        { prop: "sku_level", label: "产品规格", minWidth: 120 },
        { prop: "sku_number", label: "产品编码", minWidth: 120 },
        { prop: "sku_type_text", label: "类别名称", minWidth: 120 },
        { prop: "sku_type_number", label: "类别编码", minWidth: 120 },
        { prop: "total", label: "出库数量", minWidth: 120 }
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));

      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },
    nature: function(row, column, cellValue, index) {
      if (cellValue == 1) {
        return "自有";
      } else {
        return "非自有";
      }
    }
  },

  mounted() {
    this.initColumns();
  }
};
</script>

<style scoped>
</style>