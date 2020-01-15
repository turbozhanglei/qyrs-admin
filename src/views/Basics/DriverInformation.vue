<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" class="form">
        <el-form-item>
          <el-input v-model="filters.driver_name" placeholder="司机姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.phone" placeholder="联系方式"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.car_type" placeholder="车型"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.car_num" placeholder="车牌号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.remark" placeholder="备注"></el-input>
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
      permsEdit="sys:user:edit"
      permsDelete="sys:user:delete"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @selectionChange="selectionChange"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增系统司机':'编辑系统司机'"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="dataForm" label-width="150px" ref="dataForm" style="text-align:center">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="司机姓名" prop="drivername">
          <el-input v-model="dataForm.drivername" auto-complete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input v-model="dataForm.mobile" auto-complete="off" placeholder="可输入多个手机号用,隔开"></el-input>
        </el-form-item>
        <el-form-item label="车型" prop="driver_type">
          <el-input v-model="dataForm.driver_type" auto-complete="off" placeholder="如7.5m、6.7m"></el-input>
        </el-form-item>
        <el-form-item label="车牌号" prop="driver_number">
          <el-input v-model="dataForm.driver_number" auto-complete="off" placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="dataForm.remark"
            auto-complete="off"
            :placeholder="operation?'请输入备注':''"
          ></el-input>
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

    <el-dialog title="审核页面" :visible.sync="checkpage" width="30%">
      <el-form>
        <el-row>
          <el-form-item>
            <el-col span="8">
              <span>审核操作:</span>
            </el-col>
            <el-col span="16">
              <el-select v-model="filters.customer_nature" placeholder="请选择">
                <el-option label="审核通过" value="审核通过"></el-option>
                <el-option label="审核驳回" value="审核驳回"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button @click="checkpage = false">取 消</el-button>
        <el-button type="primary" @click="checkpage = false">确 定</el-button>
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
export default {
  components: {
    PopupTreeInput,
    KtTable,
    CyTable,
    KtButton,
    TableColumnFilterDialog
  },
  data() {
    return {
      excelUpload:
        this.utils.getHost() +
        "/excel/ajaxUploadDriverExcel?token=" +
        localStorage.getItem("token"),
      size: "small",
      filters: {
        driver_name: "",
        phone: "",
        car_type: "",
        car_num: "",
        remark: ""
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      checked: [],
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      checkpage: false,
      dataFormRules: {
        name: [{ required: true, message: "请输入货位名称", trigger: "blur" }],
        number: [
          { required: true, message: "请输入类别编号", trigger: "blur" }
        ],
        type: [
          {
            required: true,
            message: "请输入食品、食品添加剂类别",
            trigger: "blur"
          }
        ]
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
    // 获取分页数据

    findPage: function(data) {
      this.filters.t = "wdriver";
      this.$refs.CyTable.findPage(this.filters);
    },

    resetForm(formName) {
      this.filters = {
        t: "wdriver",
        driver_name: "",
        phone: "",
        car_type: "",
        car_num: "",
        remark: "",

        id: ""
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
          let filename = "司机档案信息";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
    },
    // 批量删除
    handleDelete: function(data) {
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }

      data.t = "wdriver";
      data.ids = ids;
      this.utils.request.deleteUserInfo(data, this.deleteInfoBack);
    },
    deleteInfoBack: function() {
      this.findPage();
      this.dialogVisible = false;
      this.operation = false;
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {};
      // this.dataForm = {
      // 	id: 0,
      // 	name: '',
      // 	password: '',
      // 	deptId: 1,
      // 	deptName: '',
      // 	email: 'test@qq.com',
      // 	mobile: '13889700023',
      // 	status: 1,
      // 	userRoles: []
      // }
    },
    check: function() {
      if (this.checked.length > 0) {
        this.checkpage = true;
      } else {
        this.$message({ message: "审核时，最少选择一条数据", type: "error" });
      }
    },

    // 显示编辑界面
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
      let userRoles = [];
      this.dataForm.userRoles = userRoles;
      this.dataForm.operator_num = "1/3";
      console.log(this.dataForm);
    },
    selectionChange: function(params) {
      this.checked = params.selections;
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            params.t = "wdriver";
            this.utils.request.editUserInfo(params, this.editInfoBack);
          });
        }
      });
    }, // 新增修改回调
    editInfoBack: function() {
      this.findPage();
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
        { prop: "drivername", label: "司机姓名", minWidth: 120 },
        { prop: "mobile", label: "联系方式", minWidth: 120 },
        { prop: "driver_type", label: "车型", minWidth: 120 },
        { prop: "driver_number", label: "车牌号 ", minWidth: 120 },
        { prop: "remark", label: "备注", minWidth: 120 }

        // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },
    downloadTemplete() {
      var a = document.createElement("a");
      a.href = "/static/excel/driverInformation.xlsx";
      a.download = "司机档案模板.xlsx";
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
    }
  },
  mounted() {
    this.initColumns();
  }
};
</script>

<style scoped>
/deep/ .form .el-input__inner   {
      width: 200px !important;
}
</style>