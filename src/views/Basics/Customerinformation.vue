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
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" class="form">
        <el-form-item>
          <el-input v-model="filters.code" placeholder="客户代码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filters.unified_social_credit_code"
            placeholder="统一社会信用代码"
            maxlength="18"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.registered_capital" placeholder="注册资本（万元）"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.legal_name" placeholder="法人姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.storage_warehouse" placeholder="法人证件类型">
            <el-option
              v-for="item in paperwork_type_options"
              :key="item.key"
              :label="item.val"
              :value="item.key"
              clearable
              filterable
            ></el-option>
          </el-select>
          <!-- <el-input v-model="filters.name" placeholder="仓库名称"></el-input> -->
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.legal_document_number" placeholder="法人证件号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.startdate"
            type="date"
            placeholder="法人证件有效期始"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.enddate"
            type="date"
            placeholder="法人证件有效期末"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="operator_name">
          <el-input v-model="filters.operator_name" placeholder="经办人姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.operator_document_type" placeholder="经办人证件类型">
            <el-option
              v-for="item in paperwork_type_options"
              :key="item.key"
              :label="item.val"
              :value="item.key"
              clearable
              filterable
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.operator_document_number" placeholder="经办人证件号"></el-input>
        </el-form-item>

        <el-form-item>
          <!-- <el-input v-model="filters.customer_nature" placeholder="客户性质"></el-input> -->
          <el-select v-model="filters.customer_nature" placeholder="客户性质">
            <el-option
              v-for="item in customer_type_options"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <el-input v-model="filters.industry_type" placeholder="行业类型"></el-input> -->
          <el-select v-model="filters.industry_type" placeholder="行业类型" clearable filterable>
            <el-option
              v-for="item in trade_type_options"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.operator_phone" placeholder="经办人联系方式"></el-input>
        </el-form-item>
        <el-form-item prop="manager_email">
          <el-input v-model="filters.operator_email" placeholder="经办人工作邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-input v-model="filters.is_contract" placeholder="是否签订了合同"></el-input> -->
          <el-select v-model="filters.is_contract" placeholder="是否签订了合同">
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.remarks" placeholder="备注"></el-input>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="filters.startdate1"
            type="date"
            placeholder="经办人证件有效期始"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.enddate1"
            type="date"
            placeholder="经办人证件有效期末"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.status" placeholder="审核状态">
            <el-option label="未审核" :value="0"></el-option>
            <el-option label="审核中" :value="1"></el-option>
            <el-option label="审核通过" :value="2"></el-option>
            <el-option label="审核拒绝" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-row>
          <el-form-item>
            <kt-button
              icon="fa fa-plus"
              label="新增"
              perms="basic:customer:checked"
              type="primary"
              @click="addInfo"
            />
          </el-form-item>
          <el-form-item>
            <kt-button icon="fa fa-search" label="查询" type="primary" @click="queryInfo" />
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
              icon="el-icon-s-check"
              label="审核"
              type="primary"
              @click="audit"
              perms="basic:customer:checked"
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
        @handleFilterColumns="handleFilterColumns"
        :columns="columns"
      ></table-column-filter-dialog>
    </div>
    <!--表格内容栏-->
    <cy-table
      :max-height="500"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @selectionChange="selectionChange"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="80%"
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

        <el-form-item label="客户代码" prop="customerno" v-show="!operation">
          <el-input v-model="dataForm.customerno" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="客户名称" prop="client_name">
          <el-input v-model="dataForm.client_name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="注册资本（万元）" prop="registered_capital">
          <el-input v-model="dataForm.registered_capital" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="法人姓名" prop="legalname">
          <el-input v-model="dataForm.legalname" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="法人证件类型" prop="paperwork_type">
          <!-- <el-input v-model="dataForm.legal_document_type"  auto-complete="off"></el-input> -->
          <el-select v-model="dataForm.paperwork_type" placeholder="法人证件类型" clearable filterable>
            <el-option
              v-for="item in paperwork_type_options"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="法人证件号" prop="paperwork_no">
          <el-input v-model="dataForm.paperwork_no" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="客户性质" prop="customer_type">
          <el-select v-model="dataForm.customer_type" placeholder="客户性质" clearable filterable>
            <el-option
              v-for="item in customer_type_options"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="距保质期天数预警" prop="warningday">
          <el-input v-model="dataForm.warningday" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="行业类型" prop="trade_type">
          <el-select v-model="dataForm.trade_type" placeholder="行业类型" clearable filterable>
            <el-option
              v-for="item in trade_type_options"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否签订了合同" prop="isdeal">
          <el-select v-model="dataForm.isdeal" placeholder="是否签订了合同">
            <el-option label="是" :value="0"></el-option>
            <el-option label="否" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="经办人姓名" prop="manager_name">
          <el-input v-model="dataForm.manager_name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="经办人证件类型" prop="manager_papertype">
          <el-select
            v-model="dataForm.manager_papertype"
            placeholder="经办人证件类型"
            clearable
            filterable
          >
            <el-option
              v-for="item in paperwork_type_options"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="经办人证件号" prop="manager_paperwork">
          <el-input v-model="dataForm.manager_paperwork" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="经办人联系方式" prop="manager_mobile">
          <el-input v-model="dataForm.manager_mobile" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="经办人工作邮箱" prop="manager_email">
          <el-input v-model="dataForm.manager_email" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="法人证件有效期" prop="effective_time">
          <el-date-picker
            v-model="dataForm.effective_time"
            style="width:100%"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="经办人证件号有效期" prop="manager_effectivetime">
          <el-date-picker
            v-model="dataForm.manager_effectivetime"
            style="width:100%"
            type="date"
            placeholder="经办人证件号有效期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="营业执照注册日期" prop="business_date_start">
          <el-date-picker
            v-model="dataForm.business_date_start"
            type="date"
            style="width:100%"
            placeholder="营业执照注册日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="营业执照到期日期" prop="business_date">
          <el-date-picker
            v-model="dataForm.business_date"
            type="date"
            style="width:100%"
            placeholder="营业执照到期日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="统一社会信用代码" prop="socialcode">
          <el-input
            v-model="dataForm.socialcode"
            auto-complete="off"
            maxlength="18"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="登录密码" v-show="operation">
          <el-input
            v-model="dataForm.password2"
            style="position:fixed;buttom:-9999px"
            auto-complete="off"
          ></el-input>
          <el-input
            v-model="dataForm.password1"
            style="position:fixed;buttom:-9999px"
            type="password"
            auto-complete="off"
          ></el-input>
          <el-input v-model="dataForm.password" auto-complete="off" show-password></el-input>
        </el-form-item>

        <el-row>
          <el-form-item label="营业执照">
            <img-upload
              :filelist="businesslicenseimgUploadList"
              @handleImgUploadRemove="businesslicenseImgUploadRemove"
              @handleImgUploadChange="businesslicenseImgUploadChange"
              @handlePictureCardPreview="handlePictureCardPreview"
              uploadButton="businesslicense"
            ></img-upload>
          </el-form-item>

          <el-form-item label="经办人证件照">
            <img-upload
              :filelist="managerphotoimgUploadList"
              @handleImgUploadRemove="managerphotoImgUploadRemove"
              @handleImgUploadChange="managerphotoImgUploadChange"
              @handlePictureCardPreview="handlePictureCardPreview"
              uploadButton="managerphoto"
            ></img-upload>
          </el-form-item>

          <el-form-item label="法人证件照片">
            <img-upload
              :filelist="paperworkphotoimgUploadList"
              @handleImgUploadRemove="paperworkphotoImgUploadRemove"
              @handleImgUploadChange="paperworkphotoImgUploadChange"
              @handlePictureCardPreview="handlePictureCardPreview"
              uploadButton="paperworkphoto"
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

    <el-dialog title="审核页面" :visible.sync="checkpage" width="30%">
      <el-form style="text-align:center">
        <el-row>
          <el-form-item>
            <span>审核操作:</span>
            <el-select v-model="customer_nature" placeholder="请选择">
              <el-option label="审核通过" :value="2"></el-option>
              <el-option label="审核驳回" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button @click="checkpage = false">取 消</el-button>
        <el-button type="primary" @click="checkpaged">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleImg">
      <img width="100%" :src="dialogImageUrl" alt />
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
    KtTable,
    CyTable,
    KtButton,
    TableColumnFilterDialog,
    ImgUpload
  },
  data() {
    return {
      disabled: false,
      dialogVisibleImg: false,
      excelUpload:
        this.utils.getHost() +
        "/excel/ajaxUploadCustomerExcel?token=" +
        localStorage.getItem("token"),
      customer_type_options: [],
      paperwork_type_options: [],
      trade_type_options: [],
      imageUrl: "",
      size: "small",
      dialogImageUrl: "",
      loading: false,
      customer_nature: "",
      filters: {
        t: "wcustomer",
        startdate: "",
        enddate: "",
        startdate1: "",
        enddate1: "",
        code: "",
        accounts: "",
        unified_social_credit_code: "",
        registered_capital: "",
        legal_name: "",
        storage_warehouse: "",
        legal_document_number: "",
        effective_time: "",
        operator_name: "",
        operator_document_number: "",
        effective_time: "",
        operator_document_type: "",
        customer_nature: "",
        industry_type: "",
        operator_phone: "",
        operator_email: "",
        is_contract: "",
        remark: "",
        id: "",
        status: ""
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
        client_name: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ],
        manager_email: [
          { required: true, message: "请输入邮箱", trigger: "blur" }
        ],
        manager_name: [
          { required: true, message: "请输入经办人姓名", trigger: "blur" }
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
      dataForm: {
        customer_type: "",
        customerno: "",
        account: "",
        socialcode: "",
        registered_capital: "",
        legalname: "",
        paperwork_type: "",
        paperwork_no: "",
        effective_time: "",
        manager_name: "",
        manager_paperwork: "",
        manager_papertype: "",
        manager_effectivetime: "",
        customer_type: "",
        trade_type: "",
        manager_mobile: "",
        manager_email: "",
        isdeal: "",
        warningday: "",
        remark: "",
        status: "0",
        businesslicense: "",
        business_date: "",
        manager_photo: "",
        client_name: "",
        paperwork_photo: "",
        business_date_start: ""
      },
      deptData: [],
      deptTreeProps: {
        label: "name",
        children: "children"
      },
      roles: [],
      businesslicenseimgUploadList: [],
      managerphotoimgUploadList: [],
      paperworkphotoimgUploadList: []
    };
  },
  methods: {
    handlePictureCardPreview(data) {
      var url = data.url;
      this.dialogImageUrl = url;
      this.dialogVisibleImg = true;
    },

    businesslicenseImgUploadRemove(data) {
      var index = data.index;
      this.businesslicenseimgUploadList.splice(index, 1);
    },
    businesslicenseImgUploadChange(data) {
      this.businesslicenseimgUploadList = data.filelist;
    },
    managerphotoImgUploadRemove(data) {
      var index = data.index;
      this.managerphotoimgUploadList.splice(index, 1);
    },
    managerphotoImgUploadChange(data) {
      this.managerphotoimgUploadList = data.filelist;
    },
    paperworkphotoImgUploadRemove(data) {
      var index = data.index;
      this.paperworkphotoimgUploadList.splice(index, 1);
    },
    paperworkphotoImgUploadChange(data) {
      this.paperworkphotoimgUploadList = data.filelist;
    },

    findPage: function(data) {
      this.filters.t = "wcustomer";

      let customer_id = localStorage.getItem("customer_id");
      if (!this.utils.isNull(customer_id)) {
        this.filters.customer_id = customer_id;
      }

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
          let filename = "客户档案信息";
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

      data.t = "wcustomer";
      data.ids = ids;
      this.utils.request.deleteUserInfo(data, this.deleteInfoBack);
    },
    deleteInfoBack: function() {
      this.findPage();
      this.dialogVisible = false;
      this.operation = false;
    },
    // 显示查询
    queryInfo: function() {
      this.findPage(this.filters);
    },
    selectionChange: function(params) {
      console.log(params);
      this.checked = params.selections;
    },
    //审核
    audit: function() {
      if (this.checked.length == 0) {
        this.$message({ message: "请至少选择一个产品", type: "error" });
        return;
      } else {
        this.checkpage = true;
      }
    },
    //提交审核
    checkpaged: function() {
      let ids = this.checked.map(item => item.id).toString();
      var this_ = this;
      var customer_nature = this.customer_nature;
      this.utils.request.doAudits(
        { ids: ids, status: customer_nature },
        function(res) {
          if (res.code == "0000") {
            this_.$message({ message: "审核完成", type: "success" });
            this_.checkpage = false;
            this_.findPage();
          } else {
            this_.$message({ message: res.msg, type: "error" });
          }
        }
      );
    },
    addInfo: function() {
      this.dialogVisible = true;
      this.operation = true;
      if (this.$refs["dataForm"] != undefined) {
        this.$refs["dataForm"].resetFields();
      }

      this.businesslicenseimgUploadList = [];
      this.managerphotoimgUploadList = [];
      this.paperworkphotoimgUploadList = [];
    },

    // 处理表格列过滤显示
    handleFilterColumns: function(data) {
      this.filterColumns = data.filterColumns;
      this.$refs.tableColumnFilterDialog.setDialogVisible(false);
    },

    // 处理表格列过滤显示
    displayFilterColumnsDialog: function() {
      this.$refs.tableColumnFilterDialog.setDialogVisible(true);
    },
    // 显示编辑界面
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.$nextTick(function() {
        this.dataForm = Object.assign({}, params.row);

        if (this.utils.isNull(this.dataForm.paperwork_photo)) {
          this.paperworkphotoimgUploadList = [];
        } else {
          var this_ = this;
          this.paperworkphotoimgUploadList = [];
          $.each(this.dataForm.paperwork_photo.split(","), function(key, val) {
            let param = {};
            if (this_.utils.isNull(val)) {
            } else {
              param.url = val;
              this_.paperworkphotoimgUploadList.push(param);
            }
          });
        }

        if (this.utils.isNull(this.dataForm.manager_photo)) {
          this.managerphotoimgUploadList = [];
        } else {
          var this_ = this;
          this.managerphotoimgUploadList = [];
          $.each(this.dataForm.manager_photo.split(","), function(key, val) {
            let param = {};
            if (this_.utils.isNull(val)) {
            } else {
              param.url = val;
              this_.managerphotoimgUploadList.push(param);
            }
          });
        }

        if (this.utils.isNull(this.dataForm.businesslicense)) {
          this.businesslicenseimgUploadList = [];
        } else {
          var this_ = this;
          this.businesslicenseimgUploadList = [];
          $.each(this.dataForm.businesslicense.split(","), function(key, val) {
            let param = {};
            if (this_.utils.isNull(val)) {
            } else {
              param.url = val;
              this_.businesslicenseimgUploadList.push(param);
            }
          });
        }
      });
    },

    // 编辑
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            params.t = "wcustomer";
            if (!this.utils.isNull(params.effective_time)) {
              params.effective_time = format(params.effective_time);
            }
            if (!this.utils.isNull(params.business_date)) {
              params.business_date = format(params.business_date);
            }
            if (!this.utils.isNull(params.manager_effectivetime)) {
              params.manager_effectivetime = format(
                params.manager_effectivetime
              );
            }
            if (!this.utils.isNull(params.business_date_start)) {
              params.business_date_start = format(params.business_date_start);
            }

            params.businesslicense = this.businesslicenseimgUploadList
              .map(item => item.url)
              .toString();
            params.manager_photo = this.managerphotoimgUploadList
              .map(item => item.url)
              .toString();
            params.paperwork_photo = this.paperworkphotoimgUploadList
              .map(item => item.url)
              .toString();

            this.utils.request.editCustomerInfo(params, this.editInfoBack);
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
    initColumns: function() {
      this.columns = [
        { prop: "customerno", label: "客户代码", minWidth: 120 },
        { prop: "client_name", label: "客户名称", minWidth: 120 },
        { prop: "socialcode", label: "统一社会信用代码", minWidth: 120 },
        {
          prop: "registered_capital",
          label: "注册资本（万元）",
          minWidth: 120
        },
        { prop: "legalname", label: "法人姓名", minWidth: 120 },
        {
          prop: "paperwork_type",
          label: "法人证件类型",
          minWidth: 120,
          formatter: this.showPaperType
        },
        { prop: "paperwork_no", label: "法人证件号", minWidth: 120 },
        { prop: "effectivedate", label: "法人证件有效期", minWidth: 120 },
        { prop: "manager_name", label: "经办人姓名", minWidth: 120 },
        {
          prop: "manager_papertype",
          label: "经办人证件类型",
          minWidth: 120,
          formatter: this.showManageType
        },
        { prop: "manager_paperwork", label: "经办人证件号", minWidth: 120 },
        { prop: "effectivedates", label: "经办人证件有效期", minWidth: 120 },
        {
          prop: "customer_type",
          label: "客户性质",
          minWidth: 120,
          formatter: this.showCustomerType
        },
        {
          prop: "trade_type",
          label: "行业类型",
          minWidth: 120,
          formatter: this.showTradeType
        },
        { prop: "manager_mobile", label: "经办人联系方式", minWidth: 120 },
        { prop: "manager_email", label: "经办人工作邮箱", minWidth: 120 },
        {
          prop: "isdeal",
          label: "是否签订了合同",
          minWidth: 120,
          formatter: this.showIsDeal
        },
        { prop: "warningday", label: "距保质期天数预警", minWidth: 120 },
        { prop: "remark", label: "备注", minWidth: 120 },
        {
          prop: "status",
          label: "状态",
          minWidth: 120,
          formatter: this.showStatusType
        },
        { prop: "business_date_start", label: "营业执照注册日期", minWidth: 120,formatter: this.showbusinessdatestart },
        { prop: "businessdate", label: "营业执照到期日期", minWidth: 120 }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    resetForm(formName) {
      this.filters = {
        t: "wcustomer",
        code: "",
        accounts: "",
        unified_social_credit_code: "",
        registered_capital: "",
        legal_name: "",
        storage_warehouse: "",
        legal_document_number: "",
        effective_time: "",
        operator_name: "",
        operator_document_number: "",
        effective_time: "",
        operator_document_type: "",
        customer_nature: "",
        industry_type: "",
        operator_phone: "",
        operator_email: "",
        is_contract: "",
        remark: "",
        id: "",
        business_date_start:""
      };
      this.$refs.CyTable.resetForm();
      this.findPage();
    },
    showPaperType(row, column, cellValue, index) {
      $.each(this.customer_type_options, function(key, value) {
        if (value.key == cellValue) {
          cellValue = value.val;
          return;
        }
      });

      return cellValue;
    },
    showManageType(row, column, cellValue, index) {
      $.each(this.customer_type_options, function(key, value) {
        if (value.key == row.manager_papertype) {
          cellValue = value.val;
          return;
        }
      });

      return cellValue;
    },
    showCustomerType(row, column, cellValue, index) {
      $.each(this.customer_type_options, function(key, value) {
        if (value.key == row.customer_type) {
          cellValue = value.val;
          return;
        }
      });

      return cellValue;
    },

    showStatusType(row, column, cellValue, index) {
      if (row.status == 0) {
        return "待审核";
      }
      if (row.status == 1) {
        return "审核中";
      }
      if (row.status == 2) {
        return "审核通过";
      }
    },

    showTradeType(row, column, cellValue, index) {
      $.each(this.trade_type_options, function(key, value) {
        if (value.key == row.trade_type) {
          cellValue = value.val;
          return;
        }
      });

      return cellValue;
    },
    showIsDeal(row, column, cellValue, index) {
      if (cellValue == 0) {
        return "是";
      }
      if (cellValue == 1) {
        return "否";
      }
    },
    
    showbusinessdatestart(row, column, cellValue, index) {
      if (this.utils.isNull(cellValue)) {
        return "";
      }
      return cellValue.substring(0,10)
    },
    

    downloadTemplete() {
      var a = document.createElement("a");
      a.href = "/static/excel/customerinformation.xlsx";
      a.download = "客户档案模板.xlsx";
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
    initSysConfig() {
      var params = {};
      params.t = "sysConfig";
      params.type = "customer_type";
      this.utils.request.queryUserList(params, res => {
        $.each(res.data, function(key, value) {
          value.key = Number(value.key);
        });
        this.customer_type_options = res.data;
      });

      params.type = "paperwork_type";
      this.utils.request.queryUserList(params, res => {
        $.each(res.data, function(key, value) {
          value.key = Number(value.key);
        });
        this.paperwork_type_options = res.data;
      });

      params.type = "trade_type";
      this.utils.request.queryUserList(params, res => {
        $.each(res.data, function(key, value) {
          value.key = Number(value.key);
        });
        this.trade_type_options = res.data;
      });
    }
  },
  mounted() {
    this.initColumns();
    this.initSysConfig();
  }
};
</script>

<style scoped>
/deep/ .form .el-input__inner {
  width: 200px !important;
}
</style>