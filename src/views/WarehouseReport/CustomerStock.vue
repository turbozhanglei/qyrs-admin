<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-row>
          <el-form-item>
            <el-input v-model="filters.customerno" placeholder="客户代码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              type="primary"
              @click="$refs.CyTable.findPageBeforeRestPages(filters)"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              :label="$t('action.reset')"
              type="primary"
              @click="resetSelection"
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
              <el-button icon="fa fa-file-excel-o" @click="downloadExcel"></el-button>
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
      title="客户库存统计"
      width="70%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-table :data="tableData" :columns="columnsdetail">
        <el-table-column prop="onumber" label="订货批次号" width="300"></el-table-column>
        <el-table-column prop="in_batch_number" label="入库批次号" width="300"></el-table-column>
        <el-table-column prop="product_name" label="产品名称" width="300"></el-table-column>
        <el-table-column prop="wnumber" label="货位编号" width="300"></el-table-column>
        <el-table-column prop="tnumber" label="托盘编号" width="300"></el-table-column>
        <el-table-column prop="roduction_date" label="生产日期" width="300"></el-table-column>
        <el-table-column prop="expiration_date" label="过期日期" width="300"></el-table-column>
        <el-table-column prop="cstock" label="库存数量" width="300"></el-table-column>
      </el-table>
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
        t: "customerStore",
        client_name: "",
        customerno: ""
      },
      columns: [],
      columnsdetail: [],
      filterColumns: [],
      tableData: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageRequestDetail: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      pageResultDetail: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.$refs.CyTable.findPage(this.filters);
    },
    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let filename = "客户库存";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
    },
    handleDetail: function(data) {
      this.dialogVisible = true;
      let query = {};
      query.provider_id = data.row.provider_id;
      query.sku_id = data.row.sku_id;
      query.t = "customerStore";
      query.sql = "queryDetailList";
      query.sqlCount = "queryDetailListCount";
      var this_ = this;
      this.utils.request.queryUserList(query, function(data) {
        this_.tableData = data.data;
      });
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
    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: "customerno", label: "客户编号", minWidth: 150 },
        { prop: "client_name", label: "客户名称", minWidth: 150 },
        { prop: "product_name", label: "产品名称", minWidth: 150 },
        { prop: "product_number", label: "产品编码", minWidth: 150 },
        { prop: "product_level", label: "产品规格", minWidth: 150 },
        { prop: "totalstock", label: "库存数量", minWidth: 150 }
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    },
    resetSelection() {
      this.filters = {
        t: "customerStore",
        client_name: "",
        customerno: ""
      };
      this.$refs.CyTable.resetForm();
      this.findPage(this.findPage);
    }
  },
  mounted() {
    this.initColumns();
  }
};
</script>

<style scoped>
</style>