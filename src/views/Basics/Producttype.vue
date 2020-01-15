<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" ref="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.food_add_type" placeholder="食品、食品添加剂类别"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.number" placeholder="类别编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.text" placeholder="类别名称"></el-input>
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
            <kt-button
              :label="$t('action.reset')"
              type="primary"
              icon="el-icon-refresh"
              @click="resetForm('filters')"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              label="模板下载"
              icon="el-icon-document"
              type="primary"
              @click="downloadTemplete"
            />
          </el-form-item>
          <el-form-item>
            <el-upload
              class="avatar-uploader"
              :action="excelUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            >
              <el-button icon="el-icon-document-add" size="small" type="primary">模板导入</el-button>
            </el-upload>
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
      ref="CyTable"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="180px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
      >
        <el-form-item label="食品、食品添加剂类别" prop="food_add_type">
          <el-input v-model="dataForm.food_add_type" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类别编号" prop="number">
          <el-input v-model="dataForm.number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类别名称" prop="text">
          <el-input v-model="dataForm.text" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
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
      excelUpload:
        this.utils.getHost() +
        "/excel/ajaxUploadSkuTypeExcel?token=" +
        localStorage.getItem("token"),
      filters: {
        name: ""
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        text: [{ required: true, message: "请输入货位名称", trigger: "blur" }],
        number: [
          { required: true, message: "请输入类别编号", trigger: "blur" }
        ],
        food_add_type: [
          {
            required: true,
            message: "请输入食品、食品添加剂类别",
            trigger: "blur"
          }
        ]
      },

      // 新增编辑界面数据
      dataForm: {
        text: "",
        number: "",
        food_add_type: ""
      }
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "skuType";
      this.$refs.CyTable.findPage(this.filters);
    },

    // 批量删除
    handleDelete: function(data) {
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }
      data.t = "skuType";
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
          let filename = "产品分类";
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
      this.dataForm = {
        text: "",
        number: "",
        food_add_type: ""
      };
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
            let userRoles = [];
            params.t = "skuType";
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
      this.findPage({ t: "skuType" });
      this.dialogVisible = false;
      this.operation = false;
      this.editLoading = false;
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
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
        { prop: "food_add_type", label: "食品、食品添加剂类别", minWidth: 120 },
        { prop: "number", label: "类别编号", minWidth: 120 },
        { prop: "text", label: "类别名称", minWidth: 120 }
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    },
    resetForm(formName) {
      this.filters = {
        food_add_type: "",
        number: "",
        text: ""
      };
      this.$refs.CyTable.resetForm();
      this.findPage({ t: "skuType" });
    },
    downloadTemplete() { 
      var a = document.createElement("a");
      a.href =
        "/static/excel/producttype.xlsx";
      a.download = "产品分类模板.xlsx";
      a.click();
    },
    handleAvatarSuccess(res, file) {
      let fileUrl = URL.createObjectURL(file.raw);
      if (res.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
        this.findPage();
      } else {
        this.$message({ message: "导入失败", type: "error" });
      }
    },
    beforeAvatarUpload(file) {
      console.log(file);
      return true;
    },
  
  },
  mounted() {
    this.initColumns();
   
  }
};
</script>

<style scoped>
</style>