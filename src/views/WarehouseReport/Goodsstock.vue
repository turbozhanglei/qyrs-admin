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
            <el-input v-model="filters.number" placeholder="产品代码"></el-input>
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
            <kt-button :label="$t('action.reset')" type="primary" @click="resetSelection" icon="el-icon-refresh"/>
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
    <el-dialog title="库存明细" width="80%" :visible.sync="dialogVisible" :close-on-click-modal="true">
      <el-table :data="tableData" :columns="columnsdetail">
        <el-table-column prop="name" label="产品名称" width="150"></el-table-column>
        <el-table-column prop="level" label="产品规格" width="150"></el-table-column>
        <el-table-column prop="number" label="产品代码" width="150"></el-table-column>
        <el-table-column prop="tnumber" label="类别编号" width="150"></el-table-column>
        <el-table-column prop="tname" label="类别名称" width="150"></el-table-column>
        <el-table-column prop="roduction_date" label="生产日期" width="150"></el-table-column>
        <el-table-column prop="create_time" label="入库时间" width="150"></el-table-column>

        <el-table-column prop="wname" label="存放货位" width="150"></el-table-column>
        <el-table-column prop="wnumber" label="货位编码" width="150"></el-table-column>
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
        product_name: "",
        number: ""
      },
      columns: [],
      tableData: [],
      columnsdetail: [],
      filterColumns: [],
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
      this.filters.t = "goodsStock";
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
          let filename = "货物库存统计";
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
      let this_ = this;
      query.id = data.row.id;
      query.t = "goodsStock";
      query.sql = "queryDetailList";
      this.utils.request.queryUserList(query, function(data) {
        this_.tableData = data.data;
      });
    },
    //库存详细
    handleFilterColumnsDetail: function(data) {
      this.filterColumns = data.filterColumns;
      this.$refs.tableColumnFilterDialog.setDialogVisible(false);
    },
    // 处理表格列过滤显示
    handleFilterColumns: function(data) {
      this.filterColumns = data.filterColumns;
      this.$refs.tableColumnFilterDialog.setDialogVisible(false);
    },
    // 处理表格列过滤显示
    displayFilterColumnsDialog: function() {
      this.$refs.tableColumnFilterDialog.setDialogVisible(true);
    },
    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: "name", label: "产品名称", minWidth: 120 },
        { prop: "level", label: "产品规格", minWidth: 120 },
        { prop: "number", label: "产品代码", minWidth: 120 },
        { prop: "tnumber", label: "类别编号", minWidth: 120 },
        { prop: "tname", label: "类别名称", minWidth: 120 },
        { prop: "stock", label: "库存数量（件数）", minWidth: 180 }
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));

      this.columnsdetail = [
        { prop: "id", label: "ID", minWidth: 50 },
        { prop: "product_name", label: "产品名称", minWidth: 120 },
        { prop: "product_specs", label: "产品规格", minWidth: 120 },
        { prop: "product_code", label: "产品代码", minWidth: 120 },
        { prop: "type_number", label: "类别编号", minWidth: 120 },
        { prop: "type_name", label: "类别名称", minWidth: 120 },
        { prop: "production_date", label: "生产日期", minWidth: 120 },
        { prop: "warehousing_date", label: "入库时间", minWidth: 120 },
        { prop: "warehousing_name", label: "所属库房", minWidth: 180 },
        { prop: "aside_location", label: "存放货位", minWidth: 180 },
        { prop: "stock_number", label: "库存数量（件数）", minWidth: 180 }
      ];
      // this.filterColumns = JSON.parse(JSON.stringify(this.columnsdetail));
    },
    resetSelection() {
      this.filters = {
        product_name: "",
        number: "",
        t: "goodsStock"
	  };
	  this.$refs.CyTable.resetForm();
      this.findPage(this.filters);
    }
  },
  mounted() {
    this.initColumns();
  }
};
</script>

<style scoped>
</style>