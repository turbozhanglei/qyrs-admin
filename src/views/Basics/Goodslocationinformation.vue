<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" ref="filters" :size="size" class="form-input">
        <el-form-item>
          <el-input v-model="filters.number" placeholder="货位编码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.name" placeholder="货位名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-select v-model="filters.warehousename" placeholder="所属仓库" filterable>
            <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="filters.warehousearea" placeholder="所属库区" filterable>
            <el-option v-for="item in list1" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.warehouse_area" placeholder="区域"></el-input>
        </el-form-item>

        <el-form-item>
          <el-select v-model="filters.attribute" placeholder="仓库属性">
            <el-option label="自有库" value="0"></el-option>
            <el-option label="委外库" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.volume_stint" placeholder="最大体积"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.weight_stint" placeholder="最大承重"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.surplus_volume" placeholder="体积冗余"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.surplus_quality" placeholder="承重冗余"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.row" placeholder="所在排"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.stratum" type="number" placeholder="所在层"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.columnss" type="number" placeholder="所在列"></el-input>
        </el-form-item>

        <el-row style="text-algin:left;">
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
      ref="CyTable"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="60%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="150px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
        inline
        class="form-input-center"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="货位名称" prop="name">
          <el-select v-model="dataForm.name">
            <el-option label="常温货位" value="常温货位"></el-option>
            <el-option label="冷藏货位" value="冷藏货位"></el-option>
            <el-option label="冷冻货位" value="冷冻货位"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属仓库" prop="warehouse_id">
          <el-select v-model="dataForm.warehouse_id" @change="choseWarehouse" clearable filterable>
            <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属库区" prop="warehouse_area_id">
          <el-select
            v-model="dataForm.warehouse_area_id"
            filterable
            clearable
            @change="choseWarehouseArea"
          >
            <el-option v-for="item in list1" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="区域" prop="warehouse_area">
          <el-input v-model="dataForm.warehouse_area" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="最大体积（m³）">
          <el-input v-model="dataForm.volume_stint" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="最大承重（KG）">
          <el-input v-model="dataForm.weight_stint" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="体积冗余（m³）">
          <el-input v-model="dataForm.surplus_volume" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="承重冗余（KG）">
          <el-input v-model="dataForm.surplus_quality" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="所在排" prop="row">
          <el-input v-model="dataForm.row" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="所在层" prop="stratum">
          <el-input v-model="dataForm.stratum" type="number" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="所在列" prop="columnss">
          <el-input v-model="dataForm.columnss" type="number" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="dataForm.remark" auto-complete="off"></el-input>
        </el-form-item>
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
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import CyTable from "@/views/Core/CyTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format } from "@/utils/datetime";
import utils from "@/assets/js/utils.js";
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
      filters: {
        number: "",
        name: "",
        warehousename: "",
        attribute: "",
        volume_stint: "",
        weight_stint: "",
        surplus_volume: "",
        surplus_quality: "",
        row: "",
        stratum: "",
        columnss: "",
        remark: ""
      },
      columns: [],
      attribute: [{ key: 0, value: "自有库" }, { key: 1, value: "委外库" }],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      list: {},
      list1: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [
          { required: true, message: "请输入货位名称", trigger: "change" }
        ],
        attribute: [
          { required: true, message: "请输入库房性质", trigger: "blur" }
        ],
        warehouse_id: [
          { required: true, message: "请选择所属库房", trigger: "change" }
        ],
        volume_stint: [
          { required: true, message: "请输入最大体积", trigger: "blur" }
        ],
        weight_stint: [
          { required: true, message: "请输入最大承重", trigger: "blur" }
        ],
        surplus_volume: [
          { required: true, message: "请输入体积冗余", trigger: "blur" }
        ],
        surplus_quality: [
          { required: true, message: "请输入承重冗余", trigger: "blur" }
        ],
        row: [{ required: true, message: "请输入所在排", trigger: "blur" }],
        stratum: [{ required: true, message: "请输入所在层", trigger: "blur" }],
        columnss: [
          { required: true, message: "请输入所在列", trigger: "blur" }
        ],
        warehouse_area_id: [
          { required: true, message: "请选择所属库区", trigger: "change" }
        ],
        warehouse_area: [
          { required: true, message: "请输入区域", trigger: "blur" }
        ]
      },

      // 新增编辑界面数据
      dataForm: {
        number: "",
        name: "",
        warehousename: "",
        attribute: "",
        volume_stint: "",
        weight_stint: "",
        surplus_volume: "",
        surplus_quality: "",
        remark: "",
        row: "",
        stratum: "",
        columnss: ""
      }
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "warehouseSiteSetting";
      this.$refs.CyTable.findPage(this.filters);
    },

    // 仓库名称初始化
    queryUserList(data) {
      var that = this;
      this.utils.request.queryUserList(data, function(data) {
        that.list = data.data;
      });
    },
    // 所属库区初始化
    queryUserList1(data) {
      var that = this;
      this.utils.request.queryUserList(data, function(data) {
        that.list1 = data.data;
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
          let filename = "货位档案信息";
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
      data.t = "warehouseSiteSetting";
      data.ids = ids;
      this.utils.request.deleteUserInfo(data, data.callback);
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;

      if (this.$refs["dataForm"] != undefined) {
        this.$refs["dataForm"].resetFields();
      }

      this.dataForm = {
        number: "",
        name: "",
        warehousename: "",
        warehousearea: "",
        warehouse_area: "",
        attribute: "",
        volume_stint: "",
        weight_stint: "",
        surplus_volume: "",
        surplus_quality: "",
        remark: "",
        row: "",
        stratum: "",
        columnss: ""
      };
    },

    // 显示编辑界面
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            params.t = "warehouseSiteSetting";

            var this_ = this;

            $.each(params, function(key, value) {
              if (this_.utils.isNull(value)) {
                delete params[key];
              }
            });

            this.utils.request.editGoodsLocationInfo(params, this.editInfoBack);
          });
        }
      });
    },
    // 新增修改回调
    editInfoBack: function(data) {
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
        this.dialogVisible = false;
        this.$refs["dataForm"].resetFields();
      } else {
        this.$message({ message: "操作失败, " + data.msg, type: "error" });
      }
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
        { prop: "number", label: "货位编码", minWidth: 160 },
        { prop: "name", label: "货位名称", minWidth: 100 },
        { prop: "warehousename", label: "所属库房", minWidth: 120 },
        { prop: "warehousearea", label: "所属库区", minWidth: 180 },
        { prop: "warehouse_area", label: "所属区域", minWidth: 120 },
        { prop: "volume_stint", label: "最大体积（m³)", minWidth: 140 },
        { prop: "weight_stint", label: "最大承重（KG）", minWidth: 140 },
        { prop: "surplus_volume", label: "体积冗余（m³)", minWidth: 140 },
        { prop: "surplus_quality", label: "承重冗余（KG）", minWidth: 140 },
        { prop: "row", label: "所在排", minWidth: 80 },
        { prop: "stratum", label: "所在层", minWidth: 80 },
        { prop: "columnss", label: "所在列", minWidth: 80 },
        { prop: "remark", label: "备注", minWidth: 100 }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.filters = {};

      this.$refs.CyTable.resetForm();
      this.findPage({ t: "warehouseSiteSetting" });
    },
    //仓库属性格式化
    attributeFormatter(row, column, cellValue, index) {
      if (cellValue == 0) {
        return "自有库";
      } else if (cellValue == 1) {
        return "委外库";
      } else {
        return "未知";
      }
    },
    choseWarehouse(val) {
      var search = {};
      search.t = "warehouseArea";
      search._warehouse_id = val;
      var this_ = this;

      this.utils.request.queryUserList(search, function(res) {
        this_.list1 = res.data;
        this_.dataForm.warehouse_area_id = "";
        this_.dataForm = Object.assign({}, this_.dataForm);
      });
    },
    choseWarehouseArea(val) {
      if (this.utils.isNull(this.dataForm.warehouse_id)) {
        this.$message({ message: "请先选择仓库 ", type: "error" });
        this.dataForm.warehouse_area_id = "";
        return;
      }
    }
  },
  mounted() {
    this.initColumns();
    this.queryUserList({ t: "warehouse" });
    this.queryUserList1({ t: "warehouseArea" });
  }
};
</script>

<style scoped>
/deep/ .form-input .el-input__inner {
  width: 200px;
}

/deep/ .form-input-center {
  text-align: center !important;
}

/deep/ .form-input-center .el-input__inner {
  width: 200px;
}
</style>