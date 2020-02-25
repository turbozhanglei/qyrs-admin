<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" :label-position="labelPosition">
        <el-form-item prop="id" label="广告位编号">
          <el-input v-model="filters.id" placeholder="广告位编号" clearable></el-input>
        </el-form-item>
        <el-form-item prop="name" label="广告位名称">
          <el-input v-model="filters.name" placeholder="广告位名称" clearable></el-input>
        </el-form-item>
        <el-form-item prop="pageType" label="广告位页面">
          <el-select v-model="filters.pageType" placeholder="广告位页面">
            <el-option label="全部" value=""></el-option>
            <el-option label="首页" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="filters.status" placeholder="状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="0"></el-option>
            <el-option label="关闭" value="1"></el-option>
          </el-select>
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
              perms="sys:ad:add"
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

    <!--表格内容栏-->
    <cy-table
      :height="350"
      permsEdit="sys:ad:edit"
      permsDetail="sys:ad:mg"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDetail="handleDetail"
      :showBatchDelete="false"
      :showDeleteOperation="false"
      :detailButtonName="detailButtonName"
      :showDetailOperation="true"
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
          t:"adCode",
          id: "",//广告位编号
          name:"",//广告位名称
          pageType:"",//广告位页面类型
          status:"",//状态
        },
        columns: [],
        filterColumns: [],
        pageRequest: { pageNum: 1, pageSize: 10 },
        pageResult: {},
        options: [],
        detailButtonName:'广告管理',
      };
    },
    methods: {
      // 获取分页数据
      findPage: function(data) {
        this.$refs.CyTable.findPage(this.filters);
      },
      //新增
      handleAdd:function () {
        this.$router.push({path:"/advert/advertAdd/0"});
      },
      // 显示编辑界面
      handleEdit: function(params) {
        this.$router.push({path:"/advert/advertAdd/" + params.row.id});
      },

      // 页面类型格式化
      pageTypeFormat: function(row, column, cellValue, index) {
        if (Number(cellValue) == 1) {
          return "首页";
        }
      },
      // 状态格式化
      statusFormat: function(row, column, cellValue, index) {
        if (Number(cellValue) == 1) {
          return "关闭";
        }
        return "启用";
      },
      // 处理表格列过滤显示
      initColumns: function() {
        this.columns = [
          { prop: "id", label: "广告位编号", minWidth: 60 },
          { prop: "page_type", label: "广告位页面", minWidth: 120,formatter:this.pageTypeFormat },
          { prop: "name", label: "广告位名称", minWidth: 70 },
          { prop: "code", label: "广告位标识", minWidth: 80,},
          { prop: "num", label: "广告位显示个数", minWidth: 60 },
          {
            prop: "status",
            label: "状态",
            minWidth: 70,
            formatter: this.statusFormat
          }
        ];
        var temp = [];
        $.each(this.columns, function(key, val) {
          temp.push(val);
        });
        this.filterColumns = temp;
      },
      //重置按钮
      reset: function() {
        this.$refs["filters"].resetFields();
        this.$refs.CyTable.resetForm();
        this.findPage();
      },
      //跳转广告素材管理
      handleDetail:function (params) {
        // this.$router.push({path:"/advert/advertSource",query:{adId:params.row.id}});
        this.$router.push({path:"/advert/advertSource/" + params.row.id});
      }
    },
    mounted() {
      this.initColumns();
    }
  };
</script>

<style scoped>
</style>
