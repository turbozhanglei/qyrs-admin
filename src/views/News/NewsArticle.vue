<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" :label-position="labelPosition">
        <el-form-item prop="articleId" label="文章ID">
          <el-input v-model="filters.articleId" placeholder="文章ID" clearable></el-input>
        </el-form-item>
        <el-form-item prop="title" label="文章标题">
          <el-input v-model="filters.title" placeholder="文章标题" clearable></el-input>
        </el-form-item>
        <el-form-item prop="categoryId" label="所属分类">
          <el-select v-model="filters.categoryId" placeholder="所属分类">
            <el-option
              v-for="item in categorys"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="platform" label="支持平台">
          <el-select v-model="filters.platform" placeholder="支持平台">
            <el-option
              v-for="item in platforms"
              :key="item.platform"
              :label="item.platformName"
              :value="item.platform">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="platform" label="状态">
          <el-select v-model="filters.status" placeholder="状态">
            <el-option
              v-for="item in articleStatus"
              :key="item.status"
              :label="item.statusName"
              :value="item.status">
            </el-option>
          </el-select>
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
      permsEdit="sys:user:edit"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      :showBatchDelete="false"
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
        articleId: "",//文章id
        title:"",//文章标题
        categoryId:"",//所属分类
        platform:"",//支持平台
        status:"",//状态
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      options: [],
      articleStatus:[
        {
          'statusName':'全部',
          'value':''
        },
        {
          'statusName':'生效中',
          'status':'0'
        },
        {
          'statusName':'未生效',
          'status':'1'
        },
        {
          'statusName':'已过期',
          'status':'2'
        }
      ],
      categorys:[
        {
        categoryId:0,
        categoryName:"全部"
        },
        {
          categoryId:1,
          categoryName:"帮助中心"
        },
        {
          categoryId:2,
          categoryName:"头条"
        }
      ],
      platforms:[
        {
          platform:1,
          platformName:'小程序'
        },
        {
          platform:2,
          platformName:'微信H5'
        }
      ],
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
      let pageResult=[
          {id:1,title:'备战开学季 全民半价购',categoryName:'优化活动',platform:1,shares:11,likes:34,browses:45,status:1,validDate:'2020-01-03 0:00:00~2020-01-05 0:00:00',updator:'2020-01-05 20:00:00'},
          {id:2,title:'备战开学季 全民半价购',categoryName:'优化活动',platform:1,shares:32,likes:234,browses:54,status:2,validDate:'2020-01-03 0:00:00~2020-01-05 0:00:00',updator:'2020-01-05 20:00:00'},
          {id:3,title:'备战开学季 全民半价购',categoryName:'优化活动',platform:1,shares:45,likes:534,browses:2343,status:3,validDate:'2020-01-03 0:00:00~2020-01-05 0:00:00',updator:'2020-01-05 20:00:00'},
          {id:4,title:'备战开学季 全民半价购',categoryName:'优化活动',platform:1,shares:1451,likes:4645,browses:878,status:3,validDate:'2020-01-03 0:00:00~2020-01-05 0:00:00',updator:'2020-01-05 20:00:00'},
          {id:5,title:'备战开学季 全民半价购',categoryName:'优化活动',platform:1,shares:342,likes:5645,browses:65,status:2,validDate:'2020-01-03 0:00:00~2020-01-05 0:00:00',updator:'2020-01-05 20:00:00'},
          {id:6,title:'备战开学季 全民半价购',categoryName:'优化活动',platform:1,shares:453,likes:676,browses:7867,status:3,validDate:'2020-01-03 0:00:00~2020-01-05 0:00:00',updator:'2020-01-05 20:00:00'},
          {id:7,title:'备战开学季 全民半价购',categoryName:'优化活动',platform:1,shares:454,likes:546,browses:675,status:2,validDate:'2020-01-03 0:00:00~2020-01-05 0:00:00',updator:'2020-01-05 20:00:00'},
          {id:8,title:'备战开学季 全民半价购',categoryName:'优化活动',platform:1,shares:657,likes:456,browses:655,status:2,validDate:'2020-01-03 0:00:00~2020-01-05 0:00:00',updator:'2020-01-05 20:00:00'},
          {id:9,title:'备战开学季 全民半价购',categoryName:'优化活动',platform:1,shares:767,likes:454,browses:6765,status:2,validDate:'2020-01-03 0:00:00~2020-01-05 0:00:00',updator:'2020-01-05 20:00:00'},
          {id:10,title:'备战开学季 全民半价购',categoryName:'优化活动',platform:1,shares:456,likes:343,browses:4353,status:2,validDate:'2020-01-03 0:00:00~2020-01-05 0:00:00',updator:'2020-01-05 20:00:00'},
          {id:11,title:'备战开学季 全民半价购',categoryName:'优化活动',platform:1,shares:56,likes:4565,browses:767,status:3,validDate:'2020-01-03 0:00:00~2020-01-05 0:00:00',updator:'2020-01-05 20:00:00'}
        ];
      this.$refs.CyTable.findPage({ content: pageResult, total: 11 });
    },
    // 批量删除
    handleDelete: function(data) {
      if (data != null && data.params != null && data.params.length > 0) {
        let ids = data.params.map(item => item.id).toString();

        var params = {};
        params.t = "sysUser";
        params.ids = ids;
        params.type= data.params.type;
        var this_ = this;
        this.utils.request.batchDeleteInfo(params, function(res) {
          if (res.code == "0000") {
            this_.$message({ message: "操作成功", type: "success" });
            this_.findPage(null);
          } else {
            this_.$message({ message: "操作失败, " + res.msg, type: "error" });
          }
        });
      }
    },
    handleAdd:function () {

    },
    // 显示编辑界面
    handleEdit: function(params) {

    },

    // 菜单树选中
    deptTreeCurrentChangeHandle(data, node) {
      console.log(data);
      this.dataForm.deptid = data.id;
      this.dataForm.deptname = data.dept_name;
    },
    // 平台格式化
    platformFormat: function(row, column, cellValue, index) {
      if (Number(cellValue) == 0) {
        return "微信H5";
      }
      return "微信小程序";
    },
    // 状态格式化，更加生效时间判断 1、生效中 2、未生效 3、已过期
    statusFormat: function(row, column, cellValue, index) {
      if (Number(cellValue) == 1) {
        return "生效中";
      }else if (Number(cellValue) == 2){
        return "未生效";
      }
      return "已过期";
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
        { prop: "id", label: "文章编号", minWidth: 60 },
        { prop: "title", label: "文章标题", minWidth: 120 },
        { prop: "categoryName", label: "所属分类", minWidth: 70 },
        {
          prop: "platform",
          label: "支持平台",
          minWidth: 80,
          formatter: this.platformFormat
        },
        { prop: "shares", label: "分享数", minWidth: 60 },
        { prop: "likes", label: "点赞数", minWidth: 60 },
        { prop: "browses", label: "浏览量", minWidth: 60 },
        {
          prop: "status",
          label: "状态",
          minWidth: 70,
          formatter: this.statusFormat
        },
        { prop: "validDate", label: "有效期", minWidth: 160 },
        { prop: "updator", label: "上一次操作时间", minWidth: 110 }
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
  }
};
</script>

<style scoped>
</style>
