<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" class="form">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="产品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.number" placeholder="产品编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.level" placeholder="产品规格"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.typename" filterable placeholder="所属类别">
            <el-option v-for="item in options" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.storage_temp" filterable placeholder="存储温度">
            <el-option v-for="item in storage_temp_options" :key="item.text" :label="item.text" :value="item.text"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.unit_volume" placeholder="单件产品体积（m³）"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.unit_weight" placeholder="单件产品重量（kg）"></el-input>
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
              @click="resetForm('filters')"
              icon="el-icon-refresh"
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
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品规格" prop="level">
          <el-input v-model="dataForm.level" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品编号" prop="number">
          <el-input v-model="dataForm.number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属类别" prop="type_id">
          <el-select v-model="dataForm.type_id" style="width: 100%" placeholder="所属类别" filterable clearable>
            <el-option v-for="item in options" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="存储温度" prop="storage_temp">
          <el-select v-model="dataForm.storage_temp" style="width: 100%" placeholder="存储温度" filterable clearable>
            <el-option v-for="item in storage_temp_options" :key="item.text" :label="item.text" :value="item.text"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="体积">
          <el-input v-model="dataForm.unit_volume" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="重量" >
          <el-input v-model="dataForm.unit_weight" auto-complete="off"></el-input>
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
      size: "small",
      excelUpload:
        this.utils.getHost() +
        "/excel/ajaxUploadSkuInfoExcel?token=" +
        localStorage.getItem("token"),
      filters: {
        name: ""
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      options: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      storage_temp_options:[{text:"常温"},{text:"冷冻"},{text:"冷藏"}],
      dataFormRules: {
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        number: [
          { required: true, message: "请输入产品编号", trigger: "blur" }
        ],
        level: [{ required: true, message: "请输入产品编号", trigger: "blur" }],
        unit_volume: [
          { required: true, message: "请输入产品单位体积", trigger: "blur" }
        ],
        unit_weight: [
          { required: true, message: "请输入产品单位质量", trigger: "blur" }
        ]
      },

      // 新增编辑界面数据
      dataForm: {
        name: "",
        level: "",
        number: "",
        unit_volume: "",
        unit_weight: ""
      }
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "sku";
      this.$refs.CyTable.findPage(this.filters);
    },
    // 所属类别初始化
    queryUserList() {
      var that = this;
      this.utils.request.queryUserList({ t: "skuType" }, function(data) {
        that.options = data.data;
      });
    },

    // 批量删除
    handleDelete: function(data) {
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }
      data.params.t = "sku";
      data.params.ids = ids;
      this.utils.request.deleteUserInfo(data.params, data.callback);
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {};
    },
    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let filename = "产品信息";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
    },
    // 显示编辑界面
    handleEdit: function(params) {
      console.log(params);
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
            params.t = "sku";
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
      this.findPage({ t: "sku" });
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
        { prop: "name", label: "产品名称", minWidth: 120 },
        { prop: "level", label: "产品规格", minWidth: 120 },
        { prop: "number", label: "产品编号", minWidth: 120 },
        { prop: "typename", label: "所属类别", minWidth: 120 },
        { prop: "storage_temp", label: "存储温度", minWidth: 120 },
        { prop: "unit_volume", label: "单件产品体积（m³）", minWidth: 120 },
        { prop: "unit_weight", label: "单件产品重量（kg）", minWidth: 120 }

        // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    },
    resetForm(formName) {
      this.filters = {
        level: "",
        number: "",
        text: "",
        unit_volume: "",
        unit_weight: "",
        typename: ""
      };
      this.$refs.CyTable.resetForm();
      this.findPage({ t: "sku" });
    },
    downloadTemplete() {
      var a = document.createElement("a");
      a.href = "/static/excel/productList.xlsx";
      a.download = "产品信息模板.xlsx";
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
       
      return true;
    }
  },
  mounted() {
    this.initColumns();
    this.queryUserList();
  }
};
</script>

<style scoped>
/deep/ .form-input .el-input__inner {
  width: 200px;
}
</style>