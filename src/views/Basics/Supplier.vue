<style>
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
  font-size: 18px;
  align: "center";
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" class="form" :size="size">
        <el-row style="text-align: left;">
          <el-form-item>
            <el-input v-model="filters.supplier_company" placeholder="服务方名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.supplier_people" placeholder="服务方联系人"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.carrier_company" placeholder="送货物流公司"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.supplier_people_mobile" placeholder="服务方联系方式（手机）"></el-input>
          </el-form-item>
        </el-row>

        <el-row style="text-align: left;">
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
              icon="el-icon-refresh"
              :label="$t('action.reset')"
              type="primary"
              @click="resetForm('filters')"
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
      :title="operation?'新增供应商信息':'编辑供应商信息'"
      width="60%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="120px"
        ref="dataForm"
        :size="size"
        label-position="right"
        inline
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="服务方名称" prop="supplier_company">
          <el-input v-model="dataForm.supplier_company" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务方联系人" prop=" supplier_people">
          <el-input v-model="dataForm.supplier_people" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="送货物流公司" prop="carrier_company">
          <el-input v-model="dataForm.carrier_company" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务方联系方式（手机）" prop="supplier_people_mobile">
          <el-input v-model="dataForm.supplier_people_mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-algin:center">
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
import KtTable from "@/views/Core/KtTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format } from "@/utils/datetime";
import CyTable from "@/views/Core/CyTable";
export default {
  components: {
    PopupTreeInput,
    CyTable,
    KtButton,
    TableColumnFilterDialog
  },
  data() {
    return {
      list: [],
      size: "small",
      loading: false,
      dialogVisibleImage: false,
      dataware: [],
      dataarea: [],
      filters: {
        t: "supplier",
        supplier_company: "",
        supplier_people: "",
        carrier_company: "",
        supplier_people_mobile: ""
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      printPage: false,

      // 新增编辑界面数据
      dataForm: {
        supplier_company: "",
        supplier_people: "",
        carrier_company: "",
        supplier_people_mobile: ""
      }
    };
  },
  methods: {
    // 获取分页数据

    findPage: function(data) {
      this.filters.t = "supplier";
      this.$refs.CyTable.findPage(this.filters);
    },
    // 部门初始化
    queryUserDeptList() {
      var that = this;
      this.utils.request.queryUserList({ t: "sysDept" }, function(data) {
        that.list = data.data;
      });
    },

    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let filename = "供应商信息";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
    },
    choseWareHouse: function(selVal) {
      if (selVal !== "") {
        var search = {};
        search.t = "supplier";
        search.id = selVal;
        var this_ = this;

        this.utils.request.queryUserList(search, function(res) {
          this_.savearea = res.data;
        });
      } else {
        this.dataarea = [];
      }
    },

    // 仓库初始化
    queryUserList() {
      var that = this;
      this.utils.request.queryUserList({ t: "warehouse" }, function(data) {
        that.dataware = data.data;
      });
    },
    // 区域初始化
    queryUserList1() {
      var that = this;
      this.utils.request.queryUserList({ t: "warehouseArea" }, function(data) {
        that.dataarea = data.data;
      });
    },

    //重置
    resetForm(formName) {
      this.filters = {
        t: "supplier",
        supplier_company: "",
        supplier_people: "",
        carrier_company: "",
        supplier_people_mobile: "",
        id: ""
      };
      this.$refs.CyTable.resetForm();
      this.findPage();
    },
    // 批量删除
    handleDelete: function(data) {
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }

      data.t = "supplier";
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
    },
    // 新增修改回调
    editInfoBack: function() {
      this.findPage();
      this.dialogVisible = false;
      this.operation = false;
      this.editLoading = false;
    },
    // 打印
    print: function() {
      this.printPage = true;
      this.operation = true;
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
            params.t = "supplier";
            this.utils.request.editUserInfo(params, this.editInfoBack);
          });
        }
      });
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
        { prop: "supplier_company", label: "服务方名称", minWidth: 100 },
        { prop: "supplier_people", label: "服务方联系人", minWidth: 120 },
        { prop: "carrier_company", label: "送货物流公司", minWidth: 120 },
        {
          prop: "supplier_people_mobile",
          label: "服务方联系方式（手机）",
          minWidth: 150
        }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    }
  },
  mounted() {
    this.initColumns();
  }
};
</script>


<style scoped>
/deep/ .form .el-input__inner {
  width: 200px;
}

/deep/ .product .el-input__inner {
  width: 200px !important;
}

/deep/ .driver .el-input__inner {
  width: 180px !important;
}

/deep/ .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 20px;
}

/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
/deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
/deep/ .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>