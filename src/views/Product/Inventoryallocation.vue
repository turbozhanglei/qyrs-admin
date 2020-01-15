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
        <el-row style="text-align: left;">
          <el-form-item>
            <el-input v-model="filters.product_name" placeholder="产品名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.product_specifications" placeholder="产品规格"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.phone" placeholder="收货人联系方式（手机）"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.receive_receive_address" placeholder="收货仓库具体地址"></el-input>
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
            <kt-button
              :label="$t('action.reset')"
              type="primary"
              @click="resetForm"
              icon="el-icon-refresh"
            />
            <kt-button label="分配" type="primary" @click="distribution()" />
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
      :showOperation="false"
      @findPage="findPage"
      ref="CyTable"
      @selectionChange="selectionChange"
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
        class="form-edit-input"
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

        <el-form-item label="客户名称" prop="client_name">
          <el-input v-model="dataForm.client_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="客户出库单号" prop="out_order_client">
          <el-input v-model="dataForm.customer_no" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="我司出库单号" prop="out_order_mycompany">
						<el-input v-model="dataForm.out_order_mycompany" auto-complete="off"></el-input>
        </el-form-item>-->
        <el-form-item label="单据证照" prop="e">
          <el-input v-model="dataForm.order_licence" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货仓库名称" prop="receive_warehouse_name">
          <el-input v-model="dataForm.recipient_store" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货仓库具体地址" prop="receive_receive_address">
          <el-input v-model="dataForm.recipient_store_address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货方对接人" prop="receive_name">
          <el-input v-model="dataForm.recipient_people" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式（手机）" prop="phone">
          <el-input v-model="dataForm.recipient_people_mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="入库时间" prop="storage_time">
          <!-- <el-input v-model="dataForm.storage_time"  auto-complete="off" type="datetime"></el-input> -->
          <el-date-picker
            v-model="dataForm.storage_time"
            type="date"
            placeholder="选择日期"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="客户方制单人" prop="client_maker">
          <el-input v-model="dataForm.customer_make" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="我司操作员" prop="username">
          <el-input v-model="dataForm.username" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="制单时间" prop="create_time">
          <el-date-picker
            v-model="dataForm.create_time"
            type="date"
            placeholder="选择日期"
            style="width:86%"
          ></el-date-picker>
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
      </el-form>

      <el-divider content-position="center">预出库 {{export_stock_num}}~已分配 {{out_stock_num}}</el-divider>

      <el-table
        :data="tableProData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        tooltip-effect="dark"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="产品名称" width="180" prop="productname"></el-table-column>
        <el-table-column label="库存批次号" width="180" prop="in_batch_number"></el-table-column>
        <el-table-column label="货位" width="180" prop="wnumber"></el-table-column>
        <el-table-column label="托盘名称" width="180" prop="tname"></el-table-column>
        <el-table-column label="生产日期" width="180" prop="roduction_date"></el-table-column>
        <el-table-column label="过期时间" width="180" prop="expiration_date"></el-table-column>
        <el-table-column prop="stocktotal" label="库存数量"></el-table-column>
        <el-table-column label="出库数量" width="180">
          <template slot-scope="scope">
            <input
              type="number"
              class="el-input__inner"
              style="width: 150px;"
              v-model="scope.row.out_stock_num"
              placeholder="请输入出库数量"
              @change="getStockNum(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="司机信息" width="180">
          <template slot-scope="scope">
            <div v-for="item in driver_list['keys_'+scope.row.id]" :key="item.id">
              <el-popover trigger="hover" placement="top">
                <p>联系方式: {{ item.mobile }}</p>
                <p>车辆类型: {{ item.type_val }}</p>
                <p>车牌号: {{ item.driver_number }}</p>
                <div slot="reference" class="name-wrapper" style="margin:10px;float:left">
                  <el-tag size="medium">{{ item.drivername }}</el-tag>
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="250" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="productAdd(scope.row)">绑定司机</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          v-if="show"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <!--绑定司机界面-->
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
          <kt-table
            :height="350"
            :data="pageDriverResult"
            :columns="filterColumnsPro"
            @selectionChange="driverSelectionChange"
            @findPage="getDriverPage"
            :showOperation="false"
          ></kt-table>
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
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import CyTable from "@/views/Core/CyTable";
import KtButton from "@/views/Core/KtButton";
import KtTable from "@/views/Core/KtTable";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format } from "@/utils/datetime";

export default {
  components: {
    PopupTreeInput,
    CyTable,
    KtTable,
    KtButton,
    TableColumnFilterDialog,

  },
  data() {
    return {
      size: "small",
      filters: {
        product_name: "",
        level: "",
        client_name: "",
        phone: "",
        product_name: "",
        receive_receive_address: "",
        status: 0
      },
      columns: [],
      columnsPro: [],
      filterColumns: [],
      checked: [],
      checkedPro: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      filterColumnsPro: [],
      tableProData: [],
      stock_num: [],
      driver_list: {},
      out_stock_num_ing: "",
      products: [],
      export_stock_num: 0,
      out_stock_num: 0,
      check_id: "",
      pageDriverResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      printPage: false,
      show: true,
      productmodal: false,
      dataFormRules: {
        name: [{ required: true, message: "请输入仓库名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入仓库编码", trigger: "blur" }],
        property: [{ required: true, message: "请仓库属性", trigger: "blur" }]
      },

      // 新增编辑界面数据
      dataForm: {
        client_name: "",
        customer_no: "",
        order_licence: "",
        recipient_store: "",
        receive_receive_address: "",
        receive_name: "",
        recipient_people_mobile: "",
        client_maker: "",
        remark: "",
        out_order_mycompany: "",
        storage_time: "",
        operator: "",
        out_Date: "",
        create_Date: "",
        customer_make: ""
      },
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "orderSaleExportSku";
      this.$refs.CyTable.findPage(this.filters);
    },
    //选择框
    selectionChange: function(params) {
      this.checked = params.selections;
    },

    handleSelectionChange(val) {
      this.products = val;
      this.multipleSelection = val;
    },

    getStockNum: function(row) {
      if (row.stocktotal < row.out_stock_num) {
        this.$message({ message: "出库数量不能大于库存数量", type: "error" });
        row.out_stock_num = "";
        return;
      }
      if (
        this.export_stock_num <
        Number(row.out_stock_num) + Number(this.out_stock_num)
      ) {
        this.$message({
          message: "出库数量之和不能大于预出库数量",
          type: "error"
        });
        row.out_stock_num = 0;
        return;
      } else {
        this.out_stock_num_ing = row.out_stock_num;
      }
    },
    // 打印
    print: function() {
      this.printPage = true;
      this.operation = true;
    },

    // 显示编辑界面
    distribution: function(params) {
      if (this.checked.length == 1) {
        this.dialogVisible = true;
        this.operation = false;
        this.dataForm = Object.assign({}, this.checked[0]);
        this.export_stock_num = this.checked[0].export_stock_num;
        var query = {};
        var queryOutStocknum = {};
        query.sku_id = this.checked[0].sku_id;
        query.provider_id = this.checked[0].customer_id;
        query.roduction_date = this.checked[0].roduction_date;
        query.t = "orderSaleExportSku";
        query.sql = "queryProductBySkuIdAndCustomerId";
        queryOutStocknum.sale_id = this.checked[0].sale_id;
        queryOutStocknum.sku_id = this.checked[0].sku_id;
        queryOutStocknum.t = "nwOrderSaleSku";
        queryOutStocknum.sql = "queryOutStockNum";
        var this_ = this;
        this.utils.request.queryUserList(query, function(data) {
          this_.tableProData = data.data;
        });
        this.utils.request.queryUserList(queryOutStocknum, function(data) {
          if (data != null) {
            this_.out_stock_num = data.data[0].out_stock_num;
          }
        });
      } else {
        this.$message({ message: "分配时只能选择一条数据", type: "error" });
      }
    },
    driverSelectionChange(val) {
      var array = [];
      for (var i = 0; i < val.selections.length; i++) {
        array.push(val.selections[i]);
      }
      this.$set(this.driver_list, `keys_${this.check_id}`, array);
      this.$forceUpdate();
    },

    // 编辑
    driverSubmitForm: function() {
      var this_ = this;
      this.$confirm("确认选择吗？", "提示", {}).then(() => {
        this.editLoading = true;
        this.editLoading = false;
        this.$message({ message: "操作成功", type: "success" });
        this.productmodal = false;
        this.operation = false;
      });
    },

    // 编辑
    submitForm: function() {
      var this_ = this;
      var out_stock_num = 0;
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            if (this_.products.length == 0) {
              this.$message({ message: "请选择一条数据", type: "error" });
              this.editLoading = false;
              return;
            } else {
              let flag = false;
              $.each(this_.products, function(index, val) {
                if (
                  val.out_stock_num == "" ||
                  val.out_stock_num == null ||
                  val.out_stock_num == 0
                ) {
                  this_.editLoading = false;
                  flag = true;
                } else {
                  out_stock_num = out_stock_num + Number(val.out_stock_num);
                }
              });
              if (flag) {
                this_.$message({ message: "请填写出库数量", type: "error" });
                return;
              }
              if (this_.export_stock_num < out_stock_num) {
                this.$message({
                  message: "出库数量不能大于客户要求出库数量",
                  type: "error"
                });

                this.editLoading = false;
                return;
              }
            }
            if (
              this_.export_stock_num ==
              Number(this_.out_stock_num_ing) + Number(this_.out_stock_num)
            ) {
              this_.dataForm.exportStatus = 1;
            }
            if (JSON.stringify(this_.driver_list) == "{}") {
              this.$message({ message: "请绑定司机", type: "error" });
              this.editLoading = false;
              return;
            }
            this_.dataForm.driver_list = JSON.stringify(this_.driver_list);
            // this_.dataForm.stock_num=JSON.stringify(this_.stock_num);
            this_.dataForm.products = JSON.stringify(this_.products);
            this_.utils.request.saveSaleDistribution(this_.dataForm, function(
              datas
            ) {
              if (datas.code == "0000") {
                this_.$message({ message: "操作成功", type: "success" });
                this_.dialogVisible = false;
                this_.dataForm.exportStatus = 0;
                this_.editLoading = false;
                this_.findPage();
              }
            });
          });
        }
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
          let filename = "库存分配";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
    },
    // 新增商品信息
    productAdd: function(data) {
      this.check_id = data.id;
      this.productmodal = true;
      this.operation = true;
    },
    getDriverPage(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
      var that = this;
      this.filters.t = "wdriver";
      this.filters.start = this.pageRequest.pageNum;
      this.filters.limit = this.pageRequest.pageSize;
      this.utils.request.queryUserPage(this.filters, function(datas) {
        that.pageDriverResult = {
          content: datas.rows,
          totalSize: parseInt(datas.total)
        };
      });
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return (
        '<input type="number" value="' +
        cellValue +
        '" style="width:100%;height:30px" />'
      );
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
        { prop: "product_name", label: "产品名称", minWidth: 120 },
        { prop: "level", label: "产品规格", minWidth: 120 },
        { prop: "client_name", label: "客户名称", minWidth: 120 },
        { prop: "customer_no", label: "客户出库单号", minWidth: 120 },
        { prop: "recipient_store", label: "收货仓库名称", minWidth: 120 },
        {
          prop: "recipient_store_address",
          label: "收货仓库具体地址",
          minWidth: 120
        },
        { prop: "recipient_people", label: "收货方对接人", minWidth: 120 },
        {
          prop: "recipient_people_mobile",
          label: "联系方式（手机）",
          minWidth: 120
        },
        { prop: "storage_time", label: "预入库时间", minWidth: 120 },
        { prop: "roduction_date", label: "生产日期", minWidth: 120 },
        { prop: "export_stock_num", label: "预计出库数量", minWidth: 120 }
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));

      this.columnsPro = [
        { prop: "id", label: "ID", minWidth: 50 },
        { prop: "productName", label: "产品名称", minWidth: 120 },
        { prop: "wnumber", label: "货位", minWidth: 120 },
        { prop: "tname", label: "托盘", minWidth: 120 },
        {
          prop: "roduction_date",
          label: "生产日期（产品批次）",
          minWidth: 120
        },
        { prop: "expiration_date", label: "过期日期", minWidth: 120 },
        { prop: "stockTotal", label: "库存数量", minWidth: 120 }
      ];

      this.columnsPro = [
        { prop: "id", label: "ID", minWidth: 50 },
        { prop: "drivername", label: "司机姓名", minWidth: 120 },
        { prop: "mobile", label: "联系方式", minWidth: 120 },
        { prop: "driver_type", label: "车辆类型", minWidth: 120 },
        { prop: "driver_number", label: "车牌号", minWidth: 120 }
      ];
      this.filterColumnsPro = JSON.parse(JSON.stringify(this.columnsPro));

      var temp = [];

      $.each(this.columnsPro, function(key, val) {
        temp.push(val);
      });
      this.filterColumnsPro = temp;
    },
    //重置
    resetForm(formName) {
      (this.filters = {
        product_name: "",
        level: "",
        client_name: "",
        phone: "",
        product_name: "",
        receive_receive_address: "",
        t: "orderSaleExportSku"
      }),
        this.$refs.CyTable.resetForm();
      this.findPage(this.filters);
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
</style>