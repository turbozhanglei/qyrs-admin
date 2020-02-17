<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;width: 100%">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" :label-position="labelPosition">
        <el-row>
          <el-col :span="6">
            <el-form-item label="资源信息编码" prop="id">
              <el-input v-model="filters.id" placeholder="资源信息编码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资源信息标题" prop="title">
              <el-input v-model="filters.title" placeholder="资源信息标题" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源信息类型" prop="releaseType">
              <el-select v-model="filters.releaseType" placeholder="资源信息类型">
                <el-option label="全部" value=""></el-option>
                <el-option label="出售" value="0"></el-option>
                <el-option label="求购" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="发布状态" prop="status">
              <el-select v-model="filters.status" placeholder="发布状态" style="padding-left: 28px;">
                <el-option label="全部" value=""></el-option>
                <el-option label="待审核" value="0"></el-option>
                <el-option label="系统审核通过" value="1"></el-option>
                <el-option label="待人工审核" value="2"></el-option>
                <el-option label="人工审核通过" value="3"></el-option>
                <el-option label="人工审核不通过" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="置顶状态" prop="sticky" >
              <el-select v-model="filters.sticky" placeholder="置顶状态" style="padding-left: 28px;">
                <el-option label="全部" value=""></el-option>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="startTime" @focus="checkStartTime()">
              <el-date-picker
                v-model="filters.startTime"
                type="date"
                placeholder="开始时间" >
              </el-date-picker>
              至
            </el-form-item>
            <el-form-item prop="endTime" @change="checkEndTime()">
              <el-date-picker
                v-model="filters.endTime"
                type="date"
                placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item prop="userId" label="发布人用户id">
              <el-input v-model="filters.userId" placeholder="发布人用户id" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="mobile" label="发布人手机号">
              <el-input v-model="filters.mobile" placeholder="发布人手机号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="敏感词" prop="sensitiveFlag" >
              <el-select v-model="filters.sensitiveFlag" placeholder="敏感词" style="padding-left: 45px;">
                <el-option label="全部" value=""></el-option>
                <el-option label="含有敏感词" value="1"></el-option>
                <el-option label="不含敏感词" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item prop="browsesStart" label="浏览量">
              <el-input v-model="filters.browsesStart" clearable style="width: 90px"></el-input>
              —
            </el-form-item>
            <el-form-item prop="browsesEnd">
              <el-input v-model="filters.browsesEnd" clearable style="width: 90px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="sharesStart" label="分享数">
              <el-input v-model="filters.sharesStart" clearable style="width: 90px"></el-input>
              —
            </el-form-item>
            <el-form-item prop="sharesEnd">
              <el-input v-model="filters.sharesEnd" clearable style="width: 90px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源信息标签" prop="releaseLabel">
              <el-select v-model="filters.releaseLabel" placeholder="资源信息标签">
                <el-option label="全部" value=""></el-option>
                <el-option label="其他" value="0"></el-option>
                <el-option label="乙二醇" value="1"></el-option>
                <el-option label="PTA" value="2"></el-option>
                <el-option label="成品油" value="3"></el-option>
                <el-option label="PVC" value="4"></el-option>
                <el-option label="甲醇" value="5"></el-option>
                <el-option label="塑料" value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="资源区域" prop="releaseArea">
              <el-select v-model="filters.releaseArea" placeholder="资源区域">
                <el-option label="全部" value=""></el-option>
                <el-option label="东北" value="1"></el-option>
                <el-option label="华东" value="2"></el-option>
                <el-option label="华北" value="3"></el-option>
                <el-option label="华中" value="4"></el-option>
                <el-option label="华南" value="5"></el-option>
                <el-option label="西南" value="6"></el-option>
                <el-option label="西北" value="7"></el-option>
                <el-option label="西北" value="8"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="内贸外贸" prop="releaseTrade">
              <el-select v-model="filters.releaseTrade">
                <el-option label="全部" value=""></el-option>
                <el-option label="内贸" value="1"></el-option>
                <el-option label="进口" value="2"></el-option>
                <el-option label="出口" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
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
              icon="fa fa-file-excel-o"
              label=" 导出"
              type="primary"
              @click="downloadExcel"
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
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      :showDetailOperation="true"
      :showDeleteOperation="false"
      :showBatchDelete="false"
      :showEditOperation="false"
      :showStickyOperation="true"
      :showCancelStickyOperation="true"
      :showAuditOperation="true"
      :showAuditFailOperation="true"
      :showBatchAuditOperation="true"
      :showBatchAuditFailOperation="true"
      @handleSticky="handleStickyOperation"
      @handleUpStatus="handleUpStatus"
      @handleDetail="handleDetail"
      ref="CyTable"
    ></cy-table>

  </div>
</template>

<script>
  import PopupTreeInput from "@/components/PopupTreeInput";
  import CyTable from "@/views/Core/CyTable";
  import KtButton from "@/views/Core/KtButton";
  import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
  import { exportExcel } from "@/utils/excel";
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
        size: "small",
        labelPosition: 'right',
        filters: {
          id: "",//id
          title:"",//标题
          releaseType:"",//资源信息类型
          status:"",//发布状态
          sticky:"",//"置顶状态
          startTime:"",//创建开始时间
          endTime:"",//创建结束时间
          userId:"",//发布人用户id
          mobile:"",//发布人手机号
          sensitiveFlag:"",//敏感词
          browsesStart:"",//浏览量开始
          browsesEnd:"",//浏览量结束
          sharesStart:"",//分享数开始
          sharesEnd:"",//分享数结束
          releaseLabel:"",//资源信息标签
          releaseArea:"",//资源区域
          releaseTrade:"",//内贸外贸
          url:'/gy-resource/resource-manager/query-resource-manager',
        },
         totalSize: 0,
        columns: [],
        filterColumns: [],
        pageRequest: { pageNum: 1, pageSize: 10 },
        pageResult: {},
        options: [],
      };
    },
    methods: {
     // 获取分页数据
    findPage: function() {
      let this_ = this;
      if (this_.filters == undefined || this_.filters == null) {
        this_.filters = {};
      }
      this_.filters.start = this.pageRequest.pageNum;
      this_.filters.limit = this.pageRequest.pageSize;
      
      this_.utils.request.httpUtils(this_.filters, function(
        res
      ) {
        if (res.data.rows == null) {
          res.data.rows = [];
        }
        this_.pageResult = res.data.rows;
        this_.totalSize = Number(res.data.total);
      });
    },

      // 资源类型格式化
      releaseTypeFormat: function(row, column, cellValue, index) {
        if (Number(cellValue) == 0) {
          return "出售";
        }
        return "求购";
      },
      //资源标签格式化
      resourceLabelFormat: function(row, column, cellValue, index) {
        if (Number(cellValue) == 1) {
          return "乙二醇";
        }else if (Number(cellValue) == 2) {
          return "PTA";
        }else if (Number(cellValue) == 3) {
          return "成品油";
        }else if (Number(cellValue) == 4) {
          return "PVC";
        }else if (Number(cellValue) == 5) {
          return "甲醇";
        }else if (Number(cellValue) == 6) {
          return "塑料";
        }
        return "其他";
      },
      //资源区域格式化
      resourceAreaFormat: function(row, column, cellValue, index) {
        if (Number(cellValue) == 1) {
          return "东北";
        }else if (Number(cellValue) == 2) {
          return "华东";
        }else if (Number(cellValue) == 3) {
          return "华北";
        }else if (Number(cellValue) == 4) {
          return "华中";
        }else if (Number(cellValue) == 5) {
          return "华南";
        }else if (Number(cellValue) == 6) {
          return "西南";
        }else if (Number(cellValue) == 7) {
          return "西北";
        }
        return "境外";
      },
      //资源区域格式化
      resourceTradeFormat: function(row, column, cellValue, index) {
        if (Number(cellValue) == 1) {
          return "内贸";
        }else if (Number(cellValue) == 2) {
          return "进口";
        }
        return "出口";
      },
      //资源置顶状态格式化
      stickyFormat: function(row, column, cellValue, index) {
        if (Number(cellValue) == 1) {
          return "是";
        }
        return "否";
      },
      //状态格式化
      statusFormat: function(row, column, cellValue, index) {
        if (Number(cellValue) == 1) {
          return "系统审核通过";
        }else if (Number(cellValue) == 2) {
          return "待人工审核";
        }else if (Number(cellValue) == 3) {
          return "人工审核通过";
        }else if (Number(cellValue) == 4) {
          return "人工审核不通过";
        }
        return "待审核";
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
          { prop: "resourceid", label: "资源信息编码", minWidth: 100 },
          { prop: "title", label: "资源信息标题", minWidth: 130 },
          { prop: "releaseType", label: "资源信息类型", minWidth: 100,formatter:this.releaseTypeFormat },
          { prop: "resourceLabel", label: "资源信息标签", minWidth: 100, formatter: this.resourceLabelFormat},
          { prop: "resourceArea", label: "资源区域", minWidth: 80, formatter: this.resourceAreaFormat},
          { prop: "resourceTrade", label: "内贸外贸", minWidth: 80, formatter: this.resourceTradeFormat},
          { prop: "status", label: "发布状态", minWidth: 80,formatter: this.statusFormat },
          { prop: "sticky", label: "置顶状态", minWidth: 80,formatter: this.stickyFormat },
          { prop: "createTime", label: "创建时间", minWidth: 110 },
          { prop: "userId", label: "发布人用户ID", minWidth: 100 },
          { prop: "mobile", label: "发布人手机号", minWidth: 80 },
          { prop: "browses", label: "浏览量", minWidth: 60 },
          { prop: "shares", label: "分享数", minWidth: 60 },
        ];
        var temp = [];
        $.each(this.columns, function(key, val) {
          temp.push(val);
        });
        this.filterColumns = temp;
      },
      //列表下载
      downloadExcel() {
        this.$confirm("确定下载列表文件?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            exportExcel(this.pageResult.content, this.filterColumns);
          })
          .catch(() => {});
      },
      reset: function() {
        this.$refs["filters"].resetFields();
        this.$refs.CyTable.resetForm();
        this.findPage();
      },
      //置顶与取消置顶
      handleStickyOperation:function (row,type) {

      },
      //查看详情
      handleDetail:function (params) {
        this.$router.push({path:"/resource/resourceInfo",query:{resourceId:params.row.resourceid}});
      },
      //审核状态
      handleUpStatus:function (row,type) {
         
      },

      //时间判断
      checkStartTime:function(){
        debugger
        let this_ =this
        console.log(this_.filters.startTime)
        let minTime =new Date(this_.filters.startTime).getTime();
        let maxTime = new Date(this_.filters.endTime).getTime();
        if(minTime>maxTime){
           this_.$message({ message: "起始时间不能大于结束时间 ", type: "error" });
        }
      },
    },
    mounted() {
      this.initColumns();
     
    }
  };
</script>

<style scoped>
</style>
