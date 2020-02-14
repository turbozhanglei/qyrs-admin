<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" :label-position="labelPosition">
        <el-form-item prop="nickname" label="会员昵称">
          <el-input v-model="filters.nickname" placeholder="会员昵称" clearable></el-input>
        </el-form-item>
        <el-form-item prop="userId" label="用户ID">
          <el-input v-model="filters.id" placeholder="用户ID" clearable></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="filters.mobile" placeholder="手机号" clearable></el-input>
        </el-form-item>
        <el-form-item prop="status" label="用户状态">
          <el-select v-model="filters.status" placeholder="用户状态">
            <el-option
              v-for="item in optionStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="filters.startTime"
            type="date"
            placeholder="开始时间">
          </el-date-picker>
          至
          <el-date-picker
            v-model="filters.endTime"
            type="date"
            placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-row>
          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              perms="sys:user:view"
              type="primary"
              @click="$refs.CyTable.findPageBeforeRestPages(filters)"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="el-icon-refresh"
              :label="$t('action.reset')"
              type="primary"
              @click="reset"
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
              <el-button
                icon="fa fa-refresh"
                @click="$refs.CyTable.findPageBeforeRestPages(filters)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="列显示" placement="top">
              <el-button icon="fa fa-filter" @click="displayFilterColumnsDialog"></el-button>
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
      permsDisable="sys:mem:start"
      permsEnable="sys:mem:disable"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleUpStatus="handleUpStatus"
      @handleDetail="handleDetail"
      :showEditOperation="false"
      :showDetailOperation="true"
      :showBatchDelete="false"
      :showDeleteOperation="false"
      :showDisableOperation="true"
      :showEnableOperation="true"
      :showBatchDisableOperation="true"
      :showBatchEnableOperation="true"
      ref="CyTable"
    ></cy-table>

  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import CyTable from "@/views/Core/CyTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format } from "@/utils/datetime";
import { exportExcel } from "@/utils/excel";
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
      labelPosition: 'left',
      filters: {
        // nickname: "",//会员昵称
        // t: "sysUser",
        // id:"",//用户id
        // mobile:"",//手机号
        // userStatus:"",//用户状态
        // startTime:"",//开始日期
        // endTime:"",//结束日期
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      deptData: [],
      deptTreeProps: {
        label: "dept_name",
        children: "children"
      },
      roles: [],
      options: [],
      optionStatus:[
        {
          'label':'全部',
          'value':''
        },
        {
          'label':'启用',
          'value':'0'
        },
        {
          'label':'禁用',
          'value':'1'
        }
      ],
      paswordTemp: ""
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "sysUser";
      this.$refs.CyTable.findPage(this.filters);
      console.log(this.filters)
    },
    // 加载用户角色信息
    findUserRoles: function() {
      var this_ = this;
      let query = {};
      query.t = "sysRole";
      this.utils.request.queryUserList(query, function(res) {
        if (res.code == "0000") {
          this_.roles = res.data;
        } else {
        }
      });
    },
    // 启用停用
    handleUpStatus: function(data) {
      
      if (data != null && data.params != null && data.params.length > 0) {
        let ids = data.params.map(item => item.id).toString();
        var params = {};
        params.t = "sysUser";
        params.ids = ids;
        if(data.type==1){
          params.status=1;
        }else if(data.type==0){
          params.status=0;
        }
        var this_ = this;
        this.utils.request.updateUserInfo(params, function(res) {
          if (res.code == "0000") {
            this_.$message({ message: "操作成功", type: "success" });
            this_.findPage(null);
          } else {
            this_.$message({ message: "操作失败, " + res.msg, type: "error" });
          }
        });
      }
    },
    handleDetail:function (params) {
      this.$router.push({path:"/sys/memberInfo",query:{userId:params.row.id}});
    },
   
    // 菜单树选中
    deptTreeCurrentChangeHandle(data, node) {
      console.log(data);
      this.dataForm.deptid = data.id;
      this.dataForm.deptname = data.dept_name;
    },
    // 状态格式化
    statusFormat: function(row, column, cellValue, index) {
      if (Number(cellValue) == 0) {
        return "启用";
      }
      return "禁用";
    },
    source:function(row,column,cellValue,index){
       if(Number(cellValue) == 1){
         return "小程序";
       }else{
         return "后台";
       }
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
        { prop: "id", label: "用户ID", minWidth: 120 },
        { prop: "nickname", label: "会员昵称", minWidth: 120 },
        { prop: "username", label: "用户名", minWidth: 120 },
        { prop: "mobile", label: "手机号", minWidth: 100 },
        {
          prop: "status",
          label: "用户状态",
          minWidth: 70,
          formatter: this.statusFormat
        },
        { prop: "source", label: "注册来源", minWidth: 100 ,formatter: this.source},
        { prop: "fans", label: "粉丝数", minWidth: 100 },
        { prop: "create_time", label: "注册时间", minWidth: 120 }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    reset: function() {
      this.$refs["filters"].resetFields();
      this.$refs.CyTable.resetForm();
      this.findPage();
    }
  },
  mounted() {
    this.initColumns();
    this.findPage();
  }
};
</script>

<style scoped>
</style>
