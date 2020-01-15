<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" class="form">
        <el-form-item prop="sku_name">
          <el-input v-model="filters.sku_name" placeholder="产品名称"></el-input>
        </el-form-item>
        <el-form-item prop="sku_level">
          <el-input v-model="filters.sku_level" placeholder="产品规格"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.driver_car_number" placeholder="到货车辆车牌号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.driver_name" placeholder="到货承运司机姓名"></el-input>
        </el-form-item>
        <el-form-item prop="bill">
          <el-input v-model="filters.bill" placeholder="单据号"></el-input>
        </el-form-item>
        <el-form-item prop="client_name">
          <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
        </el-form-item>
        <el-form-item prop="creator_name">
          <el-input v-model="filters.creator_name" placeholder="检验员"></el-input>
        </el-form-item>
        <el-form-item prop="inspecter_result">
          <el-select v-model="filters.inspecter_result" placeholder="检验结论">
            <el-option label="全部合格" value="0"></el-option>
            <el-option label="部分合格" value="1"></el-option>
            <el-option label="部分不合格" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-row>
          <el-form-item prop="status">
            <el-select v-model="filters.status" placeholder="状态" @change="satusSelect">
              <el-option label="待入库" value="0"></el-option>
              <el-option label="已入库" value="2"></el-option>
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
          <!-- <el-form-item>
            <kt-button
              icon="el-icon-printer"
              :label="$t('action.print')"
              type="primary"
              @click="print"
            />
          </el-form-item>-->
          <el-form-item>
            <kt-button
              icon="el-icon-refresh"
              :label="$t('action.reset')"
              type="primary"
              @click="resetSelection"
            />
            <kt-button
              icon="fa el-icon-folder-add"
              label="批量入库"
              v-loading="editLoading"
              @click="batchIntoStoreBuySku"
              type="primary"
              v-show="!init_customer"
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
      :showOperation="false"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @selectionChange="selectionChange"
      ref="CyTable"
    ></cy-table>

    <!--打印界面-->
    <!-- <el-dialog title="打印预览'" width="35%" :visible.sync="printPage" :close-on-click-modal="false"></el-dialog> -->

    <!--图片预览-->
    <el-dialog :visible.sync="showPictureDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
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
      showPictureDialogVisible: false,
      dialogImageUrl: "",
      bill_photo_list: [],
      size: "small",
      size: "small",
      siteSettingData: [],
      inspecterOptions: [
        {
          value: 0,
          label: "全部合格"
        },
        {
          value: 1,
          label: "部分合格"
        },
        {
          value: 2,
          label: "部分不合格"
        }
      ],
      isexpiredOptions: [
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        }
      ],
      filters: {
        t: "sinkAllocation",
        status: "0",
        sku_number: "",
        sku_name: "",
        sku_level: "",
        driver_car_number: "",
        driver_car_type: "",
        driver_name: "",
        driver_phone: "",
        bill: "",
        isexpired: "",
        client_name: "",
        creator_name: "",
        inspecter_result: ""
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
        bill_photo: "",
        allocated_num: 0
      },
      deptData: [],
      selections: [],

      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      src:
        "https://ss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=829888290,2650878176&fm=74&app=80&f=JPG&size=f121,121?sec=1880279984&t=274501980523d63a7d93c94f85aabbab",
      options: [],
      warehouseoptions: [],
      warehouseareaoptions: [],
      warehoussettingoptions: [],
      init_customer: false
    };
  },
  methods: {
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
            "产品入库"
          );
        })
        .catch(() => {});
    },
    // 选择切换
    selectionChange: function(params) {
      this.selections = params.selections;
    },
    // 获取分页数据
    findPage: function(data) {
      let customer_id = localStorage.getItem("customer_id");
      if (!this.utils.isNull(customer_id)) {
        this.filters.customer_id = customer_id;
        this.init_customer = true;
      }
      this.$refs.CyTable.findPage(this.filters);
    },
    satusSelect(val) {
      this.filters.status = val;
      this.findPage();
    },

    // 打印
    print: function() {
      this.printPage = true;
      this.operation = true;
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
        { prop: "bill", label: "单据号", minWidth: 120 },
        { prop: "productname", label: "产品名称", minWidth: 120 },
        { prop: "productlevel", label: "产品规格", minWidth: 120 },
        { prop: "batch_number", label: "批次编号", minWidth: 120 },
        { prop: "client_name", label: "客户名称", minWidth: 120 },
        { prop: "tray_number", label: "托盘编码", minWidth: 120 },
        { prop: "number", label: "货位编号", minWidth: 120 },
        { prop: "stock", label: "数量(件)", minWidth: 120 },
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
        {
          prop: "status",
          label: "状态",
          minWidth: 120,
          formatter: this.formateStatus
        },
        { prop: "driver_number", label: "到货车辆车牌号", minWidth: 120 },
        { prop: "drivername", label: "到货承运司机姓名", minWidth: 120 },
        { prop: "creator_name", label: "检验员", minWidth: 120 },
        {
          prop: "inspecter_result",
          label: "检验结论",
          minWidth: 120,
          formatter: this.formateInspecterResult
        }
      ];

      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    resetSelection() {
      this.filters = {
        t: "sinkAllocation",
        status: "0",
        sku_number: "",
        sku_name: "",
        sku_level: "",
        driver_car_number: "",
        driver_car_type: "",
        driver_name: "",
        driver_phone: "",
        bill: "",
        isexpired: "",
        client_name: "",
        creator_name: "",
        inspecter_result: ""
      };
      this.$refs.CyTable.resetForm();
      this.findPage();
    },

    formateStatus(row, column, cellValue, index) {
      //状态  0 待分配 1 已分配
      if (cellValue == 0) {
        return "待入库";
      } else if (cellValue == 1) {
        return "入库中";
      } else {
        return "已入库";
      }
    },

    formateInspecterResult(row, column, cellValue, index) {
      //检验结论 0 全部合格、1 部分合格  、2 部分不合格
      if (cellValue == 0) {
        return "全部合格";
      } else if (cellValue == 1) {
        return "部分合格";
      } else if (cellValue == 2) {
        return "部分不合格";
      }
      return "";
    },

    //批量入库
    batchIntoStoreBuySku() {
      if (this.selections.length == 0) {
        this.$message.error("请勾选需要入库的数据");
        return;
      }
      let ids = this.selections.map(item => item.id).toString();
      this.editLoading = true;
      this.utils.request.batchIntoStoreBuySku({ ids: ids }, item => {
        this.editLoading = false;
        if (item.code == "0000") {
          this.$message.success("批量入库成功");
          this.findPage();
        } else {
          this.$message.error(item.msg);
        }
      });
    },
    formatterUnitWeight(row, column, cellValue, index) {
      return this.mathUtils.accMul(cellValue, row.stock);
    },
    formatterUnitvolume(row, column, cellValue, index) {
      return this.mathUtils.accMul(cellValue, row.stock);
    }
  },
  mounted() {
    this.initColumns();
  }
};
</script>

<style scoped>
/deep/ .form .el-input__inner {
  width: 200px !important;
}

/deep/ .table .el-input__inner {
  width: 100% !important;
}
</style>