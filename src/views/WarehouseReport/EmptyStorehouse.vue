<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-row>
          <el-form-item>
            <el-input v-model="filters.number" placeholder="库位编码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.name" placeholder="库位名称"></el-input>
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
      :showOperation="false"
      :showBatchDelete="false"
      :showDetailOperation="true"
      :showDeleteOperation="false"
      :showEditOperation="false"
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
        number: "",
        name: ""
      },
      columns: [],
      pageResult: {},
      filterColumns: [],
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "emptyStorehouseExecl";
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
          let filename = "空库位统计";
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

    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: "number", label: "货位编码", minWidth: 120 },
        { prop: "name", label: "货位名称", minWidth: 120 },
        { prop: "wname", label: "所属库房", minWidth: 120 },
        { prop: "waname", label: "所属库区", minWidth: 120 },
        { prop: "warehouse_area", label: "所属区域", minWidth: 120 },
        { prop: "row", label: "所在排", minWidth: 120 },
        { prop: "stratum", label: "所在层", minWidth: 120 },
        { prop: "columnss", label: "所在列", minWidth: 120 },
        { prop: "weight_stint", label: "重量限制", minWidth: 120 },
        { prop: "volume_stint", label: "体积限制", minWidth: 120 }
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    },
    resetSelection() {
      this.filters = {
        number: "",
        name: ""
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