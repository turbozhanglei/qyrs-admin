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
      <el-form :inline="true" :model="filters" :size="size" class="form">
        <el-form-item>
          <el-input v-model="filters.code" placeholder="设备编码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.names" placeholder="设备名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.modals" placeholder="设备型号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.load_weight" placeholder="最大承重(KG)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.width_requirement" placeholder="通道宽度要求(m)"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-select v-model="filters.storage_warehouse" placeholder="存放仓库" filterable clearable>
            <el-option
              v-for="item in warehouseOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="filters.storage_area" placeholder="存放区域" filterable clearable>
            <el-option
              v-for="item in warehouseAreaOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-input v-model="filters.manager" placeholder="直接管理人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.area" placeholder="存放位置"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.dept" placeholder="主管部门" filterable clearable>
            <el-option
              v-for="item in sysDeptOptions"
              :key="item.id"
              :label="item.dept_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.phone" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.equipment_nature" placeholder="设备性质" filterable clearable>
            <el-option label="自有" value="0"></el-option>
            <el-option label="租赁" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.device_type" placeholder="设备类型" filterable clearable>
            <el-option
              v-for="item in facilityTypeOptions"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            ></el-option>
          </el-select>
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
              perms="sys:user:add"
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
      :title="operation?'新增':'编辑'"
      width="70%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="120px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
        inline
        class="form"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="设备编码" prop="number">
          <el-input v-model="dataForm.number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="设备型号" prop="model">
          <el-input v-model="dataForm.modal" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="最大承重(KG)" prop="maxWeight">
          <el-input v-model="dataForm.maxweight" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="通道宽度要求(m)" prop="widthdemand">
          <el-input v-model="dataForm.widthdemand" auto-complete="off"></el-input>
        </el-form-item>

        <!-- <el-form-item label="存放仓库" prop="warehouse_id">
          <el-select v-model="dataForm.warehouse_id" filterable clearable @change="choseWarehouse">
            <el-option
              v-for="item in warehouseOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="存放区域" prop="savearea">
          <el-select v-model="dataForm.savearea" filterable clearable @change="choseWarehouseArea">
            <el-option
              v-for="item in warehouseAreaOptionsSearch"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>-->

        <el-form-item label="主管部门" prop="dept_id">
          <el-select v-model="dataForm.dept_id" filterable clearable>
            <el-option
              v-for="item in sysDeptOptions"
              :key="item.id"
              :label="item.dept_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备性质" prop="status">
          <el-select v-model="dataForm.status">
            <el-option label="自有" value="0"></el-option>
            <el-option label="租赁" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="device_type">
          <el-select v-model="dataForm.device_type" filterable clearable>
            <el-option
              v-for="item in facilityTypeOptions"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="联系电话(手机)" prop="manager_mobile">
          <el-input v-model="dataForm.manager_mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="存放位置" prop="area">
          <el-input v-model="dataForm.area" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="直接管理人" prop="manager">
          <el-input v-model="dataForm.manager" auto-complete="off"></el-input>
        </el-form-item>
        <el-row>
          <el-form-item label="设备照片" prop="devicephoto">
            <img-upload
              ref="ImgUpload"
              :filelist="imgUploadList"
              @handleImgUploadRemove="handleImgUploadRemove"
              @handleImgUploadChange="handleImgUploadChange"
              @handlePictureCardPreview="handlePictureCardPreview"
              uploadButton="devicephoto"
            ></img-upload>
          </el-form-item>
        </el-row>
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

    <el-dialog :visible.sync="dialogVisibleImageList" title="设备图片">
      <div style="height:500px;overflow: auto;">
        <div v-for="(file,index) in filelist" :key="index" :tabindex="index" style="width:100%">
          <img :src="file" alt />
        </div>
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
import ImgUpload from "@/views/Core/ImgUpload";
export default {
  components: {
    PopupTreeInput,
    CyTable,
    KtButton,
    TableColumnFilterDialog,
    ImgUpload
  },
  data() {
    return {
      filelist: [],
      imgUploadList: [],
      imageUrl: "",
      size: "small",
      dialogImageUrl: "",
      loading: false,
      dialogVisibleImageList: false,
      filters: {
        code: "",
        names: "",
        modals: "",
        load_weight: "",
        width_requirement: "",
        storage_warehouse: "",
        storage_area: "",
        manager: "",
        dept: "",
        phone: "",
        equipment_nature: "",
        remark: "",
        area: ""
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      printPage: false,
      dataFormRules: {
        name: [{ required: true, message: "请输入仓库名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入仓库编码", trigger: "blur" }],
        property: [{ required: true, message: "请仓库属性", trigger: "blur" }]
      },

      // 新增编辑界面数据
      dataForm: {
        name: "",
        number: "",
        model: "",
        maxWeight: "",
        widthDemand: "",
        warehouse_id: "",
        saveArea: "",
        devicephoto: "",
        dept_id: "",
        manager: "",
        manager_mobile: "",
        status: "",
        device_type: "",
        remark: ""
      },
      deptData: [],
      deptTreeProps: {
        label: "name",
        children: "children"
      },
      roles: [],
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      rules: {},
      warehouseOptions: [],
      warehouseAreaOptions: [],
      warehouseAreaOptionsSearch: [],
      facilityTypeOptions: [],
      sysDeptOptions: []
    };
  },
  methods: {
    handlePictureCardPreview(data) {
      var url = data.url;
      this.filelist = [];
      this.filelist.push(url);
      this.dialogVisibleImageList = true;
    },

    handleImgUploadRemove(data) {
      var index = data.index;
      this.imgUploadList.splice(index, 1);
    },
    handleImgUploadChange(data) {
      this.imgUploadList = data.filelist;
    },
    // 获取分页数据

    findPage: function(data) {
      this.filters.t = "warehouseDevice";
      this.$refs.CyTable.findPage(this.filters);
    },

    //重置
    resetForm(formName) {
      this.filters = {
        t: "warehouseDevice",
        code: "",
        names: "",
        modals: "",
        load_weight: "",
        width_requirement: "",
        storage_warehouse: "",
        storage_area: "",
        manager: "",
        dept: "",
        phone: "",
        equipment_nature: "",
        remark: "",
        area: "",
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
          let filename = "设备信息";
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

      data.t = "warehouseDevice";
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
      this.imgUploadList = [];
      if (this.$refs["dataForm"] != undefined) {
        this.$refs["dataForm"].resetFields();
      }
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

      if (this.$refs["dataForm"] != undefined) {
        this.$refs["dataForm"].resetFields();
      }
      this.dataForm = Object.assign({}, params.row);
      if (this.dataForm.status != undefined && this.dataForm.status != null) {
        this.dataForm.status = this.dataForm.status.toString();
      }

      if (this.utils.isNull(this.dataForm.devicephoto)) {
        this.imgUploadList = [];
      } else {
        var this_ = this;
        this.imgUploadList = [];
        $.each(this.dataForm.devicephoto.split(","), function(key, val) {
          let param = {};
          if (this_.utils.isNull(val)) {
          } else {
            param.url = val;
            this_.imgUploadList.push(param);
          }
        });
      }
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            params.t = "warehouseDevice";

            let devicephoto = this.imgUploadList
              .map(item => item.url)
              .toString();
            params.devicephoto = devicephoto;

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
        { prop: "number", label: "设备编码", minWidth: 100 },
        { prop: "name", label: "设备名称", minWidth: 120 },
        { prop: "modal", label: "设备型号", minWidth: 120 },
        { prop: "maxweight", label: "最大承重(KG)", minWidth: 120 },
        { prop: "widthdemand", label: "通道宽度要求(m)", minWidth: 120 },
        { prop: "area", label: "存放位置", minWidth: 120 },
        {
          prop: "devicephoto",
          label: "设备照片",
          minWidth: 120,
          formatter: this.showPhto
        },
        {
          prop: "dept_id",
          label: "主管部门",
          minWidth: 120,
          formatter: this.showDeptType
        },
        { prop: "manager", label: "直接管理人", minWidth: 120 },
        { prop: "manager_mobile", label: "联系电话(手机)", minWidth: 120 },
        {
          prop: "status",
          label: "设备性质",
          minWidth: 120,
          formatter: this.showStatus
        },
        {
          prop: "device_type",
          label: "设备类型",
          minWidth: 120,
          formatter: this.showDeviceType
        },
        { prop: "remark", label: "备注", minWidth: 120 }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    showStatus(row, column, cellValue, index) {
      if (cellValue == 0) {
        return "自有";
      }
      if (cellValue == 1) {
        return "租赁";
      }
    },
    showDeviceType(row, column, cellValue, index) {
      $.each(this.facilityTypeOptions, (key, value) => {
        if (cellValue == value.key) {
          cellValue = value.val;
          return;
        }
      });

      return cellValue;
    },
    showDeptType(row, column, cellValue, index) {
      $.each(this.sysDeptOptions, (key, value) => {
        if (cellValue == value.id) {
          cellValue = value.dept_name;
          return;
        }
      });

      return cellValue;
    },
    initConfig() {
      let params = {};
      params.t = "warehouse";
      this.utils.request.queryUserList(params, res => {
        if (res.data != null) {
          this.warehouseOptions = res.data;
        }
      });
      params.t = "warehouseArea";
      this.utils.request.queryUserList(params, res => {
        if (res.data != null) {
          this.warehouseAreaOptions = res.data;
          this.warehouseAreaOptionsSearch = res.data;
        }
      });

      this.utils.request.queryUserList({ t: "sysDept", type: 20 }, res => {
        if (res.data != null) {
          this.sysDeptOptions = res.data;
        }
      });

      params.t = "sysConfig";
      params.type = "facility_type";
      this.utils.request.queryUserList(params, res => {
        if (res.data != null) {
          $.each(res.data, (key, value) => {
            value.key = Number(value.key);
          });
          this.facilityTypeOptions = res.data;
        }
      });
    },
    choseWarehouse(val) {
      var search = {};
      search.t = "warehouseArea";
      search._warehouse_id = val;
      var this_ = this;

      this.utils.request.queryUserList(search, function(res) {
        this_.warehouseAreaOptionsSearch = res.data;
        this_.dataForm.savearea = "";
        this_.dataForm = Object.assign({}, this_.dataForm);
      });
    },
    choseWarehouseArea(val) {
      if (this.utils.isNull(this.dataForm.warehouse_id)) {
        this.$message({ message: "请先选择仓库 ", type: "error" });
        this.dataForm.savearea = "";
        return;
      }
    },
    showPhto(row, column, cellValue, index) {
      if (cellValue != null && "" != cellValue) {
        return (
          '<i class="el-icon-zoom-in"><div style="display:none">' +
          cellValue +
          "</div></i>"
        );
      }
    }
  },
  mounted() {
    this.initColumns();
    this.initConfig();

    $(document).on(
      "click",
      ".el-icon-zoom-in",
      function(e) {
        let urlList = $(e.target)
          .find("div")
          .html();
        this.filelist = urlList.split(",");
        this.dialogVisibleImageList = true;
      }.bind(this)
    );
  }
};
</script>


<style scoped>
/deep/ .form .el-input__inner {
  width: 200px !important;
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

/deep/ .el-icon-zoom-in {
  cursor: pointer;
}
</style>