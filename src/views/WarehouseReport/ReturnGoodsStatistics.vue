<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-row>
          <el-form-item>
            <el-input v-model="filters.order_no" placeholder="订单号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.number" placeholder="批次号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.supplier_company" placeholder="服务方名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.supplier_people" placeholder="服务方联系人"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.supplier_people_mobile" placeholder="供应商联系方式"></el-input>
          </el-form-item>
        </el-row>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="$t('action.search')"
            type="primary"
            @click="findPage(filters)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            :label="$t('action.reset')"
            type="primary"
            icon="el-icon-refresh"
            @click="reset"
          />
        </el-form-item>
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
      :showBatchDelete="false"
      :showDetailOperation="true"
      :showDeleteOperation="false"
      :showEditOperation="false"
      @handleDetail="handleDetail"
      @findPage="findPage"
      ref="CyTable"
    ></cy-table>
    <!--详情页面-->
    <el-dialog
      title="退货单明细"
      width="60%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-table :data="tableData">
        <el-table-column prop="product_name" label="产品名称" width="200"></el-table-column>
        <el-table-column prop="product_level" label="产品规格" width="150"></el-table-column>
        <el-table-column prop="product_number" label="产品代码" width="200"></el-table-column>
        <el-table-column prop="roduction_date" label="生产日期" width="200"></el-table-column>
        <el-table-column prop="expiration_date" label="过期日期" width="200"></el-table-column>
        <el-table-column prop="num" label="退货数量" width="200"></el-table-column>
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
        client_name: "",
        order_no: "",
        supplier_company: "",
        supplier_people: "",
        supplier_people_mobile: ""
      },
      columns: [],
      filterColumns: [],
      tableData: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "returnGoodsExcel";
      this.$refs.CyTable.findPage(this.filters);
    },

    //重置方法
    reset: function() {
      this.filters = {
        client_name: "",
        order_no: "",
        supplier_company: "",
        supplier_people: "",
        supplier_people_mobile: ""
      };
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
          let filename = "退单统计";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
    },
    // 详情
    handleDetail: function(data) {
      this.dialogVisible = true;
      let query = {};
      let this_ = this;
      query.id = data.row.id;
      query.t = "returnGoodsExcel";
      query.sql = "queryDetailList";
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
    //库存详细
    handleFilterColumnsDetail: function(data) {
      this.filterColumns = data.filterColumns;
      this.$refs.tableColumnFilterDialog.setDialogVisible(false);
    },
    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: "order_no", label: "订单编号", minWidth: 150 },
        { prop: "number", label: "批次号", minWidth: 150 },
        { prop: "client_name", label: "客户名称", minWidth: 150 },
        { prop: "supplier_company", label: "服务方名称", minWidth: 150 },
        { prop: "supplier_people", label: "服务方联系人", minWidth: 120 },
        {
          prop: "supplier_people_mobile",
          label: "供应商联系方式",
          minWidth: 150
        },
        { prop: "update_time", label: "退货时间", minWidth: 120 }
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    }
  },
  mounted() {
    this.findPage();
    this.initColumns();
  }
};
</script>

<style scoped>
</style>