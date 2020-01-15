<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-row>
          <el-form-item>
            <el-input v-model="filters.order_no" placeholder="我司出库单号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.customer_no" placeholder="客户出库单号"></el-input>
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
              icon="el-icon-refresh"
              type="primary"
              @click="resetSelection"
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
      @findPage="findPage"
      @handleDetail="handleDetail"
    ></cy-table>
    <!--详情页面-->
    <el-dialog title="出库明细" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-table :data="tableData" :columns="columnsdetail">
        <el-table-column prop="product_name" label="产品名称" width="300"></el-table-column>
        <el-table-column prop="batch_num" label="批次编号" width="300"></el-table-column>
        <el-table-column prop="out_stock_num" label="出库数量" width="300"></el-table-column>
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
        t: "orderSaleExcel",
        order_no: "",
        customer_no: ""
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
      editLoading: false,
      dataFormRules: {},
      deptData: [],
      deptTreeProps: {
        label: "name",
        children: "children"
      },
      roles: []
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.$refs.CyTable.findPage(this.filters);
    },
    handleDetail: function(data) {
      this.dialogVisible = true;
      let query = {};
      query.t = "orderSaleExcel";
      query.sql = "queryDetailList";
      query.sale_id = data.row.id;
      var this_ = this;
      this.utils.request.queryUserList(query, function(data) {
        this_.tableData = data.data;
      });
    },

    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    },
    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let filename = "已出库统计";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
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
        { prop: "order_no", label: "出库单号", minWidth: 150 },
        { prop: "client_name", label: "所属客户", minWidth: 150 },
        { prop: "product_name", label: "产品名称", minWidth: 150 },
        { prop: "customer_no", label: "客户单号", minWidth: 150 },
        { prop: "customer_make", label: "客户方制单人", minWidth: 150 },
        { prop: "recipient_store", label: "收货仓库", minWidth: 120 },
        {
          prop: "recipient_store_address",
          label: "收货仓库具体地址",
          minWidth: 180
        },
        { prop: "recipient_people", label: "收货人", minWidth: 150 },
        { prop: "out_stock_num", label: "出库数量", minWidth: 120 },
        // {prop:"out_total_weight", label:"出库产品总重量(KG)", minWidth:200},
        { prop: "update_time", label: "出库时间", minWidth: 120 }
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    },
    resetSelection() {
      this.filters = {
        t: "orderSaleExcel",
        order_no: "",
        customer_no: ""
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