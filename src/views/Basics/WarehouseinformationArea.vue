<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" ref="filters" :size="size" class="form">
        <el-form-item prop="_warehouse_id">
          <el-select v-model="filters._warehouse_id" placeholder="仓库名称" filterable clearable>
            <el-option
              v-for="item in warehouselist"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="warehouse_number">
          <el-input v-model="filters.warehouse_number" placeholder="库区编号"></el-input>
        </el-form-item>

        <el-form-item prop="name">
          <el-input v-model="filters.name" placeholder="库区名称"></el-input>
        </el-form-item>

        <el-form-item prop="charge_person">
          <el-input v-model="filters.charge_person" placeholder="负责人"></el-input>
        </el-form-item>

        <el-row>
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
              icon="fa fa-plus"
              :label="$t('action.add')"
              type="primary"
              @click="handleAdd"
            />
          </el-form-item>
          <el-form-item>
            <kt-button icon="el-icon-refresh" :label="$t('action.reset')" type="primary" @click="resetForm('filters')" />
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
      :height="350"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="60%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
        :inline="true"
        class="form"
      >
        <el-form-item label="所属仓库" prop="number">
          <el-select v-model="dataForm.warehouse_id" placeholder="仓库名称" filterable clearable>
            <el-option
              v-for="item in warehouselist"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库区编号" prop="number">
          <el-input v-model="dataForm.number" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="库区名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="dataForm.charge_person" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="联系电话">
          <el-input
            v-model="dataForm.charge_mobile"
            maxlength="11"
            show-word-limit
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮件">
          <el-input v-model="dataForm.email" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
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
import utils from "@/assets/js/utils.js";
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
      list: [],
      warehouselist: [],
      attribute: [{ key: 0, value: "自有库" }, { key: 1, value: "委外库" }],
      filters: {
        warehouse_number: "",
        name: "",
        attribute: "",
        charge_person: "",
        deptid: "",
        address: "",
        charge_mobile: "",
        longitude: "",
        dimension: "",
        _warehouse_id:""
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [{ required: true, message: "请输入库区名称", trigger: "blur" }],
        number: [{ required: true, message: "请输入库区编号", trigger: "blur" }]
      },
      // 新增编辑界面数据
      dataForm: {}
    };
  },

  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "warehouseArea";
      this.$refs.CyTable.findPage(this.filters);
    },
    // 部门初始化和仓库名称初始化
    queryUserList() {
      var that = this;
      this.utils.request.queryUserList({ t: "sysDept" }, function(data) {
        that.list = data.data;
      });
      this.utils.request.queryUserList({ t: "warehouse" }, function(data) {
        that.warehouselist = data.data;
      });
    },

    // 批量删除
    handleDelete: function(data) {
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }
      data.t = "warehouseArea";
      data.ids = ids;
      this.utils.request.deleteUserInfo(data, data.callback);
    },
    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let filename = "库区档案信息";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {};
    },
    // 显示编辑界面
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            params.t = "warehouseArea";
            this.utils.request.editUserInfo(params, this.editInfoBack);
          });
        }
      });
    },
    // 新增修改回调
    editInfoBack: function(data) {
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
        this.dialogVisible = false;
        this.$refs["dataForm"].resetFields();
      } else {
        this.$message({ message: "操作失败, " + data.msg, type: "error" });
      }
      this.findPage({ t: "warehouseArea" });
      this.dialogVisible = false;
      this.operation = false;
      this.editLoading = false;
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
          prop: "warehouse_name",
          label: "仓库名称",
          minWidth: 80
        },
        { prop: "warehouse_number", label: "库区编号", minWidth: 120 },
        { prop: "name", label: "库区名称", minWidth: 120 },

        { prop: "charge_person", label: "库区负责人", minWidth: 120 },
        { prop: "charge_mobile", label: "联系电话", minWidth: 120 },
        { prop: "email", label: "邮件", minWidth: 120 },
        { prop: "remark", label: "备注", minWidth: 80 }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },
    warehouseFormattrt(row, column, cellValue, index) {},
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.CyTable.resetForm();
      this.findPage({ t: "warehouseArea" });
    },
   
  },
  mounted() {
    this.initColumns();
    this.queryUserList();
  }
};
</script>

<style scoped>
/deep/ .form .el-input__inner {
  width: 200px !important;
}
</style>