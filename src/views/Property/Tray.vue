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
        <el-form-item>
          <el-input v-model="filters.code" placeholder="托盘编码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.names" placeholder="托盘名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.norm" placeholder="托盘规格"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.maxweight" placeholder="最大承重(KG)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.volume" placeholder="托盘容积"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.query" placeholder="存放月台"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.warehouse_id" placeholder="存放仓库" filterable clearable>
            <el-option v-for="item in dataware" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <!-- <el-input v-model="filters.name" placeholder="仓库名称"></el-input> -->
        </el-form-item>

        <el-form-item>
          <el-select v-model="filters.savearea" placeholder="存放区域" filterable clearable>
            <el-option v-for="item in dataarea" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.manager" placeholder="直接管理人"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-input v-model="filters.dept" placeholder="部门"></el-input> -->
          <el-select
            v-model="filters.dept"
            style="width: 200px;"
            placeholder="主管部门"
            filterable
            clearable
          >
            <el-option v-for="item in list" :key="item.id" :label="item.dept_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.phone" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.tray_type" placeholder="托盘类型">
            <el-option label="木制托盘" value="0"></el-option>
            <el-option label="塑料托盘" value="1"></el-option>
            <el-option label="钢制托盘" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.remark" placeholder="备注"></el-input>
        </el-form-item>

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
          <el-form-item>
            <kt-button
              label="模板下载"
              icon="el-icon-document"
              type="primary"
              @click="downloadTemplete"
              perms="basic:customer:checked"
            />
          </el-form-item>
          <el-form-item>
            <el-upload
              class="avatar-uploader"
              :action="excelUpload"
              :show-file-list="false"
              :on-success="handleExcelSuccess"
              :before-upload="beforeExcelUpload"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            >
              <kt-button
                icon="el-icon-document-add"
                size="small"
                perms="basic:customer:checked"
                type="primary"
                label="模板导入"
              ></kt-button>
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
              <el-button
                icon="fa fa-refresh"
                @click="$refs.CyTable.findPageBeforeRestPages(filters)"
              ></el-button>
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
      :title="operation?'托盘新增':'托盘编辑'"
      width="60%"
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

        <el-form-item label="托盘编码" prop="number">
          <el-input v-model="dataForm.number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="托盘名称" prop=" 'name' ">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="托盘规格" prop="norm">
          <el-input v-model="dataForm.norm" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="最大承重(KG)" prop="maxweight">
          <el-input v-model="dataForm.maxweight" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="托盘容积" prop="volume">
          <el-input v-model="dataForm.volume" auto-complete="off"></el-input>
        </el-form-item>

        <!-- <el-form-item label="存放仓库" prop="warehouse_id">
          <el-select
            v-model="dataForm.warehouse_id"
            placeholder="存放仓库"
            clearable
            filterable
            @change="choseWarehouse"
          >
            <el-option v-for="item in dataware" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="存放区域">
          <el-select v-model="dataForm.savearea" filterable clearable @change="choseWarehouseArea">
            <el-option
              v-for="item in warehouseAreaOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>-->

        <el-form-item label="主管部门" prop="dept_id">
          <el-select
            v-model="dataForm.dept_id"
            style="width: 200px"
            placeholder="请选择部门"
            filterable
            clearable
          >
            <el-option v-for="item in list" :key="item.id" :label="item.dept_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="托盘类型" prop="tray_type">
          <el-select v-model="dataForm.tray_type">
            <el-option
              v-for="item in tray_type"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="存放月台" prop="railway_platform">
          <el-input v-model="dataForm.railway_platform" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="直接管理人" prop="manager">
          <el-input v-model="dataForm.manager" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话(手机)" prop="manager_mobile">
          <el-input v-model="dataForm.manager_mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="设备照片" prop="trayphoto">
          <img-upload
            ref="ImgUpload"
            :filelist="imgUploadList"
            @handleImgUploadRemove="handleImgUploadRemove"
            @handleImgUploadChange="handleImgUploadChange"
            @handlePictureCardPreview="handlePictureCardPreview"
            uploadButton="tray"
          ></img-upload>
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

    <el-dialog :visible.sync="dialogVisibleImageList" title="托盘图片">
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
      excelUpload:
        this.utils.getHost() +
        "/excel/ajaxUploadTrayExcel?token=" +
        localStorage.getItem("token"),
      filelist: [],
      imgUploadList: [],
      warehouseAreaOptions: [],
      dialogVisibleImageList: false,
      list: [],
      tray_type: [
        { key: 0, value: "木制托盘" },
        { key: 1, value: "塑料托盘" },
        { key: 2, value: "钢制托盘" }
      ],
      size: "small",
      loading: false,
      dialogVisibleImage: false,
      dataware: [],
      dataarea: [],
      filters: {
        savearea: "",
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
        query: ""
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
        norm: "",
        maxWeight: "",
        volume: "",
        warehouse_id: "",
        savearea: "",
        trayphoto: "",
        dept_id: "",
        manager: "",
        manager_mobile: "",
        savelocation: "",
        tray_type: "",
        remark: ""
      }
    };
  },
  methods: {
    downloadTemplete() {
      var a = document.createElement("a");
      a.href = "/static/excel/tray.xlsx";
      a.download = "托盘模板.xlsx";
      a.click();
    },
    handleExcelSuccess(res, file) {
      let fileUrl = URL.createObjectURL(file.raw);
      if (res.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
        this.findPage();
      } else {
        this.$message({ message: "导入失败", type: "error" });
      }
    },
    beforeExcelUpload(file) {
      console.log(file);
      return true;
    },
    // 获取分页数据

    findPage: function(data) {
      this.filters.t = "wtray";
      this.$refs.CyTable.findPage(this.filters);
    },
    // 部门初始化
    queryUserDeptList() {
      var that = this;
      this.utils.request.queryUserList({ t: "sysDept", type: 20 }, function(
        data
      ) {
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
          let filename = "托盘管理";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
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
      (this.filters = {
        t: "wtray",
        name: "",
        number: "",
        norm: "",
        maxweight: "",
        volume: "",
        warehouse_id: "",
        savearea: "",
        trayphoto: "",
        dept_id: "",
        manager: "",
        manager_mobile: "",
        savelocation: "",
        tray_type: "",
        remark: "",
        id: "",
        query: ""
      }),
        this.$refs.CyTable.resetForm();
      this.findPage();
    },
    // 批量删除
    handleDelete: function(data) {
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }

      data.t = "wtray";
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
      if (this.$refs["dataForm"] != undefined) {
        this.$refs["dataForm"].resetFields();
      }
      this.dataForm = {};
      this.dataForm.document_license = "";
      this.imgUploadList = [];
      this.dialogVisible = true;
      this.operation = true;
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

      this.warehouseAreaOptions = this.dataarea;
      if (this.utils.isNull(this.dataForm.trayphoto)) {
        this.imgUploadList = [];
      } else {
        var this_ = this;
        this.imgUploadList = [];
        $.each(this.dataForm.trayphoto.split(","), function(key, val) {
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
            params.t = "wtray";

            let trayphoto = this.imgUploadList.map(item => item.url).toString();
            params.trayphoto = trayphoto;

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
        { prop: "number", label: "托盘编码", minWidth: 100 },
        { prop: "name", label: "托盘名称", minWidth: 120 },
        { prop: "norm", label: "托盘规格", minWidth: 120 },
        { prop: "maxweight", label: "最大承重(KG)", minWidth: 150 },
        { prop: "volume", label: "托盘容积(m3)", minWidth: 120 },
        {
          prop: "setting_number",
          label: "存放位置",
          minWidth: 180,
          formatter: this.dateFormatSettingNumber
        },
        {
          prop: "trayphoto",
          label: "托盘照片",
          minWidth: 120,
          formatter: this.showPhto
        },
        {
          prop: "dept_name",
          label: "主管部门",
          minWidth: 120
        },
        { prop: "manager", label: "直接管理人", minWidth: 120 },
        { prop: "manager_mobile", label: "联系电话(手机)", minWidth: 180 },
        {
          prop: "tray_type",
          label: "托盘类型",
          minWidth: 120,
          formatter: this.showTrayType
        },
        { prop: "remark", label: "备注", minWidth: 120 }
        // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
        // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    showTrayType(row, column, cellValue, index) {
      if (cellValue == 0) {
        return "木制托盘";
      }
      if (cellValue == 1) {
        return "塑料托盘";
      }
      if (cellValue == 2) {
        return "钢制托盘";
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
    },

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
    choseWarehouse(val) {
      var search = {};
      search.t = "warehouseArea";
      search._warehouse_id = val;
      var this_ = this;

      this.utils.request.queryUserList(search, function(res) {
        this_.warehouseAreaOptions = res.data;
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
    dateFormatSettingNumber(row, column, cellValue, index) {
      if (this.utils.isNull(cellValue)) {
        return row.railway_platform;
      }
      return cellValue;
    }
  },
  mounted() {
    this.initColumns();
    this.queryUserList();
    this.queryUserList1();
    this.queryUserDeptList();

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

/deep/ .el-icon-zoom-in {
  cursor: pointer;
}
</style>