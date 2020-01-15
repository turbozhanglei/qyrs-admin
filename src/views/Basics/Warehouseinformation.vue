<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" ref="filters" :size="size" class="form">
        <el-form-item prop="number">
          <el-input v-model="filters.number" placeholder="仓库编码"></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-select v-model="filters.name" placeholder="仓库名称">
            <el-option
              v-for="item in warehouselist"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="attribute">
          <el-select v-model="filters.attribute" placeholder="仓库属性">
            <el-option label="自有库" value="0"></el-option>
            <el-option label="委外库" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="charge_person">
          <el-input v-model="filters.charge_person" placeholder="负责人"></el-input>
        </el-form-item>
        <el-form-item prop="deptid">
          <el-select v-model="filters.deptid" placeholder="请选择部门" filterable>
            <el-option v-for="item in list" :key="item.id" :label="item.dept_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="address">
          <el-input v-model="filters.address" placeholder="具体地址"></el-input>
        </el-form-item>

        <el-form-item prop="charge_mobile">
          <el-input v-model="filters.charge_mobile" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item prop="longitude">
          <el-input v-model="filters.longitude" placeholder="经度"></el-input>
        </el-form-item>
        <el-form-item prop="dimension">
          <el-input v-model="filters.dimension" placeholder="纬度"></el-input>
        </el-form-item>
        <el-row>
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
            <kt-button  icon="el-icon-refresh" :label="$t('action.reset')" type="primary" @click="resetForm('filters')" />
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
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      ref="CyTable"
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
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="仓库编码" prop="number">
              <el-input v-model="dataForm.number" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库名称" prop="name">
              <el-input v-model="dataForm.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="仓库属性" prop="attribute">
              <el-select v-model="dataForm.attribute" style="width: 100%">
                <el-option label="请选择" value></el-option>
                <el-option
                  v-for="item in attribute"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="charge_person">
              <el-input v-model="dataForm.charge_person" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptid">
              <el-select v-model="dataForm.deptid" style="width: 100%" placeholder="请选择部门" filterable>
                <el-option
                  v-for="item in list"
                  :key="item.id"
                  :label="item.dept_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="具体地址" prop="address">
              <el-input v-model="dataForm.address" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="charge_mobile">
              <el-input
                v-model="dataForm.charge_mobile"
                maxlength="11"
                show-word-limit
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="dataForm.longitude" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="纬度" prop="dimension">
              <el-input v-model="dataForm.dimension" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
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
      list: [],
      warehouselist: [],
      attribute: [{ key: 0, value: "自有库" }, { key: 1, value: "委外库" }],
      filters: {
        number: "",
        name: "",
        attribute: "",
        charge_person: "",
        deptid: "",
        address: "",
        charge_mobile: "",
        longitude: "",
        dimension: ""
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [{ required: true, message: "请输入仓库名称", trigger: "blur" }],
        number: [
          { required: true, message: "请输入仓库编码", trigger: "blur" }
        ],
        attribute: [{ required: true, message: "请仓库属性", trigger: "blur" }]
      },
      // 新增编辑界面数据
      dataForm: {}
    };
  },

  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "warehouse";
      this.$refs.CyTable.findPage(this.filters);
    },
    // 部门初始化和仓库名称初始化
    queryUserList() {
      var that = this;
      this.utils.request.queryUserList({ t: "sysDept",type:20 }, function(data) {
        that.list = data.data;
      });
      this.utils.request.queryUserList({ t: "warehouse" }, function(data) {
        that.warehouselist = data.data;
      });
    },

    // 批量删除
    handleDelete: function(data) {
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }
      data.t = "warehouse";
      data.ids = ids;
      this.utils.request.deleteUserInfo(data, data.callback);
    },
    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let filename = "仓库档案信息";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {};
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
            params.t = "warehouse";
            this.utils.request.editUserInfo(params, this.editInfoBack);
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
      this.findPage({ t: "warehouse" });
      this.dialogVisible = false;
      this.operation = false;
      this.editLoading = false;
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
        { prop: "number", label: "仓库编码", minWidth: 120 },
        { prop: "name", label: "仓库名称", minWidth: 120 },
        {
          prop: "attribute",
          label: "仓库属性",
          minWidth: 120,
          formatter: this.attributeFormatter
        },
        { prop: "charge_person", label: "负责人", minWidth: 120 },
        { prop: "dept_name", label: "部门", minWidth: 120 },
        { prop: "address", label: "具体地址", minWidth: 120 },
        { prop: "charge_mobile", label: "联系电话", minWidth: 120 },
        { prop: "longitude", label: "经度", minWidth: 120 },
        { prop: "dimension", label: "维度", minWidth: 120 },
        { prop: "remark", label: "备注", minWidth: 80 }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.CyTable.resetForm();
      this.findPage({ t: "warehouse" });
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
    }
  },
  mounted() {
    this.initColumns();
    this.queryUserList();
  }
};
</script>

<style scoped>
/deep/ .form .el-input__inner {
  width: 200px !important;
}
</style>