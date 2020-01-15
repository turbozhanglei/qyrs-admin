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
        <el-row style="text-align: left;">
          <el-form-item>
            <el-input v-model="filters.order_no" placeholder="出库单号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.name" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.customer_no" placeholder="客户出库单号"></el-input>
          </el-form-item>
          <!-- <el-form-item>
            <el-input v-model="filters.order_licence" placeholder="单据证照"></el-input>
          </el-form-item>-->
          <el-form-item>
            <el-input v-model="filters.recipient_store" placeholder="收货仓库"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.recipient_store_address" placeholder="收货仓库地址"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.drivername" placeholder="司机姓名"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input v-model="filters.driver_number" placeholder="车牌号码"></el-input>
          </el-form-item>

          <el-form-item>
            <el-date-picker
              v-model="filters.startdate"
              type="datetime"
              placeholder="出库日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:86%"
            ></el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-date-picker
              v-model="filters.enddate"
              type="datetime"
              placeholder="出库日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:86%;"
            ></el-date-picker>
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
              icon="el-icon-refresh"
              :label="$t('action.reset')"
              type="primary"
              @click="resetForm('filters')"
            />
          </el-form-item>

          <el-form-item>
            <kt-button icon="fa fa-plus" label="出库" type="primary" @click="outSku" />
          </el-form-item>
          <el-form-item>
            <kt-button
              :label="$t('action.reset')"
              perms="
					basics:warehouseinformation:reset"
              type="primary"
            />
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
      <el-form :inline="true" :size="size" label-width="120px">
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
      :showOperation="false"
      @selectionChange="selectionChange"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      ref="CyTable"
    ></cy-table>

    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="85%"
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
            >WMS系统订单出库页面</div>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="存放货位" prop="cargo_id">
            <el-select v-model="dataForm.cargo_id" placeholder="请选择">
              <el-option
                v-for="item in settings"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户名称" prop="customer_id">
            <el-select v-model="dataForm.customer_id" placeholder="请选择">
              <el-option
                v-for="item in customers"
                :key="item.id"
                :label="item.legalname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户出库单号" prop="customer_no">
            <el-input v-model="dataForm.customer_no" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="单据证照" prop="order_licence">
            <el-input v-model="dataForm.order_licence" auto-complete="off"></el-input>
          </el-form-item>

          <el-divider></el-divider>
        </el-row>
        <el-row>
          <el-form-item label="收货仓库名称" prop="recipient_store">
            <el-input v-model="dataForm.recipient_store" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="收货仓库具体地址" prop="recipient_store_address">
            <el-input v-model="dataForm.recipient_store_address" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="收货方对接人" prop="recipient_people">
            <el-input v-model="dataForm.recipient_people" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系方式（手机）" prop="recipient_people_mobile">
            <el-input v-model="dataForm.recipient_people_mobile" auto-complete="off"></el-input>
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
          <el-divider></el-divider>
        </el-row>
        <!-- <el-row>
				<el-form-item label="承运车辆" prop="driver_id">
					<el-select v-model="dataForm.driver_id" @change="getDriverInfo" placeholder="请选择">
						<el-option
						v-for="item in drivers"
						:key="item.id"
						:label="item.driver_number"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="承运车型" prop="driver_car_type">
					<el-input v-model="dataForm.driver_type" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="承运司机姓名" prop="driver_name">
					<el-input v-model="dataForm.drivername" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="承运司机联系方式" prop="driver_phone">
					<el-input v-model="dataForm.mobile" auto-complete="off"></el-input>
				</el-form-item>
        </el-row>-->
        <el-row>
          <el-form-item label="客户方制单人" prop="client_maker">
            <el-input v-model="dataForm.client_maker" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="出库时间" prop="out_stock">
            <!-- <el-input v-model="dataForm.out_Date"  auto-complete="off"></el-input> -->
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
            <div class="grid-content bg-purple" style="margin-top: -70px;text-align:center">绑定司机</div>
          </el-col>
        </el-row>
        <el-row>
          <!--表格内容栏-->
          <!-- <el-table :data="pageDriverResult" style="width: 100%" @current-change="handleSelectionChange" tooltip-effect="dark" ref="multipleTable">
            <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="司机姓名" width="180" prop="drivername"></el-table-column>
          <el-table-column label="联系方式" width="180" prop="mobile"></el-table-column>
          <el-table-column label="车辆类型" width="180" prop="type_val"></el-table-column>
          <el-table-column label="车牌号" width="180" prop="driver_number"></el-table-column>
        </el-table>
          -->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click.native="productmodal = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="driverSubmitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
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
import KtTable from "@/views/Core/KtTable";
import KtButton from "@/views/Core/KtButton";
import CyTable from "@/views/Core/CyTable";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format } from "@/utils/datetime";
export default {
  components: {
    PopupTreeInput,
    KtTable,
    KtButton,
    CyTable,
    TableColumnFilterDialog
  },
  data() {
    return {
      tableData1: [{}, {}],
      tableData: [],
      size: "small",
      filters: {
        status: "",
        order_no: "",
        name: "",
        customer_no: "",
        order_licence: "",
        recipient_store: "",
        recipient_store_address: "",
        out_stock_num: "",
        startdate: "",
        enddate: "",
        t: "outSku"
      },
      check_id: "",
      driver_list: {},
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      pageDriverResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      printPage: false,
      productmodal: false,
      dataFormRules: {
        name: [{ required: true, message: "请输入仓库名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入仓库编码", trigger: "blur" }],
        property: [{ required: true, message: "请仓库属性", trigger: "blur" }]
      },
      // 新增编辑界面数据
      dataForm: {},
      selections: [],
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
        "https://ss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=829888290,2650878176&fm=74&app=80&f=JPG&size=f121,121?sec=1880279984&t=274501980523d63a7d93c94f85aabbab",
      settings: [],
      customers: [],
      drivers: [],
      stock_num: {},
      products: []
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.$refs.CyTable.findPage(this.filters);
    },
    // 加载用户角色信息
    findUserRoles: function() {
      this.$api.role.findAll().then(res => {
        // 加载角色集合
        this.roles = res.data;
      });
    },
    // 批量删除
    handleDelete: function(data) {
      this.$api.user
        .batchDelete(data.params)
        .then(data != null ? data.callback : "");
    },

    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            "发货管理"
          );
        })
        .catch(() => {});
    },
    // 显示新增界面
    handleAdd: function() {
      var this_ = this;
      this.dialogVisible = true;
      this.operation = true;
      //加载货位
      this.utils.request.queryUserList({ t: "warehouseSiteSetting" }, function(
        data
      ) {
        this_.settings = data.data;
      });
      //加载客户
      this.utils.request.queryUserList({ t: "wcustomer" }, function(data) {
        this_.customers = data.data;
      });
      //加载司机
      this.utils.request.queryUserList({ t: "wdriver" }, function(data) {
        this_.drivers = data.data;
      });
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
    // 打印
    print: function() {
      this.printPage = true;
      this.operation = true;
    },
    // 新增商品信息
    productAdd: function(data) {
      this.check_id = data.id;
      this.productmodal = true;
      this.operation = true;
    },

    // 显示编辑界面
    handleEdit: function(params) {
      console.log(params);
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
      let userRoles = [];
      for (let i = 0, len = params.row.userRoles.length; i < len; i++) {
        userRoles.push(params.row.userRoles[i].roleId);
      }
      this.dataForm.userRoles = userRoles;
    },
    // 编辑
    submitForm: function() {
      var this_ = this;
      this.$confirm("确认选择吗？", "提示", {}).then(() => {
        this.editLoading = true;
        this.editLoading = false;
        this_.dataForm.driver_list = JSON.stringify(this_.driver_list);
        this_.dataForm.stock_num = JSON.stringify(this_.stock_num);
        this_.dataForm.products = JSON.stringify(this_.products);
        if (null == this_.driver_list) {
          this_.$message({ message: "司机不能为空", type: "warning" });
          return false;
        }
        if (null == this_.stock_num || this_.stock_num.length <= 0) {
          this_.$message({ message: "出库数量不能为空", type: "warning" });
          return false;
        }
        this_.utils.request.saveSaleOrder(this_.dataForm, function(datas) {});
        this.$message({ message: "操作成功", type: "success" });
        this.dialogVisible = false;
      });
    },
    // 编辑
    driverSubmitForm: function() {
      var this_ = this;
      this.$confirm("确认选择吗？", "提示", {}).then(() => {
        console.log(this_.driver_list);
        this.editLoading = true;
        this.editLoading = false;
        this.$message({ message: "操作成功", type: "success" });
        this.productmodal = false;
        this.operation = false;
      });
    },

    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    },

    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: "order_no", label: "出库单号", minWidth: 120 },
        { prop: "client_name", label: "客户名称", minWidth: 120 },
        { prop: "name", label: "商品名称", minWidth: 150 },
        { prop: "level", label: "商品规格", minWidth: 150 },
        { prop: "out_stock_num", label: "出库数量(件)", minWidth: 150 },
        {
          prop: "unit_volume",
          label: "总体积(m³)",
          minWidth: 120,
          formatter: this.formatterUnitvolume
        },
        {
          prop: "unit_weight",
          label: "总重量(kg)",
          minWidth: 120,
          formatter: this.formatterUnitWeight
        },
        { prop: "tray_number", label: "托盘", minWidth: 150 },
        { prop: "warehouse_number", label: "货位", minWidth: 150 },
        { prop: "customer_no", label: "客户出库单号", minWidth: 150 },

        { prop: "drivername", label: "司机姓名", minWidth: 150 },
        { prop: "driver_number", label: "车牌号码", minWidth: 150 },
        // { prop: "order_licence", label: "单据证照", minWidth: 150 },
        { prop: "recipient_store", label: "收货仓库", minWidth: 150 },
        {
          prop: "recipient_store_address",
          label: "收货仓库地址",
          minWidth: 120
        },
        { prop: "out_stock", label: "出库日期", minWidth: 120 },
        { prop: "statusval", label: "状态", minWidth: 120 }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;

      this.columnsPro = [
        { prop: "id", label: "ID", minWidth: 50 },
        { prop: "drivername", label: "司机姓名", minWidth: 120 },
        { prop: "mobile", label: "联系方式", minWidth: 120 },
        { prop: "type_val", label: "车辆类型", minWidth: 120 },
        { prop: "driver_number", label: "车牌号", minWidth: 120 }
      ];
      this.filterColumnsPro = JSON.parse(JSON.stringify(this.columnsPro));
    },

    selectionChange: function(data) {
      this.selections = data.selections;
    },

    resetForm(formName) {
      (this.filters = {
        t: "outSku",
        status: "",
        order_no: "",
        name: "",
        customer_no: "",
        order_licence: "",
        recipient_store: "",
        recipient_store_address: "",
        out_stock_num: "",
        startdate: "",
        enddate: "",
        id: ""
      }),
        this.findPage();
    },
    formatterUnitWeight(row, column, cellValue, index) {
      return this.mathUtils.accMul(cellValue, row.out_stock_num);
    },
    formatterUnitvolume(row, column, cellValue, index) {
      return this.mathUtils.accMul(cellValue, row.out_stock_num);
    },
    //出库
    outSku: function() {
      debugger;

      if (this.selections.length == 0) {
        this.$message({ message: "请至少选择一条数据", type: "error" });
        return;
      } else {
        var data = {};
        var ids = "";
        $.each(this.selections, function(key, value) {
          ids = ids + "," + value.id;
        });

        data.ids = ids;

        var this_ = this;
        this.utils.request.upSkuStatus(data, function(res) {
          if (res.code == "0000") {
            this_.$message({ message: "出库完成", type: "success" });
            this_.checkpage = false;
            this_.findPage();
          } else {
            this_.$message({ message: res.msg, type: "error" });
          }
        });
      }

      this.checkpage = true;
    }
  },
  mounted() {
    this.initColumns();
  }
};
var testdata = {};
</script>

<style scoped>
/deep/ .form .el-input__inner   {
  width: 200px !important;
}

/deep/.form .el-input__inner {
  width: 200px !important;
}
</style>