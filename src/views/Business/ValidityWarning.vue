<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" class="form">
        <el-row>
          <el-form-item prop="sku_name">
            <el-input v-model="filters.sku_name" placeholder="产品名称"></el-input>
          </el-form-item>
          <el-form-item prop="sku_level">
            <el-input v-model="filters.sku_level" placeholder="产品规格"></el-input>
          </el-form-item>
          <el-form-item prop="sku_number">
            <el-input v-model="filters.sku_number" placeholder="产品代码"></el-input>
          </el-form-item>
          <!-- <el-form-item prop="min_warning_days">
            <el-input v-model="filters.min_warning_days" placeholder="距最小预警天数"></el-input>
          </el-form-item>
          <el-form-item prop="max_warning_days">
            <el-input v-model="filters.max_warning_days" placeholder="距最大预警天数"></el-input>
          </el-form-item>-->

          <el-form-item prop="sku_type_number">
            <el-input v-model="filters.sku_type_number" placeholder="类别编号"></el-input>
          </el-form-item>
          <el-form-item prop="sku_type_text">
            <el-input v-model="filters.sku_type_text" placeholder="类别名称"></el-input>
          </el-form-item>

          <el-form-item prop="set_number">
            <el-input v-model="filters.set_number" placeholder="存放货位"></el-input>
          </el-form-item>

          <el-form-item prop="unit_volume">
            <el-input v-model="filters.unit_volume" placeholder="单件产品体积（m³）"></el-input>
          </el-form-item>
          <el-form-item prop="unit_weight">
            <el-input v-model="filters.unit_weight" placeholder="单件产品重量（kg)"></el-input>
          </el-form-item>

          <el-form-item prop="exist_stock">
            <el-input v-model="filters.exist_stock" placeholder="库存数量（件数）"></el-input>
          </el-form-item>
          <el-form-item prop="is_expired_days">
            <el-select v-model="filters.is_expired_days" style="width: 100%;" placeholder="是否过期">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="bill">
            <el-input v-model="filters.bill" placeholder="单据号"></el-input>
          </el-form-item>

          <el-form-item prop="client_name">
            <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
          </el-form-item>
          <el-form-item prop="remark">
            <el-input v-model="filters.remark" placeholder="备注"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="text-align: left;">
          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              type="primary"
              @click="findPageBeforeRestPages()"
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

          <el-form-item>
            <kt-button icon="el-icon-message" label="批量发送邮件" type="primary" @click="sendMessage()" />
          </el-form-item>
          <!-- <el-form-item>
            <kt-button
              label="移除产品"
              type="danger"
              @click="handleBatchDelete()"
              icon="el-icon-delete"
            />
          </el-form-item>-->
        </el-row>
      </el-form>
    </div>
    <div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
      <el-form :inline="true" :size="size">
        <el-form-item>
          <el-button-group>
            <el-tooltip content="刷新" placement="top">
              <el-button icon="fa fa-refresh" @click="findPageBeforeRestPages()"></el-button>
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
      <!--表格显示列界面-->
      <table-column-filter-dialog
        ref="tableColumnFilterDialog"
        :columns="columns"
        @handleFilterColumns="handleFilterColumns"
      ></table-column-filter-dialog>
    </div>

    <div>
      <!--表格栏-->
      <el-table
        :data="table.content"
        @selection-change="selectionChange"
        :row-class-name="tableRowClassName"
        :show-overflow-tooltip="table.showOverflowTooltip"
        :max-height="countHeight(500)"
        :size="table.size"
        :align="table.align"
        style="width:100%;"
        :header-cell-style="{ 'color': '#FFF','background-color': 'rgb(20, 136, 154)'}"
      >
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>

        <template v-for="(column,index) in filterColumns">
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
                <expand-dom
                  :column="column"
                  :row="scope.row"
                  :render="column.render"
                  :index="index"
                ></expand-dom>
              </template>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <!--分页栏-->
      <div class="toolbar" style="padding:10px;">
        <el-pagination
          layout="total, prev, pager, next, jumper,sizes"
          @current-change="refreshPageRequest"
          :current-page="table.pageRequest.pageNum"
          :page-size="table.pageRequest.pageSize"
          :total="table.totalSize"
          style="float:right;"
          :page-sizes="[5,10, 20, 30, 40]"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </div>

    <!--图片预览-->
    <el-dialog :visible.sync="showPictureDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import CyTable from "@/views/Core/CyTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format, formatDate } from "@/utils/datetime";
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
      table: {
        showOverflowTooltip: true,
        size: "mini",
        align: "left",
        totalSize: 0,
        content: [],
        // 分页信息
        pageRequest: {
          pageNum: 1,
          pageSize: 10
        },
        selections: []
      },
      size: "small",
      filters: {
        t: "norderStoreSku",
        sku_name: "",
        sku_level: "",
        sku_number: "",
        min_warning_days: "",
        max_warning_days: "",
        sku_type_number: "",
        sku_type_text: "",
        set_number: "",
        unit_volume: "",
        unit_weight: "",
        exist_stock: "",
        is_expired_days: "",
        bill: "",
        client_name: "",
        remark: ""
      },
      showPictureDialogVisible: false,
      dialogImageUrl: "",
      columns: [],
      filterColumns: [],

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false
    };
  },
  methods: {
    countfixed(index) {
      if (index <= 3) {
        return true;
      } else {
        return false;
      }
    },
    findPageBeforeRestPages() {
      this.table.pageRequest.pageNum = 1;
      this.findPage();
    },
    // 选择切换
    selectionChange: function(selections) {
      this.table.selections = selections;
    },

    // 换页刷新
    refreshPageRequest: function(pageNum) {
      this.table.pageRequest.pageNum = pageNum;
      this.findPage();
    },
    // 换页刷新
    handleSizeChange: function(pageSize) {
      this.table.pageRequest.pageSize = pageSize;
      this.table.pageRequest.pageNum = 1;
      this.findPage();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
          this.exportData(this.filters, this.filterColumns, "有效期预警");
        })
        .catch(() => {});
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

        if (res.rows == null) {
          this.$message({ message: "暂无需要导出的数据 ", type: "error" });
          return;
        }

        fileName = fileName + "_" + formatDate(new Date(), "yyyyMMdd");

        exportExcel(res.rows, filterColumns, fileName);
      });
    },
    // 获取分页数据
    //分页查询 // 获取分页数据
    // 获取分页数据
    findPage: function(data) {
      var this_ = this;

      this.filters.start = this.table.pageRequest.pageNum;
      this.filters.limit = this.table.pageRequest.pageSize;
      this.filters.max_warning_days = -1;
      this.filters.min_is_expired_days = 0;
      this.utils.request.queryUserPage(this.filters, function(res) {
        if (res.rows == null) {
          res.rows = [];
        }
        this_.table.content = res.rows;
        this_.table.totalSize = Number(res.total);
      });
    },
    formatterPhoto: function(row, column, cellValue, index) {
      if (this.utils.isNull(cellValue)) {
        return "";
      }

      let src = cellValue.split(",")[0];

      return (
        '<div class="el-image bill-photo" style="width: 100px; height: 100px;" >' +
        '<img src="' +
        src +
        '"' +
        ' class="el-image__inner" style="object-fit: fill;"></div>'
      );
    },

    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      if (row.is_expired == "是") {
        return "<span class='test'>" + cellValue + "</span>";
      }

      if (row.distance_day <= 0) {
        return "<span  class='redss'>" + cellValue + "</span>";
      }

      return cellValue;
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
        {
          prop: "sku_name",
          label: "产品名称",
          minWidth: 120
        },
        {
          prop: "sku_level",
          label: "产品规格",
          minWidth: 120
        },
        {
          prop: "bill",
          label: "单据号",
          minWidth: 120
        },
        {
          prop: "client_name",
          label: "客户名称",
          minWidth: 120
        },
        {
          prop: "set_number",
          label: "存放货位",
          minWidth: 120
        },
        {
          prop: "exist_stock",
          label: "库存数量（件数）",
          minWidth: 180
        },
        {
          prop: "sku_number",
          label: "产品代码",
          minWidth: 120
        },
        {
          prop: "roduction_date",
          label: "生产日期",
          minWidth: 200
        },
        {
          prop: "expiration_date",
          label: "过期日期",
          minWidth: 120
        },
        // {
        //   prop: "warning_days",
        //   label: "距保质期预警",
        //   minWidth: 200
        // },
        {
          prop: "is_expired",
          label: "是否过期",
          minWidth: 120,
          formatter: this.formatterIsExpired
        },
        {
          prop: "sku_type_number",
          label: "类别编号",
          minWidth: 120
        },
        {
          prop: "sku_type_text",
          label: "类别名称",
          minWidth: 120
        },
        {
          prop: "create_time",
          label: "入库时间",
          minWidth: 120
        },
        {
          prop: "unit_volume",
          label: "单件产品体积（m³）",
          minWidth: 200
        },
        {
          prop: "unit_weight",
          label: "单件产品重量（Kg）",
          minWidth: 200
        },
        {
          prop: "bill_photo",
          label: "单据证照",
          minWidth: 120,
          formatter: this.formatterPhoto
        },
        {
          prop: "sendemail",
          label: "当天邮件发送次数",
          minWidth: 120
        },
        {
          prop: "remark",
          label: "备注",
          minWidth: 120
        }
      ];

      var temp = [];

      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;

      this.findPage();
    },

    showPictureDetail: function() {
      var this_ = this;
      $(document).on(
        "click",
        ".bill-photo",
        function(e) {
          this_.dialogImageUrl = $(e.target).prop("src");
          this_.showPictureDialogVisible = true;
        }.bind(this)
      );
    },
    formatterIsExpired: function(row, column, cellValue, index) {
      //获取到期天数
      let is_expired_days = row.is_expired_days;

      if (Number(row.is_expired_days) >= 0) {
        return "否";
      }

      return "是";
    },

    tableRowClassName: function(params, callback) {
      //首先判断是否过期
      if (params.row.is_expired_days < 0) {
        //已经过期
        return "error";
      }

      if (params.row.warning_days < 0) {
        //预警
        return "warn";
      }
    },
    sendMessage: function() {
      if (this.table.selections.length == 0) {
        this.$message({ message: "请至少选择一条数据", type: "error" });
        return;
      }

      let in_batch_number_list = this.table.selections
        .map(item => item.in_batch_number)
        .toString();

      this.utils.request.sendMessage(
        { in_batch_number_list: in_batch_number_list },
        res => {
          if (res.code == "0000") {
            this.$message({ message: "邮件发送成功", type: "success" });
            this.findPage();
          } else {
            this.$message({ message: res.msg, type: "error" });
          }
        }
      );
    },
    // 移除产品
    handleBatchDelete: function() {
      if (this.table.selections.length == 0) {
        this.$message({ message: "请至少选择一条数据", type: "error" });
        return;
      }
      let in_batch_number_list = this.table.selections
        .map(item => item.in_batch_number)
        .toString();

      this.$confirm("确认删除吗？", "提示", {}).then(() => {
        this.utils.request.deleteSkuStore(
          { in_batch_number_list: in_batch_number_list },
          res => {
            if (res.code == "0000") {
              this.$message({ message: "库存删除成功", type: "success" });
              this.findPage();
            } else {
              this.$message({ message: res.msg, type: "error" });
            }
          }
        );
      });
    },
    countHeight(height) {
      var winHeight =
        document.body.clientHeight || document.documentElement.clientHeight;
      if (height > winHeight * 0.9) {
        height = winHeight * 0.9;
      }
      return height;
    }
  },
  mounted() {
    this.initColumns();
    this.showPictureDetail();
  }
};
</script>

<style>
.warn {
  color: red;
}

.error {
  color: blueviolet;
}

.form .el-input__inner {
  width: 200px;
}
</style>