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
      <el-form :inline="true" :model="filters" :size="size" class="form-input">
        <el-form-item>
          <el-input v-model="filters.order_no" placeholder="出库单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.customer_no" placeholder="客户出库单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.recipient_store" placeholder="收货仓库"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.recipient_store_address" placeholder="收货仓库地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.recipient_people" placeholder="收货人"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.recipient_people_mobile" placeholder="收货人联系方式"></el-input>
        </el-form-item>
        <!-- <el-form-item>
					<el-input v-model="filters.out_Date" placeholder="预入库时间"></el-input>
        </el-form-item>-->
        <el-form-item>
          <el-date-picker
            v-model="filters.storage_time_start"
            type="datetime"
            placeholder="最早预入库时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.storage_time_end"
            type="datetime"
            placeholder="最晚预入库时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.customer_make" placeholder="客户方制单人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.create_time_start"
            type="datetime"
            placeholder="最早制单时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.create_time_end"
            type="datetime"
            placeholder="最晚制单时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="filters.out_stock_start"
            type="datetime"
            placeholder="最早出库日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.out_stock_end"
            type="datetime"
            placeholder="最晚出库日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.creator_name" placeholder="操作人"></el-input>
        </el-form-item>

        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="$t('action.search')"
            type="primary"
            @click="$refs.CyTable.findPageBeforeRestPages(filters)"
          />
          <kt-button icon="fa fa-plus" :label="$t('action.add')" type="primary" @click="handleAdd" />
          <!-- <kt-button label="出库下单" type="primary"  @click="out" /> -->
          <kt-button
            icon="el-icon-refresh"
            :label="$t('action.reset')"
            type="primary"
            @click="resetSelection"
          />
        </el-form-item>
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
      :showBatchDelete="false"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog width="85%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
        inline
        class="form-edit-input"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="客户名称" prop="customer_id">
          <el-select
            v-model="dataForm.customer_id"
            placeholder="请选择"
            @change="queryByCustomer"
            filterable
            clearable
            :disabled="init_customer"
          >
            <el-option
              v-for="item in customers"
              :key="item.id"
              :label="item.client_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户出库单号" prop="customer_no">
          <el-input v-model="dataForm.customer_no" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="单据号" prop="order_licence">
          <el-input v-model="dataForm.order_licence" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="预入库时间" prop="storage_time">
          <!-- <el-input v-model="dataForm.storage_time"  auto-complete="off" type="datetime"></el-input> -->
          <el-date-picker
            v-model="dataForm.storage_time"
            type="date"
            placeholder="选择日期"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="联系方式（手机）" prop="recipient_people_mobile">
          <el-input v-model="dataForm.recipient_people_mobile" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="客户方制单人" prop="customer_make">
          <el-input v-model="dataForm.customer_make" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="收货仓库名称" prop="recipient_store">
          <el-input v-model="dataForm.recipient_store" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货仓库具体地址" prop="recipient_store_address">
          <el-input v-model="dataForm.recipient_store_address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货方对接人" prop="recipient_people">
          <el-input v-model="dataForm.recipient_people" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="出库时间" prop="out_stock">
          <el-date-picker
            v-model="dataForm.out_stock"
            type="date"
            placeholder="选择日期"
            style="width:86%"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="单据附件">
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

        <el-form-item label="单据证照" prop="order_photo">
          <img-upload
            ref="ImgUpload"
            :filelist="imgUploadList"
            @handleImgUploadRemove="handleImgUploadRemove"
            @handleImgUploadChange="handleImgUploadChange"
            @handlePictureCardPreview="handlePictureCardPreview"
            uploadButton="order_photo"
          ></img-upload>
        </el-form-item>
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
          <el-table-column label="产品名称" width="175px" prop="name"></el-table-column>
          <el-table-column label="产品规格" width="175px" prop="level"></el-table-column>
          <el-table-column label="出库数量" width="175px">
            <template slot-scope="scope">
              <input
                type="text"
                class="el-input__inner"
                style="width: 150px;"
                v-model="stock_num['stock_'+scope.row.id]"
                placeholder="请输入出库数量"
                @change="getStockNum(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="生产日期" width="175px" prop="roduction_date"></el-table-column>
          <el-table-column label="库存数量" width="175px" prop="stock"></el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button
          :size="size"
          @click="resetTable"
          @click.native="dialogVisible = false"
        >{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>

    <!--产品编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="80%"
      :visible.sync="productmodal"
      :close-on-click-modal="false"
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
            >WMS系统货品页面</div>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="产品名称" prop="product_name">
            <el-input v-model="dataForm.product_name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="产品规格" prop="product_specifications">
            <el-input v-model="dataForm.product_specifications" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="出库数量" prop="out_num">
            <el-input v-model="dataForm.out_num" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="出库产品总重量" prop="out_weight">
            <el-input v-model="dataForm.out_weight" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否过期" prop="isexpired">
            <el-input v-model="dataForm.isexpired" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="距保质期到期天数" prop="distance_day">
            <el-input v-model="dataForm.distance_day" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="生产日期" prop="production_Date" style="width:310px">
            <!-- <el-input v-model="dataForm.production_Date"  auto-complete="off"></el-input> -->
            <el-date-picker
              v-model="dataForm.production_Date"
              type="date"
              placeholder="选择日期"
              style="width:86%"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="过期日期" prop="expiration_date">
            <el-date-picker
              v-model="dataForm.expiration_date"
              type="date"
              placeholder="选择日期"
              style="width:86%"
            ></el-date-picker>
            <!-- <el-input v-model="dataForm.expiration_date"  auto-complete="off"></el-input> -->
          </el-form-item>
          <el-divider></el-divider>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click.native="productmodal = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>

    <!--图片预览-->
    <el-dialog :visible.sync="showPictureDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
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
      zipfileList: [],
      zipUpload: this.utils.getUpLoadHost(),
      showPictureDialogVisible: false,
      imgUploadList: [],
      imageUrl: "",
      size: "small",
      dialogImageUrl: "",
      loading: false,
      dialogVisibleImage: false,
      filters: {
        t: "norderSale",
        order_no: "",
        client_name: "",
        customer_no: "",
        recipient_store: "",
        recipient_store_address: "",
        recipient_people: "",
        recipient_people_mobile: "",
        storage_time_start: "",
        storage_time_end: "",
        customer_make: "",
        create_time_start: "",
        create_time_end: "",
        out_stock_start: "",
        out_stock_end: "",
        order_status: "",
        creator_name: ""
      },
      columns: [],
      customers: [],
      filterColumns: [],
      stock_num: {},
      orderStatus: [],
      out_stock_num: 0,
      driver_list: {},
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      tableData: [],
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      printPage: false,
      productmodal: false,
      dataFormRules: {
        customer_id: [
          { required: true, message: "请选择客户名称", trigger: "blur" }
        ],
        customer_no: [
          { required: true, message: "请输入客户出库单号", trigger: "blur" }
        ],
        order_licence: [
          { required: true, message: "请输入单据号", trigger: "blur" }
        ],
        recipient_store: [
          { required: true, message: "请输入收货仓库名称", trigger: "blur" }
        ],
        recipient_store_address: [
          { required: true, message: "请输入收货仓库具体地址", trigger: "blur" }
        ],
        recipient_people: [
          { required: true, message: "请输入收货方对接人", trigger: "blur" }
        ],
        recipient_people_mobile: [
          { required: true, message: "请输入联系方式（手机）", trigger: "blur" }
        ],
        storage_time: [
          { required: true, message: "请输入预入库时间", trigger: "blur" }
        ],
        customer_make: [
          { required: true, message: "请输入客户方制单人", trigger: "blur" }
        ],
        out_stock: [
          { required: true, message: "请输入出库时间", trigger: "blur" }
        ]
      },

      // 新增编辑界面数据
      dataForm: {},
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
      init_customer: false
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
      this.dialogImageUrl = url;
      this.showPictureDialogVisible = true;
    },

    handleImgUploadRemove(data) {
      var index = data.index;
      this.imgUploadList.splice(index, 1);
    },
    handleImgUploadChange(data) {
      this.imgUploadList = data.filelist;
    },

    findPage: function(data) {
      let customer_id = localStorage.getItem("customer_id");
      if (!this.utils.isNull(customer_id)) {
        this.filters.customer_id = customer_id;
        this.init_customer = true;
      }
      this.$refs.CyTable.findPage(this.filters);
    },

    showPhto(row, column, cellValue, index) {
      if (cellValue != null && "" != cellValue) {
        var photosrc = [];
        photosrc = cellValue.split(",");
        return '<img src ="' + photosrc[0] + '"/>';
      }
    },

    getStockNum: function(row) {
      let stock_id = "stock_" + row.id;
      if (this.stock_num[stock_id] > row.stock) {
        this.stock_num[stock_id] = "";
        this.$message({ message: "出库数量不能大于库存数量", type: "error" });
        return;
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
          let filename = "出库下单";
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
      let deleteInfo = {};
      var this_ = this;
      deleteInfo.id = data.params[0].id;
      this.utils.request.deleteOutOrderInfo(deleteInfo, function(data) {
        if (data.code == "0000") {
          this_.$message({ message: "操作成功", type: "success" });
          this_.findPage();
        } else {
          this_.$message({ message: "操作失败, " + data.msg, type: "error" });
        }
      });
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {};
      this.stock_num = {};
      var this_ = this;
      this.dialogVisible = true;
      this.operation = true;

      this.imgUploadList = [];
      this.zipfileList = [];

      let customer_id = localStorage.getItem("customer_id");
      if (!this.utils.isNull(customer_id)) {
        this.dataForm.customer_id = Number(customer_id);
        this.queryByCustomer(customer_id);
      }

      //加载客户
      this.utils.request.queryUserList(
        { t: "wcustomer", customer_id: customer_id },
        function(data) {
          this_.customers = data.data;
        }
      );
      //加载司机
      this.utils.request.queryUserList({ t: "wdriver" }, function(data) {
        this_.drivers = data.data;
      });
    },
    // 编辑
    submitForm: function() {
      var this_ = this;
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认选择吗？", "提示", {}).then(() => {
            this_.dataForm.stock_num = JSON.stringify(this_.stock_num);
            this_.dataForm.products = JSON.stringify(this_.products);
            if (this_.dataForm.stock_num == "{}") {
              this_.$message({ message: "出库数量不能为空", type: "warning" });
              return false;
            }

            this_.dataForm.order_photo = this.imgUploadList
              .map(item => item.url)
              .toString();
            this_.dataForm.bill_zip = this.zipfileList
              .map(item => item.url)
              .toString();

            this_.utils.request.saveSaleOutOrder(
              this_.dataForm,
              this.saveCallBack
            );
          });
        }
      });
    },

    saveCallBack: function(datas) {
      if (datas.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
        this.dialogVisible = false;
        this.findPage(null);
      } else {
        this.$message({ message: "操作失败, " + data.msg, type: "error" });
      }
    },

    handleSelectionChange(val) {
      this.products = val;
      this.multipleSelection = val;
    },
    // 打印
    print: function() {
      this.printPage = true;
      this.operation = true;
    },

    //根据客户查询库存信息
    queryByCustomer(val) {
      let query = {};
      query.customer_id = val;
      query.t = "norderStoreSku";
      query.sql = "querySettingSkus";
      let this_ = this;
      this.utils.request.queryUserList(query, function(data) {
        if (null != data.data) {
          this_.tableData = data.data;
        }
      });
    },
    // 新增商品信息
    productAdd: function() {
      this.productmodal = true;
      this.operation = true;
    },
    // 显示编辑界面
    out: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
      // let userRoles = [];
      // for (let i = 0, len = params.row.userRoles.length; i < len; i++) {
      //   userRoles.push(params.row.userRoles[i].roleId);
      // }
      // this.dataForm.userRoles = userRoles;
    },

    // 显示编辑界面
    handleEdit: function(params) {
      var this_ = this;
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);

      if (this_.utils.isNull(this_.dataForm.order_photo)) {
        this_.imgUploadList = [];
      } else {
        this_.imgUploadList = [];
        $.each(this.dataForm.order_photo.split(","), function(key, val) {
          let param = {};
          if (this_.utils.isNull(val)) {
          } else {
            param.url = val;
            this_.imgUploadList.push(param);
          }
        });
      }

      if (this_.utils.isNull(this_.dataForm.bill_zip)) {
        this_.zipfileList = [];
      } else {
        this_.zipfileList = [];
        $.each(this.dataForm.bill_zip.split(","), function(key, val) {
          let param = {};
          if (this_.utils.isNull(val)) {
          } else {
            param.url = val;
            var array = val.split("/");
            param.name = array[array.length - 1];
            this_.zipfileList.push(param);
          }
        });
      }
      //加载客户
      this.utils.request.queryUserList({ t: "wcustomer" }, function(data) {
        this_.customers = data.data;
        console.log(this_.customers);
      });
      this.utils.request.queryUserList(
        {
          t: "norderStoreSku",
          sql: "querySettingSkus",
          sale_id: params.row.id,
          customer_id: params.row.customer_id
        },
        function(data) {
          if (null != data.data) {
            this_.tableData = data.data;
            this_.$nextTick(() => {
              for (var i = 0; i < this_.tableData.length; i++) {
                this_.stock_num["stock_" + this_.tableData[i].id] =
                  this_.tableData[i].export_stock_num;
                this_.$set(
                  this_.stock_num,
                  "stock_" + this_.tableData[i].id,
                  this_.tableData[i].export_stock_num
                );
                if (this_.tableData[i].export_stock_num > 0) {
                  this_.$refs.multipleTable.toggleRowSelection(
                    this_.tableData[i],
                    true
                  );
                }
              }
            });
          }
        }
      );
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
        { prop: "order_no", label: "出库单号", minWidth: 120 },
        { prop: "client_name", label: "客户名称", minWidth: 150 },
        { prop: "customer_no", label: "客户出库单号", minWidth: 150 },
        { prop: "order_licence", label: "单据号", minWidth: 150 },

        { prop: "recipient_store", label: "收货仓库", minWidth: 150 },
        {
          prop: "recipient_store_address",
          label: "收货仓库地址",
          minWidth: 150
        },
        { prop: "recipient_people", label: "收货人", minWidth: 120 },
        { prop: "recipient_people_mobile", label: "联系方式", minWidth: 120 },
        { prop: "storage_time", label: "预入库时间", minWidth: 120 },
        { prop: "customer_make", label: "客户方制单人", minWidth: 150 },
        { prop: "create_time", label: "制单时间", minWidth: 120 },
        { prop: "out_stock", label: "出库日期", minWidth: 120 },
        { prop: "order_status", label: "状态", minWidth: 120 },
        { prop: "creator_name", label: "操作人", minWidth: 120 },
        { prop: "remark", label: "备注", minWidth: 120 }
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));

      this.columnsPro = [
        { prop: "id", label: "ID", minWidth: 50 },
        { prop: "product_name", label: "收货仓库", minWidth: 120 },
        { prop: "product_specifications", label: "仓库地址", minWidth: 150 },
        { prop: "phone", label: "收货对接人", minWidth: 120 },
        { prop: "production_Date", label: "联系方式", minWidth: 120 },
        { prop: "expiration_date", label: "录单人", minWidth: 120 },
        { prop: "expiration_date", label: "录单时间", minWidth: 120 },
        { prop: "expiration_date", label: "出库时间", minWidth: 120 },
        { prop: "out_num", label: "备注", minWidth: 120 }
      ];
      this.filterColumnsPro = JSON.parse(JSON.stringify(this.columnsPro));
    },
    resetSelection() {
      (this.filters = {
        t: "norderSale",
        order_no: "",
        client_name: "",
        customer_no: "",
        recipient_store: "",
        recipient_store_address: "",
        recipient_people: "",
        recipient_people_mobile: "",
        storage_time_start: "",
        storage_time_end: "",
        customer_make: "",
        create_time_start: "",
        create_time_end: "",
        out_stock_start: "",
        out_stock_end: "",
        order_status: "",
        creator_name: ""
      }),
        this.$refs.CyTable.resetForm();
      this.findPage(this.filters);
    },
    resetTable() {
      this.tableData = [];
    }
  },
  mounted() {
    this.initColumns();
  }
};
</script>

<style scoped>
/deep/ .form-input .el-input__inner {
  width: 200px;
}
/deep/ .form-edit-input .el-input__inner {
  width: 200px;
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