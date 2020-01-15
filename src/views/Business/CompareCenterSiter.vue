<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" class="form">
        <el-form-item prop="client_name">
          <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
        </el-form-item>
        <el-form-item prop="sku_name">
          <el-input v-model="filters.sku_name" placeholder="产品名称"></el-input>
        </el-form-item>
        <el-form-item prop="sku_number">
          <el-input v-model="filters.sku_number" placeholder="产品代码"></el-input>
        </el-form-item>
        <el-form-item prop="sku_type_id">
          <el-select v-model="filters.sku_type_id" filterable clearable placeholder="产品类别">
            <el-option
              v-for="item in productOptions"
              :key="item.id"
              :label="item.text"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="startTime">
          <el-date-picker
            v-model="filters.startTime"
            type="datetime"
            placeholder="开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker
            v-model="filters.endTime"
            type="datetime"
            placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            :picker-options="endPickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-row>
          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              perms="sys:role:view"
              type="primary"
              @click="$refs.CyTable.findPageBeforeRestPages(filters)"
            />
          </el-form-item>

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
      <!--表格显示列界面-->
      <table-column-filter-dialog
        ref="tableColumnFilterDialog"
        :columns="columns"
        @handleFilterColumns="handleFilterColumns"
      ></table-column-filter-dialog>
    </div>
    <!--表格内容栏-->
    <cy-table
      :height="450"
      permsEdit="false"
      permsDelete="false"
      :showDetailOperation="true"
      :showBatchDelete="false"
      :showIndex="false"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleDetail="handleDetail"
      ref="CyTable"
    ></cy-table>

    <!--详情页面-->
    <el-dialog
      title="出入库明细"
      width="50%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="true"
      @closed="closeDetail"
    >
      <div class="block" style="text-align:left;max-height:600px;overflow: auto">
        <el-timeline>
          <div :index="(index+'')" v-for="(item,index) in el_timeline_item" :key="index">
            <el-timeline-item :timestamp="index" placement="top">
              <el-card v-for="(key,value) in item " :key="value">
                <h4 v-if="key.log_type == 0">入库</h4>
                <h4 v-if="key.log_type == 1">出库</h4>
                <h4 v-if="key.log_type == 2">非订单出库</h4>
                <p>{{key.remark.split(",")[0]}}</p>
                <p>{{key.remark.split(",")[1]}}</p>
                <p>{{key.username}} {{key.create_time}}</p>
              </el-card>
            </el-timeline-item>
          </div>
        </el-timeline>
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
      content: "",
      detailParam: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      endPickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },

      productOptions: [],
      size: "small",
      filters: {
        client_name: "",
        sku_name: "",
        sku_number: "",
        sku_type_id: "",
        startTime: "",
        endTime: ""
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 1 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }]
      },

      deptData: [],
      deptTreeProps: {
        label: "name",
        children: "children"
      },
      roles: [],
      el_timeline_item: {}
    };
  },
  methods: {
    closeDetail: function(params) {
      this.content = "";
    },

    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "orderInStoreExcel";
      this.filters.sql = "queryCompareCenterSiterList";
      this.filters.sqlCount = "countCompareCenterSiterList";

      this.$refs.CyTable.findPage(this.filters);
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
        { prop: "sku_name", label: "产品名称", minWidth: 120 },
        { prop: "client_name", label: "客户名称", minWidth: 200 },
        { prop: "sku_level", label: "产品规格", minWidth: 120 },
        { prop: "total", label: "库存数量（件数）", minWidth: 100 },
        { prop: "in_stock", label: "入库数量（件数）", minWidth: 100 },
        { prop: "out_stock", label: "出库数量（件数）", minWidth: 100 },
        {
          prop: "no_order_total",
          label: "非订单出库数量（件数）",
          minWidth: 100
        },
        { prop: "distance_day", label: "距保质期到期天数", minWidth: 100 },
        { prop: "sku_type_text", label: "类别名称", minWidth: 120 },
        { prop: "update_time", label: "入库时间", minWidth: 120 }
      ];
      var temp = [];

      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    handleDetail: function(data) {
      if (data != null) {
        var param = {};
        param.in_batch_number = data.row.batch_number;
        param.t = "orderStoreSkuLog";

        this.utils.request.queryUserList(param, res => {
          if (res.data == null) {
            res.data = [];
          }

          var temp = {};
          $.each(res.data, (key, value) => {
            var timeline = value.timeline;
            if (temp.timeline != null && temp.timeline != undefined) {
              temp.timeline.push(value);
            } else {
              temp[timeline] = [value];
            }
          });

          this.el_timeline_item = temp;

          this.dialogVisible = true;
        });
      }
    },

    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let filename = "出入库对比";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
    },
    reset: function() {
      this.$refs["filters"].resetFields();
      this.$refs.CyTable.resetForm();
      this.findPage();
    },

    //产品类别初始化
    queryProType: function() {
      let type = {};
      type.t = "skuType";
      let this_ = this;
      this.utils.request.queryUserList(type, function(data) {
        this_.productOptions = data.data;
      });
    }
  },
  mounted() {
    this.initColumns();
    this.queryProType();
  }
};
</script>

<style scoped>
/deep/ .form .el-input__inner {
  width: 200px !important;
}
</style>