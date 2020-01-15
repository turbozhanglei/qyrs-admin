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
          <el-input v-model="filters.order_no" placeholder="入库订单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.manager_name" placeholder="对接联系人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.customerno" placeholder="客户代码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.start_time_min"
            type="datetime"
            placeholder="下单时间始"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.start_time_max"
            type="datetime"
            placeholder="下单时间末"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="filters.demand_date_min"
            type="datetime"
            placeholder="要求到货时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.demand_date_max"
            type="datetime"
            placeholder="要求到货时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.manager_mobile" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.num" placeholder="入库数量"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.name" placeholder="产品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.level" placeholder="产品规格"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.supplier_company" placeholder="服务方名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.supplier_people" placeholder="服务方联系人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.supplier_people_mobile" placeholder="服务方联系方式（手机）"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.carrier_company" placeholder="送货物流公司"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.arrival_date_min"
            type="datetime"
            placeholder="预计到货时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="filters.arrival_date_max"
            type="datetime"
            placeholder="预计到货时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="filters.roduction_date_min"
            type="datetime"
            placeholder="生产日期（产品批次）"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="filters.roduction_date_max"
            type="datetime"
            placeholder="生产日期（产品批次）"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.recipient_store" placeholder="最终收货仓库名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.recipient_store_address" placeholder="最终收货仓库具体地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.recipient_people" placeholder="最终收货方对接人"></el-input>
          <!-- <el-select v-model="filters.is_contract" style="width: 192px;" placeholder="是否签订了合同">  
					<el-option label="是" value="是"></el-option>
					<el-option label="否" value="否"></el-option>
					
          </el-select>-->
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.recipient_people_mobile" placeholder="最终收货方联系方式（手机）"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.transfer_store" placeholder="中转收货仓库名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.remark" placeholder="备注"></el-input>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="filters.expiration_date_min"
            type="datetime"
            placeholder="过期日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.expiration_date_max"
            type="datetime"
            placeholder="过期日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>

        <el-row style="text-align: left;">
          <el-form-item prop="is_transfer">
            <el-select v-model="filters.is_transfer" placeholder="是否中转" clearable>
              <el-option label="中转" value="0"></el-option>
              <el-option label="直达" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="buy_sku_status">
            <el-select v-model="filters.buy_sku_status" placeholder="质检状态" @change="qualityStatus">
              <el-option label="待质检" value="0"></el-option>
              <el-option label="质检中" value="1"></el-option>
              <el-option label="质检通过" value="2"></el-option>
              <el-option label="质检驳回" value="3"></el-option>
            </el-select>
          </el-form-item>

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
              icon="el-icon-s-check"
              label="质检"
              perms="product:orderin:checked"
              type="primary"
              @click="quality"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="el-icon-s-check"
              label="打印待检卡"
              perms="product:orderin:checked"
              type="primary"
              @click="printCard"
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
      <el-form :inline="true">
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
      :showDetailOperation="true"
      :showOperation="false"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @selectionChange="selectionChange"
      ref="CyTable"
    ></cy-table>

    <el-dialog title="质检页面" :visible.sync="checkpage" width="20%">
      <el-form :model="qualityForm" ref="qualityForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="质检操作">
          <el-select v-model="qualityForm.status" placeholder="请选择">
            <el-option label="质检通过" value="2"></el-option>
            <el-option label="质检驳回" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button @click="checkpage = false">取 消</el-button>
        <el-button type="primary" @click="doQualityProduct">确 定</el-button>
      </div>
    </el-dialog>

    <!--打印界面-->
    <el-dialog title="打印预览" width="35%" :visible.sync="printPage" :close-on-click-modal="false">
      <el-form :model="printForm" ref="printForm" label-width="100px" class="demo-ruleForm">
        <el-row style="text-align:center">北京东晓腾飞供应链管理有限公司</el-row>
        <el-row style="text-align:center">货物待检卡</el-row>
        <div class="demo-image__placeholder">
          <div class="block">
            <el-image :src="printForm.src" style="margin-left: 33%;width: 200px;"></el-image>
          </div>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单号:">
              <span>{{printForm.order_no}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货物名称:">
              <span>{{printForm.name}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供货单位:">
              <span>{{printForm.supplier_company}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="校验时间:">
              <span>{{printForm.checked_time}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="校验员:">
              <span>{{printForm.user_name}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click.native="printPage = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="doPrintCard">{{$t('action.comfirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import CyTable from "@/views/Core/CyTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format, formatDate } from "@/utils/datetime";

export default {
  components: {
    PopupTreeInput,
    CyTable,
    KtButton,
    TableColumnFilterDialog
  },
  data() {
    return {
      size: "small",
      printForm: {
        src:
          "https://ss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=829888290,2650878176&fm=74&app=80&f=JPG&size=f121,121?sec=1880279984&t=274501980523d63a7d93c94f85aabbab",
        user_name: sessionStorage.getItem("user"),
        checked_time: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
        supplier_company: "",
        name: "",
        order_no: "",
        ids: ""
      },
      printPage: false,
      qualityForm: {
        status: ""
      },
      filters: {
        t: "order_buy",
        status: "1",
        buy_sku_status: "0",
        order_no: "",
        client_name: "",
        docking_contact: "",
        customerno: "",
        start_time_min: "",
        start_time_max: "",
        manager_mobile: "",
        roduction_date_min: "",
        roduction_date_max: "",
        name: "",
        level: "",
        expiration_date_min: "",
        expiration_date_max: "",
        num: "",
        demand_date_min: "",
        demand_date_max: "",
        arrival_date_min: "",
        arrival_date_max: "",
        remark: "",
        recipient_store: "",
        recipient_store_address: "",
        recipient_people: "",
        recipient_people_mobile: "",
        supplier_company: "",
        supplier_people: "",
        supplier_people_mobile: "",
        carrier_company: ""
      },
      columns: [],
      columnsPro: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      productmodal: false,
      checkpage: false,
      selections: [],
      statusOptions: [],
      init_customer:false
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
       let customer_id = localStorage.getItem("customer_id");
      if (!this.utils.isNull(customer_id)) {
        this.filters.customer_id = customer_id;
        this.init_customer = true;
      }
      this.$refs.CyTable.findPage(this.filters);
    },

    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            let userRoles = [];
            for (let i = 0, len = params.userRoles.length; i < len; i++) {
              let userRole = {
                userId: params.id,
                roleId: params.userRoles[i]
              };
              userRoles.push(userRole);
            }
            params.userRoles = userRoles;
            this.$api.user.save(params).then(res => {
              this.editLoading = false;
              if (res.code == 200) {
                this.$message({ message: "操作成功", type: "success" });
                this.dialogVisible = false;
                this.$refs["dataForm"].resetFields();
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
              this.findPage(null);
            });
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
    selectionChange: function(data) {
      this.selections = data.selections;
    },
    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        // {prop:"id", label:"ID", minWidth:50},
        { prop: "order_no", label: "入库订单号", minWidth: 120 },
        { prop: "bill", label: "单据号", minWidth: 120 },
        { prop: "customerno", label: "客户编码", minWidth: 120 },
        { prop: "client_name", label: "客户名称", minWidth: 120 },
        { prop: "name", label: "产品名称", minWidth: 120 },
        { prop: "level", label: "产品规格", minWidth: 120 },
        { prop: "num", label: "入库数量（件）", minWidth: 140 },
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
        { prop: "drivername", label: "司机", minWidth: 120 },
        { prop: "driver_number", label: "车牌", minWidth: 120 },
        { prop: "manager_name", label: "对接联系人", minWidth: 120 },
        {
          prop: "buy_sku_status",
          label: "状态",
          minWidth: 120,
          formatter: this.formatterSkuStatus
        },
        { prop: "start_time", label: "下单时间", minWidth: 120 },
        { prop: "manager_mobile", label: "联系电话", minWidth: 120 },
        { prop: "roduction_date", label: "生产日期", minWidth: 120 },
        { prop: "expiration_date", label: "过期日期", minWidth: 120 },

        { prop: "remark", label: "备注", minWidth: 120 },
        { prop: "recipient_store", label: "最终收货仓库名称", minWidth: 120 },
        {
          prop: "recipient_store_address",
          label: "最终收货仓库具体地址",
          minWidth: 120
        },
        { prop: "recipient_people", label: "最终收货方对接人", minWidth: 120 },
        {
          prop: "recipient_people_mobile",
          label: "最终收货方联系方式",
          minWidth: 120
        },
        { prop: "end_time", label: "最终库要求到货时间", minWidth: 120 },
        { prop: "expect_time", label: "最终库预计到货时间", minWidth: 120 },

        {
          prop: "transfer_store",
          label: "中转收货仓库名称",
          minWidth: 120
        },
        {
          prop: "transfer_store_address",
          label: "中转收货仓库具体地址",
          minWidth: 120
        },
        { prop: "transfer_people", label: "中转收货方对接人", minWidth: 120 },
        {
          prop: "transfer_people_mobile",
          label: "中转收货方联系方式",
          minWidth: 120
        },
        {
          prop: "transfer_end_time",
          label: "中转库要求到货时间",
          minWidth: 120
        },
        {
          prop: "transfer_expect_time",
          label: "中转库预计到货时间",
          minWidth: 120
        },
        { prop: "supplier_company", label: "服务方名称", minWidth: 120 },
        { prop: "supplier_people", label: "服务方联系人", minWidth: 120 },
        {
          prop: "supplier_people_mobile",
          label: "供应商联系方式",
          minWidth: 120
        },
        { prop: "carrier_company", label: "送货物流公司", minWidth: 120 }
      ];

      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },
    qualityStatus(val) {
      this.filters.buy_sku_status = val;
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
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            "质检管理"
          );
        })
        .catch(() => {});
    },

    formatterSkuStatus(row, column, cellValue, index) {
      var status_labe = "";

      $.each(this.statusOptions, function(key, status) {
        if (status.key == cellValue) {
          status_labe = status.display_name;
          return false;
        }
      });

      return status_labe;
    },
    formatterUnitWeight(row, column, cellValue, index) {
      return this.mathUtils.accMul(cellValue, row.num);
    },
    formatterUnitvolume(row, column, cellValue, index) {
      return this.mathUtils.accMul(cellValue, row.num);
    },
    printCard: function() {
      if (this.selections.length != 1) {
        this.$message({ message: "请选择一个产品", type: "error" });
        return;
      }

      var data = this.selections[0];

      this.printForm = {
        src:
          "https://ss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=829888290,2650878176&fm=74&app=80&f=JPG&size=f121,121?sec=1880279984&t=274501980523d63a7d93c94f85aabbab",
        user_name: sessionStorage.getItem("user"),
        checked_time: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
        supplier_company: data.supplier_company,
        name: data.name,
        order_no: data.order_no,
        ids: data.buy_sku_id
      };
      this.printPage = true;
    },
    quality: function() {
      if (this.selections.length == 0) {
        this.$message({ message: "请至少选择一条", type: "error" });
        return;
      }
      this.checkpage = true;
    },
    doQualityProduct: function() {
      if (this.selections.length == 0) {
        this.$message({ message: "请至少选择一个产品", type: "error" });
        return;
      }

      var data = {};

      var ids = "";

      $.each(this.selections, function(key, value) {
        ids = ids + "," + value.buy_sku_id;
      });

      data.status = this.qualityForm.status;
      data.ids = ids;

      var this_ = this;
      this.utils.request.doQualityProduct(data, function(res) {
        if (res.code == "0000") {
          this_.$message({ message: "质检完成", type: "success" });
          this_.checkpage = false;
          this_.findPage();
        } else {
          this_.$message({ message: res.msg, type: "error" });
        }
      });
    },

    //重置
    resetForm(formName) {
      this.filters = {
        t: "order_buy",
        buy_sku_status: "0",
        status: "1",
        order_no: "",
        client_name: "",
        docking_contact: "",
        customerno: "",
        start_time_min: "",
        start_time_max: "",
        manager_mobile: "",
        roduction_date_min: "",
        roduction_date_max: "",
        name: "",
        level: "",
        expiration_date_min: "",
        expiration_date_max: "",
        num: "",
        demand_date_min: "",
        demand_date_max: "",
        arrival_date_min: "",
        arrival_date_max: "",
        remark: "",
        recipient_store: "",
        recipient_store_address: "",
        recipient_people: "",
        recipient_people_mobile: "",
        supplier_company: "",
        supplier_people: "",
        supplier_people_mobile: "",
        carrier_company: "",
        id: ""
      };
      this.$refs.CyTable.resetForm();
      this.findPage();
    },

    doPrintCard() {
      var this_ = this;
      this.utils.request.printQualityCard(this.printForm, function(res) {
        if (res.code == "0000") {
          this_.$message({ message: "打印成功", type: "success" });
          this_.printPage = false;
          this_.findPage();
        } else {
          this_.$message({ message: res.msg, type: "error" });
        }
      });
    }
  },
  mounted() {
    this.statusOptions = [
      {
        key: 0,
        display_name: "待质检"
      },
      {
        key: 1,
        display_name: "质检中"
      },
      {
        key: 2,
        display_name: "质检通过"
      },
      {
        key: 3,
        display_name: "质检驳回"
      }
    ];
    this.initColumns();
  }
};
</script>

<style scoped>
/deep/ .form .el-input__inner {
  width: 200px;
}
</style>