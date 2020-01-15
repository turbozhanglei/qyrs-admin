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
      <el-form :inline="true" :model="filters" :size="size">
        <el-row style="text-align: left;">
          <el-form-item>
            <el-input v-model="filters.product_name" placeholder="产品名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
          </el-form-item>
          <!-- <el-form-item>
				<el-input v-model="filters.product_specifications" placeholder="产品规格"></el-input>
          </el-form-item>-->
          <!-- <el-form-item>
				<el-date-picker v-model="filters.production_time" placeholder="生产日期" style="width:200px" value-format="yyyy-MM-dd "></el-date-picker>
				</el-form-item>
				<el-form-item>
				<el-date-picker v-model="filters.expiration_time" placeholder="过期日期" style="width:200px" value-format="yyyy-MM-dd "></el-date-picker>
          </el-form-item>-->
          <el-form-item>
            <!-- <el-input v-model="filters.isexpired" placeholder="是否过期"></el-input> -->
            <el-select v-model="filters.isexpired" style="width:200px" placeholder="是否过期">
              <el-option label="是" value="1">是</el-option>
              <el-option label="否" value="0">否</el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
					<el-input v-model="filters.distance_day" placeholder="距保质期到期天数"></el-input>
          </el-form-item>-->
          <el-form-item>
            <el-input v-model="filters.out_order_client" placeholder="客户出库单号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.receive_warehouse_name" placeholder="收货仓库名称"></el-input>
          </el-form-item>
        </el-row>

        <el-row style="text-align: left;">
          <!-- <el-form-item>
					<el-date-picker v-model="filters.storage_time" placeholder="入库时间" style="width:200px" value-format="yyyy-MM-dd "></el-date-picker>
          </el-form-item>-->

          <!-- <el-form-item>
				<el-input v-model="filters.document_license" placeholder="单据证照"></el-input>
				
          </el-form-item>-->

          <el-form-item>
            <el-input v-model="filters.receive_receive_address" placeholder="收货仓库具体地址"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.receive_name" placeholder="收货方对接人"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.phone" placeholder="联系方式（手机）"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.refuse_reason" placeholder="拒收原因描述"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input v-model="filters.operator" placeholder="我司操作员"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="text-align: left;">
          <el-form-item>
            <el-input v-model="filters.out_order_mycompany" placeholder="我司入库单号"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- <el-input v-model="filters.isreceipt" placeholder="是否确认收货"></el-input> -->
            <el-select v-model="filters.isreceipt" style="width:200px" placeholder="是否过期">
              <el-option label="是" value="1">是</el-option>
              <el-option label="否" value="0">否</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.remark" placeholder="备注"></el-input>
          </el-form-item>
          <!-- </el-row>
          <el-row style="text-align: left;">-->

          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              type="primary"
              @click="findPage(filters)"
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
					<kt-button icon="fa fa-print" :label="$t('action.print')" type="primary" @click="print" />
          </el-form-item>-->
          <el-form-item>
            <kt-button
              icon="el-icon-refresh"
              :label="$t('action.reset')"
              type="primary"
              @click="reset"
            />
          </el-form-item>

          <el-form-item>
            <!-- <kt-button label="处理完成" type="primary"  /> -->
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
	  permsEditLable="查看"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      ref="CyTable"
      :showBatchDelete="false"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="85%"
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
            >WMS系统订单退货页面</div>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="我司入库单号" prop="out_order_mycompany">
            <!-- <el-input v-model="dataForm.out_order_mycompany" auto-complete="off"></el-input> -->
            <el-select
              style="width: 200px;"
              v-model="dataForm.out_order_mycompany"
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
                :label="item.order_no"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收货仓库名称" prop="receive_warehouse_name">
            <el-input v-model="dataForm.receive_warehouse_name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="收货仓库具体地址" prop="receive_receive_address">
            <el-input v-model="dataForm.receive_receive_address" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="收货方对接人" prop="receive_name">
            <el-input v-model="dataForm.receive_name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系方式（手机）" prop="phone">
            <el-input v-model="dataForm.phone" auto-complete="off"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="拒收原因描述" prop="refuse_reason">
            <el-input v-model="dataForm.refuse_reason" auto-complete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="客户名称" prop="client_name">
					<el-input v-model="dataForm.client_name" auto-complete="off"></el-input>
          </el-form-item>-->
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否确认收货" prop="isreceipt">
            <!-- <el-input v-model="dataForm.isreceipt" auto-complete="off"></el-input> -->
            <el-select v-model="dataForm.isreceipt" style="width:200px">
              <el-option label="是" value="1">是</el-option>
              <el-option label="否" value="0">否</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="单据证照">
            <!-- <el-input v-model="dataForm.document_license" auto-complete="off"></el-input> -->
            <div style="float: left;">
              <ul class="el-upload-list el-upload-list--picture-card">
                <li
                  v-for="(bill_photo,index) in bill_photo_list"
                  :key="index"
                  :tabindex="index"
                  class="el-upload-list__item is-success"
                >
                  <img :src="bill_photo" alt class="el-upload-list__item-thumbnail" />
                  <label class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-check"></i>
                  </label>
                  <i class="el-icon-close"></i>
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview">
                      <i class="el-icon-zoom-in" @click="handlePictureCardPreview(null,bill_photo)"></i>
                    </span>
                    <span class="el-upload-list__item-delete">
                      <i class="el-icon-delete" @click="handleRemove(null,null,index)"></i>
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            <el-upload
              :action="imgUpload"
              :on-success="handleAvatarSuccess"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              style="float:left"
              ref="upload"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
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
          <el-table-column label="产品名称" width="180" prop="name"></el-table-column>
          <el-table-column label="产品规格" width="180" prop="level"></el-table-column>
          <el-table-column label="数量" width="180" prop="num"></el-table-column>
          <el-table-column label="批次号" width="180" prop="number"></el-table-column> 
          <el-table-column label="生产日期" width="180" prop="roduction_date"></el-table-column>
          <el-table-column label="过期时间" width="180" prop="expiration_date"></el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
		  v-show="dataForm.id == null"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleImage">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>

    <!--打印界面-->
    <el-dialog
      :title="operation?'打印预览':'打印'"
      width="35%"
      :visible.sync="printPage"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-tag style="margin-left: 33%;">北京东晓腾飞供应链管理有限公司</el-tag>
        <div class="demo-image__placeholder">
          <div class="block">
            <el-image :src="src" style="margin-left: 33%;width: 200px;"></el-image>
          </div>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单号:">
              <span>0234612352365</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货物名称:">
              <span>大米</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供货单位:">
              <span>南京无极有限公司</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="校验时间:">
              <span>2019-11-05</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="校验员:">
              <span>李四</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="printPage = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.comfirm')}}</el-button>
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
      imgUpload: this.utils.getUpLoadHost(),
      size: "small",
      filters: {
        name: ""
      },
      imgs: "",
      fileList: {},
      columns: [],
      product: [],
      filterColumns: [],
      optionlist: [],
      options: [],
      tableData: [],
      bill_photo_list: [],
      sku_id: [],
      proData: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      dialogImageUrl: "",

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      printPage: false,
      dialogVisibleImage: false,
      dataFormRules: {
        product_name: [
          { required: true, message: "请输入产品名称", trigger: "blur" }
        ],
        product_specifications: [
          { required: true, message: "请输入产品规格", trigger: "blur" }
        ],
        client_name: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ],
        production_time: [
          { required: true, message: "请输入生产日期", trigger: "blur" }
        ],
        expiration_time: [
          { required: true, message: "请输入过期日期", trigger: "blur" }
        ],
        out_order_client: [
          { required: true, message: "请输入客户出库单号", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入联系方式（手机）", trigger: "blur" }
        ],
        out_order_mycompany: [
          { required: true, message: "请输入我司出库单号", trigger: "blur" }
        ],
        storage_time: [
          { required: true, message: "请输入入库时间", trigger: "blur" }
        ],
        refuse_reason: [
          { required: true, message: "请输入拒收原因", trigger: "blur" }
        ],
        document_license: [
          { required: true, message: "请上传单据证照", trigger: "blur" }
        ]
      },

      // 新增编辑界面数据
      dataForm: {
        id: "",
        status: "",
        userRoles: [],
        document_license: ""
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
    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "returnGoods";
      this.$refs.CyTable.findPage(this.filters);
    },
    //查询后台订单信息
    remoteMethod: function(query) {
      if (query !== "") {
        //查询后台客户信息
        var search = {};
        search.t = "order_buy";
        search.sql = "queryOrderIdForReturn";
        search.order_no = query;
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
        this_.dataForm.out_order_mycompany = "";
        this_.dataForm.receive_warehouse_name = "";
        this_.dataForm.receive_receive_address = "";
        this_.dataForm.receive_name = "";
        this_.dataForm.phone = "";
        this_.dataForm.remark = "";
        this_.tableData = "";
      } else {
        $.each(temp, function(key, val) {
          if (val.id == selVal) {
            this_.dataForm.out_order_mycompany = val.order_no;
            this_.dataForm.receive_warehouse_name = val.recipient_store; //收货仓库
            this_.dataForm.receive_receive_address =
              val.recipient_store_address; //收货具体仓库
            this_.dataForm.receive_name = val.recipient_people; //收货方对接人
            this_.dataForm.phone = val.recipient_people_mobile; //收货方联系方式
            this_.dataForm.remark = val.remark; //备注
            this_.dataForm.client_name = val.customer_id; //客户id

            this_.dataForm = Object.assign({}, this_.dataForm);
            return;
          }
        });
        var search = {};
        search.order_id = selVal;
        search.t = "order_buy";
        search.sql = "queryOrderListForReturn";
        this.utils.request.queryUserList(search, function(res) {
          if (res != null && res.code == "0000") {
            this_.tableData = res.data;
          } else {
            this.$message({ message: "暂无数据, ", type: "error" });
          }
        });
      }
    },
    handleSelectionChange(val) {
      this.product = JSON.stringify(val);
      this.sku_id = val.map(item => item.id).toString() + ",";
      this.products = val;
      this.multipleSelection = val;
    },
    //仓库名称初始化
    queryUserList: function(value) {
      var this_ = this;
      this.utils.request.queryUserList(value, function(data) {
        this_.optionlist = data.data;
      });
    },
    // 批量删除
    handleDelete: function(data) {
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }
      data.t = "returnGoods";
      data.ids = ids;
      this.utils.request.deleteReturnInfo(data, this.deleteInfoBack);
    },
    clearFiles() {
      this.$refs["upload"].clearFiles();
    },
    handleClose() {
      (this.dataForm.id = ""), (this.tableData = []);
      this.clearFiles();
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
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      //this.dataForm={}
      if (this.$refs["dataForm"] != undefined) {
        this.$refs["dataForm"].resetFields();
      }
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
    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let filename = "退货";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
    },
    //图片移除
    handleRemove(file, fileList) {
      this.fileList = fileList;
      if (fileList.length == 0) {
        this.dataForm.document_license = "";
      } else {
        this.imgs = fileList.map(item => item.response.data.imgUrl).toString();
        this.dataForm.document_license = this.imgs;
      }
      console.log(this.dataForm.document_license);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.ImageUrl = file.url;
      this.dialogVisibleImage = true;
    },
    //上传成功回调
    handleAvatarSuccess(res, file) {
      if (res.data.imgUrl == "") {
        this.$message({ message: "上传失败", type: "error" });
      } else {
        this.dataForm.document_license += res.data.imgUrl + ",";
        console.log(this.dataForm.document_license);
        this.imageUrl = URL.createObjectURL(file.raw);
      }
    },

    // 显示编辑界面
    handleEdit: function(params) {
      console.log(params);
      this.dialogVisible = true;
      this.operation = false;
      this.$nextTick(function() {
        this.dataForm = Object.assign({}, params.row);
      });
      var this_ = this;
      var search = {};
      search.id = params.row.id;
      search.t = "returnGoods";
      this.utils.request.queryReturnOrderBuySku(search, function(res) {
        if (res.code == "0000") {
          this_.tableData = res.data[0].proData;
          this_.bill_photo_list = this_.dataForm.document_license.split(",");
          this_.dataForm.document_license = "";
        } else {
          this_.$message({ message: "获取产品信息异常", type: "error" });
        }
      });
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            var this_ = this;
            if (this_.product.length != 0) {
            } else {
              this.$message({
                message: "请勾选择需要退货的产品",
                type: "error"
              });
              this.editLoading = false;
              return;
            }
            params.t = "returnGoods";
            params.sku_id = this.sku_id;
            if (params.is_expired_days >= 0) {
              params.isexpired = 1;
            } else {
              params.isexpired = 0;
            }
            var this_ = this;
            var documentlicense = params.document_license.split(",");
            //连接两个数组
            documentlicense = documentlicense.concat(this.bill_photo_list);

            //过滤多余的','
            params.document_license = documentlicense
              .filter(function(e) {
                if (this_.utils.isNull(e)) {
                } else {
                  return e;
                }
              })
              .join(",");
            this.utils.request.editUserReturnInfo(params, this.editInfoBack);
          });
        }
      });
    }, // 新增修改回调
    editInfoBack: function(data) {
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
      } else {
        this.$message({ message: "操作失败, ", type: "error" });
      }
      this.findPage();
      this.dialogVisible = false;
      this.operation = false;
      this.editLoading = false;
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
        { prop: "order_return", label: "退货单号", minWidth: 120 },
        { prop: "clientname", label: "客户名称", minWidth: 120 },
        { prop: "out_order_mycompany", label: "我司入库单号", minWidth: 120 },
        { prop: "productname", label: "产品名称", minWidth: 120 },
        { prop: "renum", label: "退货数量", minWidth: 120 },
        // {prop:"product_specifications", label:"产品规格", minWidth:120},
        // {prop:"production_time", label:"生产日期(产品批次)", minWidth:120},
        // {prop:"expiration_time", label:"过期日期", minWidth:120},
        {
          prop: "isexpired",
          label: "是否过期",
          minWidth: 120,
          formatter: this.expired
        },
        //{prop:"distance_day", label:"距保质期到期天数", minWidth:120},
        //{prop:"storage_time", label:"入库时间", minWidth:120},
        //{prop:"out_order_client", label:"客户出库单号", minWidth:120},
        //{prop:"document_license", label:"单据证照", minWidth:120},
        {
          prop: "receive_warehouse_name",
          label: "收货仓库名称",
          minWidth: 120
        },
        {
          prop: "receive_receive_address",
          label: "收货仓库具体地址",
          minWidth: 120
        },
        { prop: "receive_name", label: "收货方对接人", minWidth: 120 },
        { prop: "phone", label: "联系方式（手机）", minWidth: 120 },
        { prop: "operatorname", label: "我司操作员", minWidth: 120 },
        {
          prop: "isreceipt",
          label: "是否确认收货",
          minWidth: 120,
          formatter: this.isreturn
        },
        { prop: "remark", label: "备注", minWidth: 120 },
        { prop: "refuse_reason", label: "拒收原因描述", minWidth: 120 }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },
    isreturn: function(row, column, cellValue, index) {
      if (cellValue == 1) {
        return "是";
      } else {
        return "否";
      }
    },
    expired: function(row, column, cellValue, index) {
      if (cellValue == 1) {
        return "是";
      } else {
        return "否";
      }
    }
  },
  mounted() {
    this.findPage();
    this.initColumns();
    this.queryUserList({ t: "warehouse" });
  }
};
</script>

<style scoped>
/deep/ .el-input__inner {
      width: 200px;
}
/deep/ .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px;
}
</style>