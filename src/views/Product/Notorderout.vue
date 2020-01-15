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
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-row style="text-align: left;">
          <el-form-item>
            <el-input v-model="filters.sku_name" placeholder="产品名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.product_specifications" placeholder="产品规格"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.sku_number" placeholder="产品代码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.roduction_date" placeholder="生产日期"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.expiration_date" placeholder="过期日期"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.sku_type_number" placeholder="类别编号"></el-input>
          </el-form-item>
        </el-row>

        <el-row style="text-align: left;">
          <el-form-item>
            <el-input v-model="filters.sku_type_text" placeholder="类别名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.instock_time" placeholder="入库时间"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.setting_id" placeholder="存放货位"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.num" placeholder="件数"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.isexpired" placeholder="是否过期"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.bill" placeholder="单据号"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="text-align: left;">
          <el-form-item>
            <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.cargo_nature" placeholder="货物性质"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.sku_out_why" placeholder="出库事由"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.number" placeholder="申请编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.remark" placeholder="备注"></el-input>
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
          <!-- <el-form-item>
					<kt-button icon="fa fa-plus" :label="$t('action.excel')"  type="primary" @click="handleAdd" />
          </el-form-item>-->
          <!-- <el-form-item>
					<kt-button icon="fa fa-plus" :label="$t('action.print')"  type="primary" @click="print" />
          </el-form-item>-->
          <el-form-item>
            <kt-button
              icon="el-icon-refresh"
              :label="$t('action.reset')"
              type="primary"
              @click="reset"
            />
          </el-form-item>
          <!-- <el-form-item>
					<kt-button icon="fa fa-plus" label="出库" perms="sys:user:print" type="primary"  />
          </el-form-item>-->
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
              <el-button icon="fa fa-file-excel-o" @click="downloadExcel"></el-button>
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
      permsEdit="false"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="91%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @closed="handleClose"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
        inline
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="24">
            <div
              class="grid-content bg-purple"
              style="margin-top: -70px;text-align:center"
            >WMS系统非订单出库页面</div>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="托盘编码" prop="try_number">
            <!-- <el-input v-model="dataForm.client_name" auto-complete="off"></el-input> -->
            <el-select
              style="width: 200px;"
              v-model="dataForm.try_number"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              @change="choseCustomer"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.number"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="单据号" prop="bill">
            <el-input v-model="dataForm.bill" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="货物性质" prop="cargo_nature">
            <!-- <el-input v-model="dataForm.out_goods_property" auto-complete="off"></el-input> -->
            <el-select v-model="dataForm.cargo_nature" style="width:200px">
              <el-option value="1" label="自有"></el-option>
              <el-option value="0" label="非自有"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出库事由" prop="sku_out_why">
            <el-input v-model="dataForm.sku_out_why" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="申请单编号" prop="number">
            <el-input v-model="dataForm.number" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="出库申请表影印件" prop="apply_photo">
            <el-upload
              class="upload-demo"
              :action="zipUpload"
              :on-change="ziphandleImgUploadChange"
              :on-remove="ziphandleRemove"
              multiple
              :limit="1"
              accept="application/zip"
              :on-preview="ziphandleExceed"
              :file-list="zipfileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传zip文件,小于100M,且只能有一个</div>
            </el-upload>
          </el-form-item>

          <el-form-item label="单据证照" prop="single_license">
            <img-upload
              ref="ImgUpload"
              :filelist="imgUploadList"
              @handleImgUploadRemove="handleImgUploadRemove"
              @handleImgUploadChange="handleImgUploadChange"
              @handlePictureCardPreview="handlePictureCardPreview"
              uploadButton="single_license"
            ></img-upload>
          </el-form-item>
        </el-row>
      </el-form>
      <div>
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          tooltip-effect="dark"
          ref="multipleTable"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="产品名称" width="180" prop="productname"></el-table-column>
          <el-table-column label="产品规格" width="180" prop="level"></el-table-column>
          <el-table-column label="类别编号" width="180" prop="typenum"></el-table-column>
          <el-table-column label="类别名称" width="180" prop="typename"></el-table-column>
          <el-table-column label="客户名称" width="180" prop="client_name"></el-table-column>
          <el-table-column label="数量" width="180" prop="numtotal"></el-table-column>
          <el-table-column label="入库批次号" width="180" prop="in_batch_number"></el-table-column>
          <el-table-column label="距保质期到期天数" width="180" prop="distance_day"></el-table-column>
          <el-table-column label="生产日期" width="180" prop="roduction_date"></el-table-column>
          <el-table-column label="过期时间" width="180" prop="expiration_date"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showPictureDialogVisible" title="单据证照">
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
import CyTable from "@/views/Core/CyTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format } from "@/utils/datetime";
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
      zipfileList: [],
      zipUpload: this.utils.getUpLoadHost(),
      showPictureDialogVisible: false,
      imgUploadList: [],
      imageUrl: "",
      dialogImageUrl: "",
      size: "small",
      filters: {
        name: ""
      },
      columns: [],
      product: [],
      filterColumns: [],
      options: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      tableData: [],
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      printPage: false,
      dataFormRules: {
        try_number: [
          { required: true, message: "请输入推盘编码", trigger: "blur" }
        ],
        isexpired: [
          { required: true, message: "请选择仓库编码", trigger: "blur" }
        ],
        cargo_nature: [
          { required: true, message: "请输入货物性质", trigger: "blur" }
        ],
        sku_out_why: [
          { required: true, message: "请输入出库事由", trigger: "blur" }
        ]
      },

      // 新增编辑界面数据
      dataForm: {
        id: "",
        name: "",
        deptName: "",
        status: "",
        userRoles: []
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
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      },
      src:
        "https://ss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=829888290,2650878176&fm=74&app=80&f=JPG&size=f121,121?sec=1880279984&t=274501980523d63a7d93c94f85aabbab"
    };
  },
  methods: {
    ziphandleRemove(file, fileList) {
      this.zipfileList = [];
    },
    ziphandleImgUploadChange(file, fileList) {
      if (file.response != undefined && file.response != null) {
        let uid = file.uid;

        $.each(fileList, function(key, value) {
          if (uid == value.uid) {
            value.url = file.response.data.imgUrl;
          }
        });
        this.zipfileList = fileList;
      }
    },
    ziphandleExceed(files, fileList) {
      var a = document.createElement("a");

      a.href = files.url;
      a.download = "";
      a.target = "_blank";
      a.click();
    },
    handlePictureCardPreview(data) {
      var url = data.url;
      this.filelist = [url];
      this.showPictureDialogVisible = true;
    },

    handleImgUploadRemove(data) {
      var index = data.index;
      this.imgUploadList.splice(index, 1);
    },
    handleImgUploadChange(data) {
      this.imgUploadList = data.filelist;
    },
    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "wOrderNoSaleSku";
      this.$refs.CyTable.findPage(this.filters);
    },
    //查询后台客户信息
    remoteMethod: function(query) {
      if (query !== "") {
        //查询后台客户信息
        var search = {};
        search.t = "wtray";
        search.number = query;
        var this_ = this;
        this.utils.request.queryUserList(search, function(res) {
          this_.options = res.data;
        });
      } else {
        this.options = [];
      }
    },
    //模糊匹配
    choseCustomer: function(selVal) {
      var temp = this.options;
      var this_ = this;
      if (selVal == "" || selVal == null) {
        this_.dataForm.in_batch_number = "";
        this_.dataForm.sku_name = "";
        this_.tableData = "";
      } else {
        $.each(temp, function(key, val) {
          if (val.id == selVal) {
            this_.dataForm.in_batch_number = val.in_batch_number;
            this_.dataForm.sku_name = val.name;
            this_.dataForm.tray_id = val.id;
            this_.dataForm.setting_id = val.savelocation;
            this_.dataForm.try_number = val.number;
            return;
          }
        });
        var search = {};
        search.t = "wtray";
        search.sql = "queryOrderListForLocation";
        search.tray_id = this_.dataForm.tray_id;
        search.setting_id = this_.dataForm.setting_id;
        this.utils.request.queryUserList(search, function(res) {
          if (res != null && res.code == "0000") {
            this_.tableData = res.data;
          } else {
            this.$message({ message: "暂无数据, ", type: "error" });
          }
        });
      }
    },
    // 批量删除
    handleDelete: function(data) {
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }
      data.t = "wOrderNoSaleSku";
      data.ids = ids;
      this.utils.request.deleteUserInfo(data, this.deleteInfoBack);
    },
    handleClose() {
      (this.dataForm.id = ""), (this.tableData = []);
      //this.clearFiles();
      this.bill_photo_list = [];
      this.$refs.dataForm.resetFields();
    },
    //删除callback
    deleteInfoBack(data) {
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
      } else {
        this.$message({ message: "操作失败, ", type: "error" });
      }
      this.findPage();
    },
    handleSelectionChange(val) {
      this.product = JSON.stringify(val);
      this.sku_id = val.map(item => item.id).toString() + ",";
      this.products = val;
      this.multipleSelection = val;
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      //this.dataForm={}
      if (this.$refs["dataForm"] != undefined) {
        this.$refs["dataForm"].resetFields();
      }
      this.imgUploadList = [];
      this.zipfileList = [];

      this.dataForm.document_license = "";
      // this.dataForm = {
      // 	id: 0,
      // 	name: '',
      // 	password: '',
      // 	deptId: 1,
      // 	deptName: '',
      // 	email: 'test@qq.com',
      // 	phone: '13889700023',
      // 	status: 1,
      // 	userRoles: []
      // }
    },
    // 打印
    print: function() {
      this.printPage = true;
      this.operation = true;
    },
    reset: function() {
      this.filters = {};
      this.$refs.CyTable.resetForm();
      this.findPage();
    },

    // 显示编辑界面
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;

      this.$nextTick(() => {
        this.dataForm = Object.assign({}, params.row);
        var this_ = this;
        if (this_.utils.isNull(this_.dataForm.bill_photo)) {
          this_.imgUploadList = [];
        } else {
          this_.imgUploadList = [];
          $.each(this.dataForm.bill_photo.split(","), function(key, val) {
            let param = {};
            if (this_.utils.isNull(val)) {
            } else {
              param.url = val;
              this_.imgUploadList.push(param);
            }
          });
        }

        if (this_.utils.isNull(this_.dataForm.out_warehouse_img)) {
          this_.zipfileList = [];
        } else {
          this_.zipfileList = [];
          $.each(this.dataForm.out_warehouse_img.split(","), function(
            key,
            val
          ) {
            let param = {};
            if (this_.utils.isNull(val)) {
            } else {
              param.url = val;
              var array = val.split("/");
              param.name = array[array.length -1];
              this_.zipfileList.push(param);
            }
          });
        }

        var this_ = this;
        var search = {};
        search.id = params.row.id;
        search.t = "wOrderNoSaleSku";
        this.utils.request.queryUserInfo(search, function(res) {
          if (res.code == "0000") {
            //this_.tableData = res.data;
            // this_.bill_photo_list = this_.dataForm.document_license.split(",");
            // this_.dataForm.document_license = "";
          } else {
            this_.$message({ message: "获取产品信息异常", type: "error" });
          }
        });
      });
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            params.t = "wOrderNoSaleSku";

            var this_ = this;
            if (this_.product.length != 0) {
              params.productData = this_.product;
            } else {
              this.$message({
                message: "请勾选择需要出库的产品",
                type: "error"
              });
              this.editLoading = false;
              return;
            }

            params.sku_id = this.sku_id;

            params.bill_photo = this.imgUploadList
              .map(item => item.url)
              .toString();
            params.out_warehouse_img = this.zipfileList
              .map(item => item.url)
              .toString();

            this.utils.request.editNotorderoutInfo(params, this.editInfoBack);
          });
        }
      });
    },
    // 新增修改回调
    editInfoBack: function(data) {
      this.editLoading = false;
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
        this.findPage();
        this.dialogVisible = false;
        this.operation = false;
      } else {
        this.$message({ message: "操作失败, ", type: "error" });
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
          let filename = "非订单出库";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
    },
    // 获取部门列表
    findDeptTree: function() {
      this.$api.dept.findDeptTree().then(res => {
        this.deptData = res.data;
        console.log(this.deptData);
      });
    },
    // 菜单树选中
    deptTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.id;
      this.dataForm.deptName = data.name;
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
        //{prop:"id", label:"ID", minWidth:50},
        { prop: "sku_name", label: "产品名称", minWidth: 120 },
        { prop: "sku_level", label: "产品规格", minWidth: 120 },
        { prop: "sku_number", label: "产品代码", minWidth: 120 },
        { prop: "client_name", label: "客户名称", minWidth: 120 },
        { prop: "bill", label: "单据号", minWidth: 120 },
        { prop: "number", label: "申请编号", minWidth: 120 },
        { prop: "roduction_date", label: "生产日期(产品批次)", minWidth: 120 },
        { prop: "expiration_date", label: "过期日期", minWidth: 120 },
        { prop: "sku_type_number", label: "类别编号", minWidth: 120 },
        { prop: "sku_type_text", label: "类别名称", minWidth: 120 },
        { prop: "instock_time", label: "入库时间", minWidth: 120 },
        { prop: "setting_num", label: "存放货位", minWidth: 120 },
        { prop: "num", label: "库存数量(件数)", minWidth: 120 },
        { prop: "is_expired", label: "是否过期", minWidth: 120 },
        {
          prop: "bill_photo",
          label: "单据证照",
          minWidth: 120,
          formatter: this.showPhto
        },
        {
          prop: "out_warehouse_img",
          label: "出库申请表影印件",
          minWidth: 120,
          formatter: this.downloadZip
        },
        {
          prop: "cargo_nature",
          label: "货物性质",
          minWidth: 120,
          formatter: this.nature
        },
        { prop: "sku_out_why", label: "出库事由", minWidth: 120 },
        // {prop:"apply_photo", label:"出库申请表影印件", minWidth:120},
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
    location: function(row, column, cellValue, index) {
      if (cellValue == 1) {
        return "是";
      } else {
        return "否";
      }
    },
    nature: function(row, column, cellValue, index) {
      if (cellValue == 1) {
        return "自有";
      } else {
        return "非自有";
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
    downloadZip(row, column, cellValue, index) {
      if (cellValue != null && "" != cellValue) {
        return '<a href="' + cellValue + '" download  target="_blank">下载</a>';
      }
    }
  },

  mounted() {
    this.initColumns();
    this.findPage();

    $(document).on(
      "click",
      ".el-icon-zoom-in",
      function(e) {
        let urlList = $(e.target)
          .find("div")
          .html();
        this.filelist = urlList.split(",");
        this.showPictureDialogVisible = true;
      }.bind(this)
    );
  }
};
</script>

<style scoped>
</style>