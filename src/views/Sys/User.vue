<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" :label-position="labelPosition">
        <el-form-item prop="username" label="登录名">
          <el-input v-model="filters.username" placeholder="登录名" clearable></el-input>
        </el-form-item>
        <el-form-item prop="real_name" label="员工姓名">
          <el-input v-model="filters.real_name" placeholder="员工姓名" clearable></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="filters.mobile" placeholder="手机号" clearable></el-input>
        </el-form-item>
        <el-form-item prop="real_name" label="角色名">
          <el-input v-model="filters.real_name" placeholder="角色名" clearable></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="filters.startTime"
            type="date"
            placeholder="开始时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>
          至
          <el-date-picker
            v-model="filters.endTime"
            type="date"
            placeholder="结束时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>
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
              perms="sys:user:add"
              type="primary"
              @click="handleAdd"
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
      permsDisable="sys:user:start"
      permsEnable="sys:user:disable"
      permsEdit="sys:user:edit"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleUpStatus="handleUpStatus"
      :showBatchDelete="false"
      :showDeleteOperation="false"
      :showDisableOperation="true"
      :showEnableOperation="true"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="handleClose">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size" label-position="right">
        <input type="password" style="display: none;" />
        <el-form-item label="登录名" prop="username" required>
          <el-input v-model="dataForm.username" maxlength="30" show-word-limit placeholder="用户名为必填，1-30字符，不可为为纯符号和纯空格" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item style="position:fixed;buttom:-9999px">
          <el-input v-model="dataForm.password2" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item style="position:fixed;buttom:-9999px">
          <el-input v-model="dataForm.password1" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="dataForm.password" maxlength="16" placeholder="密码为必填，6-16位字符" type="password" auto-complete="off" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="员工姓名" prop="real_name">
          <el-input v-model="dataForm.real_name" maxlength="20" placeholder="员工姓名为0-20位字符" auto-complete="off" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" >
          <el-select v-model="dataForm.sex" placeholder="性别" style="width:639px">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="机构" prop="deptname">
          <popup-tree-input
            :data="deptData"
            :props="deptTreeProps"
            :prop="dataForm.deptname"
            :nodeKey="''+dataForm.deptid"
            :currentChangeHandle="deptTreeCurrentChangeHandle"
            filter_key="dept_name"
          ></popup-tree-input>
        </el-form-item>-->
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="dataForm.mobile"
            auto-complete="off"
            maxlength="11"
            placeholder="手机号为必填，11位纯数字"
            oninput="value=value.replace(/[^\d]/g,'')"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="dataForm.remark" maxlength="200" placeholder="备注为0-200个字符" show-word-limit auto-complete="off"></el-input>
        </el-form-item>
       

        <!-- <el-form-item label="上级用户" prop="pid">
          <el-select
            v-model="dataForm.pid"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            @change="choseCustomer"
            style="width:100%"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="角色" prop="userRoles">
          <el-select
            v-model="dataForm.userRoles"
            placeholder="请选择"
            style="width: 100%;"
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.role_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
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
import { exportExcel } from "@/utils/excel";
export default {
  components: {
    PopupTreeInput,
    CyTable,
    KtButton,
    TableColumnFilterDialog
  },
  data() {
    var checkUserName = (rule,value,callback) =>{
      if (!value){
        return callback(new Error('登录名为必填'));
      }else if (value.length < 1 || value.length >30){
        return callback(new Error('登录名为1-30字符'));
      }else if (value == ' '){
        return callback(new Error('登录名不可为纯空格'));
      }else if (/\s/.test(value)){
        return callback(new Error('登录名不可为纯空格'));
      }else if(!(/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(value))){
        return callback(new Error('登录名不可为纯符号'));
      }else {
        callback();
      }

    };
    return {
      size: "small",
      labelPosition: 'left',
      filters: {
        username: "",//登录名
        t: "sysUser",
        realName:"",//员工姓名
        mobile:"",//手机号
        roleName:"",//角色名
        startTime:"",//开始日期
        endTime:"",//结束日期
        desc:"",//备注
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        username: [
          { validator:checkUserName, trigger: "blur" }
          ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max:16, message: "密码为6-16位字符",trigger:"blur"}
          ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "手机号为必填，11位纯数字", trigger: "blur" }
        ],
      },
      // 新增编辑界面数据
      dataForm: {
        id: 0,
        name: "",
        password: "",
        deptid: "",
        deptname: "",
        email: "",
        mobile: "",
        status: 1,
        userRoles: "",
        account: "",
        pid: "",
        number: "",
        username: "",
        realName:"",//员工姓名
        desc:"",//备注
      },

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
    remoteMethod: function(query) {
      if (query !== "") {
        //查询后台客户信息
        var search = {};
        search.t = "sysUser";
        search.username = query;
        var this_ = this;
        this.utils.request.queryUserList(search, function(res) {
          this_.options = res.data;
        });
      } else {
        this.options = [];
      }
    },
    handleClose() {
      this.$refs.dataForm.resetFields();
      this.$emit('handleClose');
    },
    choseCustomer: function(selVal) {
      var temp = this.options;
      var this_ = this;

      if (selVal == "" || selVal == null) {
        this_.dataForm.manager_name = "";
        this_.dataForm.manager_mobile = "";
      } else {
        $.each(temp, function(key, val) {
          if (val.id == selVal) {
            this_.dataForm.manager_name = val.manager_name;
            this_.dataForm.manager_mobile = val.manager_mobile;
            return;
          }
        });
      }
    },
    // 获取分页数据
    findPage: function(data) {
      this.filters.identity_type=1;
      this.$refs.CyTable.findPage(this.filters);
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
    // 批量修改状态：禁用启用
    handleUpStatus: function(data) {
      if (data != null && data.params != null && data.params.length > 0) {
        let ids = data.params.map(item => item.id).toString();

        var params = {};
        if(data.type==1){
          params.status=1;
        }else if(data.type==0){
          params.status=0;
        }
        params.t = "sysUser";
        params.ids = ids;
        params.type= data.params.type;
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
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        id: "",
        name: "",
        password: "",
        deptid: "",
        deptname: "",
        email: "",
        mobile: "",
        status: 1,
        userRoles: [],
        account: "",
        pid: "",
        number: "",
        username: ""
      };
    },
    // 显示编辑界面
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.paswordTemp = params.row.password;

      this.dataForm = {
        id: params.row.id,
        name: params.row.name,
        password: "1a6XzyruFj",
        deptid: params.row.deptid,
        deptname: params.row.deptname,
        email: params.row.email,
        mobile: params.row.mobile,
        status: 1,
        remark:params.row.remark,
        real_name:params.row.real_name,
        sex:params.row.sex,
        userRoles: params.row.rolename,
        account: params.row.account,
        pid: params.row.pid,
        number: params.row.number,
        username: params.row.username,
        pname: params.row.pname
      };

      // let userRoles = [];
      // if (!this.utils.isNull(params.row.role_id_list)) {
      //   let idList = params.row.role_id_list.split(",");

      //   $.each(idList, function(key, value) {
      //     userRoles.push(Number(value));
      //   });
      // }
      this.options = [];
      if (this.dataForm.pid == 0) {
        this.dataForm.pname = " ";
      }
     debugger
      this.options.push({
        username: this.dataForm.pname,
        id: this.dataForm.pid
      });
      //this.dataForm.userRoles = userRoles;
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            let params = Object.assign({}, this.dataForm);
            // let userRoles = [];
            // for (let i = 0, len = params.userRoles.length; i < len; i++) {
            //   let userRole = {
            //     userId: params.id,
            //     roleId: params.userRoles[i]
            //   };
            //   userRoles.push(userRole);
            // }
            // params.userRoles = userRoles.map(item => item.roleId).toString();
            
            if(params.password=="1a6XzyruFj"){
              delete params.password;
            }
            if (this.paswordTemp == params.password) {
              delete params.password;
            }

            if (this.utils.isNull(params.pid)) {
              params.pid = 0;
            }

            var this_ = this;
            params.identity_type=1;
            params.status=0;
            params.source=1;
            params.editSum=0;

            this.utils.request.editUser(params, function(res) {
              if (res.code == "0000") {
                this_.$message({ message: "操作成功", type: "success" });
                this_.dialogVisible = false;
                this_.$refs["dataForm"].resetFields();
                this_.findPage(null);
              } else {
                this_.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
            });
          });
        }
      });
    },
    // 获取部门列表
    // findDeptTree: function() {
    //   var this_ = this;

    //   this.utils.request.findDeptTree({}, function(res) {
    //     if (res.code == "0000") {
    //       this_.deptData = res.data;
    //     } else {
    //     }
    //   });
    // },
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
        { prop: "username", label: "登录名", minWidth: 120 },
        { prop: "real_name", label: "员工姓名", minWidth: 120 },
        { prop: "mobile", label: "手机号", minWidth: 100 },
        { prop: "rolename", label: "角色", minWidth: 100 },
        {
          prop: "status",
          label: "状态",
          minWidth: 70,
          formatter: this.statusFormat
        },
        { prop: "remark", label: "备注", minWidth: 120 },
        { prop: "create_time", label: "创建时间", minWidth: 120 }
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
    this.findUserRoles();
  }
};
</script>

<style scoped>
</style>
