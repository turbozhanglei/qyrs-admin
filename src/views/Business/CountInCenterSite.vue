<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" class="form">
        <el-row>
          <el-form-item>
            <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.sku_name" placeholder="产品名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.sku_number" placeholder="产品代码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.sku_type_text" clearable filterable placeholder="产品类别">
              <el-option
                v-for="item in productOptions"
                :key="item.id"
                :label="item.text"
                :value="item.text"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row style="text-algin:left;">
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
              icon="el-icon-refresh"
              :label="$t('action.reset')"
              type="primary"
              @click="resetForm('filters')"
            />
          </el-form-item>
        </el-row>
        <!-- <el-row>
          <el-form-item>
            <el-date-picker
              v-model="filters.start"
              type="datetime"
              placeholder="开始时间"
              align="right"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="filters.end"
              type="datetime"
              placeholder="结束时间"
              align="right"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-row>-->
      </el-form>

      <!-- 表格显示列界面 -->
      <table-column-filter-dialog
        ref="tableColumnFilterDialog"
        :columns="columns"
        @handleFilterColumns="handleFilterColumns"
      ></table-column-filter-dialog>
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
    </div>

    <cy-table
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      ref="CyTable"
      :showBatchDelete="false"
      :showEditOperation="false"
      :showDeleteOperation="false"
      :showDetailOperation="true"
      @handleDetail="handleDetail"
    ></cy-table>

    <el-dialog
      title="入库明细"
      width="90%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="true"
      @closed="closeDetail"
    >
      <el-table
        style="width: 100%"
        :close-on-click-modal="true"
        :data="tableData"
        :columns="filterColumns"
        @closed="closeDetail"
      >
        <el-table-column fixed prop="order_no" label="入库单号" width="150"></el-table-column>
        <el-table-column fixed prop="client_name" label="客户名称" width="120"></el-table-column>
        <el-table-column prop="sku_name" label="产品名称" width="120"></el-table-column>
        <el-table-column prop="instock_time" label="入库时间" width="120"></el-table-column>
        <el-table-column prop="tray_number" label="托盘编码" width="120"></el-table-column>
        <el-table-column prop="set_number" label="存放货位" width="120"></el-table-column>
        <el-table-column prop="roduction_date" label="生产日期(产品批次)" width="120"></el-table-column>
        <el-table-column prop="expiration_date" label="过期日期" width="120"></el-table-column>
        <el-table-column prop="warning_days" label="距保质期到期天数" width="120"></el-table-column>
        <el-table-column prop="arrival_num" label="到货数量(件数)" width="120"></el-table-column>
        <el-table-column prop="qualified_num" label="合格数量(件数)" width="120"></el-table-column>
        <el-table-column prop="unqualified_num" label="不合格数量(件数)" width="120"></el-table-column>
        <el-table-column prop="lname" label="检验员" width="120"></el-table-column> 
        <el-table-column prop="remark" label="备注" width="120"></el-table-column>
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
import KtTable from "@/views/Core/KtTable";
import CyTable from "@/views/Core/CyTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format } from "@/utils/datetime";
import { exportExcel } from "@/utils/excel";

export default {
  components: {
    PopupTreeInput,
    CyTable,
    KtButton,
    TableColumnFilterDialog
  },
  data() {
    return {
      // 分页信息
      pageRequest: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      productOptions: [],
      content: "",
      detailParam: {},
      size: "small",
      filters: {
        t: "storageStatistics",
        sku_name: "",
        sku_number: "",
        sku_level: "",
        sku_type_id: "",
        food_add_type: "",
        unit_volume: "",
        unit_weight: "",
        arrival_num: "",
        qualified_num: "",
        unqualified_num: "",
        unit_volume: "",
        unit_weight: ""
      },
      totalSize: 0,
      columns: [],
      filterColumns: [],
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }]
      },
      // 新增编辑界面数据
      dataForm: {},
      deptData: [],
      deptTreeProps: {
        label: "name",
        children: "children"
      },
      roles: []
    };
  },
  methods: {
    resetForm(formName) {
      (this.filters = {
        t: "storageStatistics",
        sku_name: "",
        sku_number: "",
        sku_level: "",
        sku_type_id: "",
        food_add_type: "",
        unit_volume: "",
        unit_weight: "",
        arrival_num: "",
        qualified_num: "",
        unqualified_num: "",
        unit_volume: "",
        unit_weight: ""
      }),
        this.$refs.CyTable.resetForm();
      this.findPage();
    },

    closeDetail: function(params) {
      this.content = "";
    },
    // 换页刷新
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
    // 获取分页数据
    findPage: function(data) {
      this.$refs.CyTable.findPage(this.filters);
    },

    //产品类别初始化
    queryProType: function() {
      let type = {};
      type.t = "skuType";
      let this_ = this;
      this.utils.request.queryUserList(type, function(data) {
        this_.productOptions = data.data;
      });
    },

    handleDetail: function(data) {
      if (data != null && data != undefined) {
        this.detailParam.sku_id = data.row.sku_id;
      }

      this.detailParam.t = "storageStatistics";
      this.detailParam.sql = "queryDetail";
      this.detailParam.sqlCount = "queryDetailCount";
      this.detailParam.start = this.pageRequest.pageNum;
      this.detailParam.limit = this.pageRequest.pageSize;
      this.dialogVisible = true;
      let this_ = this;

      this.utils.request.queryUserPage(this.detailParam, function(res) {
        if (res.rows == null) {
          res.rows = [];
        }
        this_.tableData =  res.rows;
        this_.totalSize = Number(res.total);
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
        { prop: "sku_name", label: "产品名称", minWidth: 150 },
        { prop: "sku_number", label: "产品代码", minWidth: 120 },
        { prop: "sku_level", label: "产品规格", minWidth: 120 },
        { prop: "stock", label: "入库数量", minWidth: 80 },
        // { prop: "qualified_nums", label: "合格数量（件数）", minWidth: 80 },
        // { prop: "unqualified_nums", label: "不合格数量（件数）", minWidth: 80 },
        {
          prop: "food_add_type",
          label: "食品、食品添加剂类别",
          minWidth: 120
        },
        { prop: "sku_type_text", label: "类别名称", minWidth: 120 },
        { prop: "unit_volume", label: "单件产品体积（m³）", minWidth: 80 },
        { prop: "unit_weight", label: "单件产品重量（Kg）", minWidth: 80 }
      ];
      var temp = [];

      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return "速冻食品";
    },

    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let filename = "入库货物统计表";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.initColumns();
    this.queryProType();
  }
};
</script>

<style scoped>
/deep/.form .el-input__inner {
  width: 200px !important;
}
</style>