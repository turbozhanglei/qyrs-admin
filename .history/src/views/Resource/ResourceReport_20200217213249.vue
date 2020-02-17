<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" :label-position="labelPosition">
        <el-form-item prop="startTime" label="日期">
          <el-date-picker
            v-model="filters.startTime"
            type="date"
            placeholder="开始时间" @change ="checkStartTime()">
          </el-date-picker>
          至
          <el-date-picker
            v-model="filters.endTime"
            type="date"
            placeholder="结束时间"  @change="checkEndTime()">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="yesterday">
          <el-button type="primary"
                     v-model="filters.yesterday"
                     @click="$refs.CyTable.findPageBeforeRestPages(filters)"
                     plain>昨日</el-button>
        </el-form-item>
        <el-form-item prop="weeks">
          <el-button type="primary"
                     v-model="filters.weeks"
                     @click="$refs.CyTable.findPageBeforeRestPages(filters)"
                     plain>近7天</el-button>
        </el-form-item>
        <el-form-item prop="months">
          <el-button type="primary"
                     v-model="filters.months"
                     @click="$refs.CyTable.findPageBeforeRestPages(filters)"
                     plain>近30天</el-button>
        </el-form-item>
        <el-form-item prop="type" label="资源信息排序">
          <el-select v-model="filters.type" placeholder="资源信息排序">
            <el-option
              v-for="item in sorts"
              :key="item.type"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="mobile" label="发布人手机号">
          <el-input v-model="filters.mobile" placeholder="发布人手机号" clearable></el-input>
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
      permsEdit="sys:user:edit"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      :showOperation="false"
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
          startTime: "",//开始时间
          endTime:"",//结束时间
          type:"",//排序类型
          mobile:"",//手机号
          yesterday:"",//昨日
          weeks:"",//近7天
          months:"",//近30天
        },
        columns: [],
        filterColumns: [],
        pageRequest: { pageNum: 1, pageSize: 10 },
        pageResult: {},

        options: [],
        sorts:[
          {
            type:1,
            name:'浏览量从大到小'
          },
          {
            type:2,
            name:'分享数从大到小'
          },
          {
            type:3,
            name:'拨打电话数从大到小'
          }
        ],
      };
    },
    methods: {

      //时间判断
      //时间判断
      checkStartTime:function(){
        
        let this_ =this
        console.log(this_.filters.startTime)
        let minTime =new Date(this_.filters.startTime).getTime();
        let maxTime = new Date(this_.filters.endTime).getTime();
        if(minTime>maxTime){
           this_.$message({ message: "起始时间不能大于结束时间 ", type: "error" });
           this_.filters.startTime=''
        }
      },

      checkEndTime:function(){
        let this_=this
        let minTime =new Date(this_.filters.startTime).getTime();
        let maxTime = new Date(this_.filters.endTime).getTime();
         if(maxTime<minTime){
           this_.$message({ message: "结束时间不能小于起始时间 ", type: "error" });
            this_.filters.endTime=''
        }
      },
      // 获取分页数据
      findPage: function(data) {
        let pageResult=[
          {resourceid:1,title:'备战开学季 全民半价购',releaseType:1,resourceLabel:1,resourceArea:1,resourceTrade:1,status:1,sticky:1,createTime:'2020-01-05 20:00:00',userId:2131231,mobile:15298798827,browses:22,shares:23,telphones:54},
          {resourceid:13,title:'备战开学季 全民半价购',releaseType:0,resourceLabel:2,resourceArea:2,resourceTrade:2,status:2,sticky:0,createTime:'2020-01-05 20:00:00',userId:2131231,mobile:15298798827,browses:22,shares:23,telphones:54},
          {resourceid:14,title:'备战开学季 全民半价购',releaseType:1,resourceLabel:3,resourceArea:3,resourceTrade:3,status:3,sticky:1,createTime:'2020-01-05 20:00:00',userId:2131231,mobile:15298798827,browses:22,shares:23,telphones:54},
          {resourceid:15,title:'备战开学季 全民半价购',releaseType:0,resourceLabel:4,resourceArea:4,resourceTrade:1,status:4,sticky:0,createTime:'2020-01-05 20:00:00',userId:2131231,mobile:15298798827,browses:22,shares:23,telphones:54},
          {resourceid:16,title:'备战开学季 全民半价购',releaseType:1,resourceLabel:5,resourceArea:5,resourceTrade:2,status:1,sticky:1,createTime:'2020-01-05 20:00:00',userId:2131231,mobile:15298798827,browses:22,shares:23,telphones:54},
          {resourceid:17,title:'备战开学季 全民半价购',releaseType:0,resourceLabel:6,resourceArea:7,resourceTrade:3,status:2,sticky:0,createTime:'2020-01-05 20:00:00',userId:2131231,mobile:15298798827,browses:22,shares:23,telphones:54},
          {resourceid:18,title:'备战开学季 全民半价购',releaseType:1,resourceLabel:7,resourceArea:6,resourceTrade:1,status:3,sticky:1,createTime:'2020-01-05 20:00:00',userId:2131231,mobile:15298798827,browses:22,shares:23,telphones:54},
          {resourceid:19,title:'备战开学季 全民半价购',releaseType:0,resourceLabel:8,resourceArea:8,resourceTrade:2,status:4,sticky:0,createTime:'2020-01-05 20:00:00',userId:2131231,mobile:15298798827,browses:22,shares:23,telphones:54},
          {resourceid:20,title:'备战开学季 全民半价购',releaseType:1,resourceLabel:1,resourceArea:1,resourceTrade:3,status:1,sticky:1,createTime:'2020-01-05 20:00:00',userId:2131231,mobile:15298798827,browses:22,shares:23,telphones:54},
          {resourceid:21,title:'备战开学季 全民半价购',releaseType:0,resourceLabel:2,resourceArea:2,resourceTrade:1,status:2,sticky:0,createTime:'2020-01-05 20:00:00',userId:2131231,mobile:15298798827,browses:22,shares:23,telphones:54},
          {resourceid:31,title:'备战开学季 全民半价购',releaseType:1,resourceLabel:3,resourceArea:3,resourceTrade:2,status:3,sticky:1,createTime:'2020-01-05 20:00:00',userId:2131231,mobile:15298798827,browses:22,shares:23,telphones:54},
        ];
        this.$refs.CyTable.findPage({ content: pageResult, total: 11 });
      },

      // 菜单树选中
      deptTreeCurrentChangeHandle(data, node) {
        console.log(data);
        this.dataForm.deptid = data.id;
        this.dataForm.deptname = data.dept_name;
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
          { prop: "telphones", label: "拨打电话数", minWidth: 60 },
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
      }
    },
    mounted() {
      this.initColumns();
    }
  };
</script>

<style scoped>
</style>
