<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters">
        <el-form-item prop="username">
          <el-input v-model="filters.username" placeholder="用户名称"></el-input>
        </el-form-item>
        <el-form-item prop="deptname">
          <el-input v-model="filters.deptname" placeholder="部门名称"></el-input>
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
      :showOperation="false"
      :showBatchDelete="false"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleDetail="handleDetail"
      ref="CyTable"
    ></cy-table>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import CyTable from "@/views/Core/CyTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format } from "@/utils/datetime";
import { exportExcel } from "@/utils/excel";

import goods from "@/views/Business/detail/detailOut.vue";
export default {
  components: {
    PopupTreeInput,
    CyTable,
    KtButton,
    TableColumnFilterDialog,
    goods
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
      size: "small",
      filters: {
        username: "",
        deptname: "", 
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
      roles: []
    };
  },
  methods: {
    closeDetail: function(params) {
      this.content = "";
    },

    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "sysUser";
      this.filters.sql = "queryListKpi";
      this.filters.sqlCount = "queryListKpiCount";
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
        { prop: "username", label: "用户名", minWidth: 150 },
        { prop: "lname", label: "职位", minWidth: 120 },
        { prop: "deptname", label: "部门", minWidth: 120 },
        { prop: "pname", label: "直属领导", minWidth: 120 }, 
        { prop: "moile", label: "手机", minWidth: 80 },
        { prop: "in_store_num", label: "入库量", minWidth: 80 },
        { prop: "out_store_num", label: "出库量" },
        { prop: "return_store_num", label: "退货量", minWidth: 120 },
        { prop: "wic_store_num", label: "盘点量", minWidth: 80 },
        { prop: "wps_store_num", label: "巡检量", minWidth: 80 },
        { prop: "transfer_store_num", label: "移位量", minWidth: 80 }
      ];
      var temp = [];

      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },
    handleDetail: function(data) {
      this.content = "goods";
      this.detailParam = data.row;
      this.dialogVisible = true;
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return "速冻食品";
    },

    reset: function() {
      this.$refs["filters"].resetFields();
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
          let filename = "KPI报表";
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
  }
};
</script>

<style scoped>
</style>