<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-row>
          <el-form-item>
            <el-input v-model="filters.product_name" placeholder="产品名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.order_no" placeholder="订单号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.batch_number" placeholder="入库批次号"></el-input>
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
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      :showBatchDelete="false"
      :showDetailOperation="true"
      :showDeleteOperation="false"
      :showEditOperation="false"
      @handleDetail="handleDetail"
      ref="CyTable"
    ></cy-table>
    <!--详情页面-->
    <el-dialog title="入库明细" width="70%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-table :data="tableData">
        <el-table-column prop="product_name" label="产品名称" width="150"></el-table-column>
        <el-table-column prop="product_level" label="产品规格" width="150"></el-table-column>
        <el-table-column prop="sku_number" label="产品代码" width="150"></el-table-column>
        <el-table-column prop="sku_type_number" label="类别编号" width="150"></el-table-column>
        <el-table-column prop="sku_type_text" label="类别名称" width="150"></el-table-column>
        <el-table-column prop="roduction_date" label="生产日期" width="150"></el-table-column>
        <el-table-column prop="create_time" label="入库时间" width="150"></el-table-column>
        <el-table-column prop="wnumber" label="存放货位" width="150"></el-table-column>
        <el-table-column prop="tnumber" label="存放托盘" width="150"></el-table-column>
        <el-table-column prop="stock" label="库存数量（件数）" width="150"></el-table-column>
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
        t: "orderInStoreExcel",
        product_name: "",
        client_name: "",
        order_no: "",
        batch_number: ""
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
      dataFormRules: {}
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.filters.sql = "queryListByOrderNo";
      this.filters.sqlCount = "queryListCountByOrderNo";

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
          let filename = "入库单统计";
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
    handleDetail: function(data) {
      this.dialogVisible = true;
      this.utils.request.queryUserList(
        { t: "orderInStoreExcel", order_no: data.row.order_no },
        res => {
          if (res.data != null) {
            this.tableData = res.data;
          }
        }
      );
    },
    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: "order_no", label: "订单号", minWidth: 120 },
        { prop: "product_name", label: "产品名称", minWidth: 120 },
        { prop: "product_level", label: "产品规格", minWidth: 120 },
        { prop: "client_name", label: "所属客户", minWidth: 120 },
        { prop: "bill", label: "单据号", minWidth: 120 },
        { prop: "total", label: "入库数量", minWidth: 120 }
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    },
    resetSelection() {
      this.filters = {
        t: "orderInStoreExcel",
        product_name: "",
        client_name: ""
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