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
            <tree-select
              :options="options"
              placeholder="请选择分类"
              v-model="filters.categoryId"
              style="width:230px"
              @select="selecteCategory"
            />
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
        <el-form-item prop="status" label="状态">
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
              type="primary"
              @click="findPage(null)"
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
                @click="$refs.CyTable.findPage(null)"
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
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'CustomTreeSelect',
  components: {
    PopupTreeInput,
    CyTable,
    KtButton,
    TableColumnFilterDialog,
    TreeSelect
  },
  data() {
    return {
      options:[],
      value:null,
      size: "small",
      labelPosition: 'left',
      filters: {
        articleId: "",//文章id
        title:"",//文章标题
        categoryId:null,//所属分类
        platform:"",//支持平台
        status:"",//状态
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      articleStatus:[
        {
          'statusName':'全部',
          'value':''
        },
        {
          'statusName':'生效中',
          'status':'1'
        },
        {
          'statusName':'未生效',
          'status':'2'
        },
        {
          'statusName':'已过期',
          'status':'3'
        }
      ],
      categorys:[],
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
      this.filters.t='newsArticle'
      this.$refs.CyTable.findPage(this.filters);
    },
    // 批量删除
    handleDelete: function(data) {
      var ids='';
      for(var i=0;i<data.params.length;i++){
        ids=ids+data.params[i].id+',';
      }
      data.t='newsArticle'
      data.ids=ids
      this.utils.request.deleteUserInfo(data, data.callback)
    },
    handleAdd:function () {
      // this.$router.push({path:"/advert/advertSourceAdd/" + this.adId + '/0/0'});
      this.$router.push({path:"/news/articleAdd"+ '/0'});
    },
    // 显示编辑界面
    handleEdit: function(params) {
      this.$router.push({path:"/news/articleAdd"+ '/'+params.row.articleId});
      // this.$router.push({path:"/news/articleAdd",query:{articleId:params.row.articleId}});
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
        { prop: "articleId", label: "文章编号", minWidth: 60 },
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
        { prop: "update_time", label: "上一次操作时间", minWidth: 110 }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },
    //初始化分类
    queryCategoryList(){
      var that=this;
      let params={}
      params.t="newsArticle"
      params.sql="queryCategoryList"
      this.utils.request.getCategoryList(params,function(data){
        that.options=data.data
      })
    },
    selecteCategory(param){
      if(param.isFirstLevel==0){
        this.filters.isFirstLevel=0;
      }else if(param.isFirstLevel==1){
        this.filters.isFirstLevel=1;
      }
    },
    reset: function() {
      this.$refs["filters"].resetFields();
      this.filters.isFirstLevel=""
      this.$refs.CyTable.resetForm();
      this.findPage();
    }
  },
  mounted() {
    this.initColumns();
    this.findPage()
    this.queryCategoryList()
  }
};
</script>

<style scoped>
</style>
