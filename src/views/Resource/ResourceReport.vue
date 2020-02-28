<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form
        :inline="true"
        :model="filters"
        :size="size"
        ref="filters"
        :label-position="labelPosition"
      >
        <el-form-item prop="createStartTime" label="日期">
          <el-date-picker
            v-model="filters.createStartTime"
            type="date"
            placeholder="开始时间"
            @change="checkStartTime()"
            value-format=yyyy-MM-dd
          ></el-date-picker>
        </el-form-item>
-
        <el-form-item prop="createEndTime" label="日期">
          <el-date-picker
            v-model="filters.createEndTime"
            type="date"
            placeholder="结束时间"
            @change="checkEndTime()"
            value-format=yyyy-MM-dd
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="yesterday">
          <el-button type="primary" v-model="filters.yesterday" @click="changeYesterday(1)" plain>昨日</el-button>
        </el-form-item>
        <el-form-item prop="weeks">
          <el-button type="primary" v-model="filters.weeks" @click="changeWeeks(7)" plain>近7天</el-button>
        </el-form-item>
        <el-form-item prop="months">
          <el-button type="primary" v-model="filters.months" @click="changeMonths(30)" plain>近30天</el-button>
        </el-form-item>
        <el-form-item prop="resourceSort" label="资源信息排序">
          <el-select v-model="filters.resourceSort" placeholder="资源信息排序">
            <el-option v-for="item in sorts" :key="item.type" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="issurePhone" label="发布人手机号">
          <el-input v-model="filters.issurePhone" placeholder="发布人手机号" clearable></el-input>
        </el-form-item>
        <el-row>
          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              type="primary"
              @click="$refs.CyTable.findPage(filters)"
            />
          </el-form-item>
          <el-form-item>
            <kt-button icon="fa fa-file-excel-o" label=" 导出" type="primary" @click="downloadExcel" />
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
import CyTable from "@/views/Core/ResourceReportTable";
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
      labelPosition: "left",
      filters: {
        createStartTime: "", //开始时间
        createEndTime: "", //结束时间
        resourceSort: "", //排序类型
        issurePhone: "", //手机号
        yesterday: "", //昨日
        weeks: "", //近7天
        months: "", //近30天
        url: "/gy-resource/resource-manager/resource-report"
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      options: [],
      sorts: [
        {
          type: 1,
          name: "浏览量从大到小"
        },
        {
          type: 2,
          name: "分享数从大到小"
        },
        {
          type: 3,
          name: "拨打电话数从大到小"
        }
      ]
    };
  },
  methods: {
    //时间判断
    checkStartTime: function() {
      let this_ = this;
      console.log(this_.filters.createStartTime);
      let minTime = new Date(this_.filters.createStartTime).getTime();
      let maxTime = new Date(this_.filters.createEndTime).getTime();
      if (minTime > maxTime) {
        this_.$message({ message: "起始时间不能大于结束时间 ", type: "error" });
        this_.filters.createStartTime = "";
      }
    },

    checkEndTime: function() {
      let this_ = this;
      let minTime = new Date(this_.filters.createStartTime).getTime();
      let maxTime = new Date(this_.filters.createEndTime).getTime();
      if (maxTime < minTime) {
        this_.$message({ message: "结束时间不能小于起始时间 ", type: "error" });
        this_.filters.createEndTime = "";
      }
    },
    // 获取分页数据
    findPage: function(data) {
      if(''==this.filters.issurePhone){
        this.filters.issurePhone=null;
      }
      this.$refs.CyTable.findPage(this.filters);
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
      } else if (Number(cellValue) == 2) {
        return "PTA";
      } else if (Number(cellValue) == 3) {
        return "成品油";
      } else if (Number(cellValue) == 4) {
        return "PVC";
      } else if (Number(cellValue) == 5) {
        return "甲醇";
      } else if (Number(cellValue) == 6) {
        return "塑料";
      }
      return "其他";
    },
    //资源区域格式化
    resourceAreaFormat: function(row, column, cellValue, index) {
      if (Number(cellValue) == 1) {
        return "东北";
      } else if (Number(cellValue) == 2) {
        return "华东";
      } else if (Number(cellValue) == 3) {
        return "华北";
      } else if (Number(cellValue) == 4) {
        return "华中";
      } else if (Number(cellValue) == 5) {
        return "华南";
      } else if (Number(cellValue) == 6) {
        return "西南";
      } else if (Number(cellValue) == 7) {
        return "西北";
      }
      return "境外";
    },
    //资源区域格式化
    resourceTradeFormat: function(row, column, cellValue, index) {
      if (Number(cellValue) == 1) {
        return "内贸";
      } else if (Number(cellValue) == 2) {
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
      } else if (Number(cellValue) == 2) {
        return "待人工审核";
      } else if (Number(cellValue) == 3) {
        return "人工审核通过";
      } else if (Number(cellValue) == 4) {
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
        { prop: "resourceId", label: "资源信息编码", minWidth: 100 },
        
        {
          prop: "releaseType",
          label: "资源信息类型",
          minWidth: 100,
          formatter: this.releaseTypeFormat
        },
        {
          prop: "resourceLabel",
          label: "资源信息标签",
          minWidth: 100,
          formatter: this.resourceLabelFormat
        },
        {
          prop: "resourceArea",
          label: "资源区域",
          minWidth: 80,
          formatter: this.resourceAreaFormat
        },
        {
          prop: "resourceTrade",
          label: "内贸外贸",
          minWidth: 80,
          formatter: this.resourceTradeFormat
        },
        {
          prop: "status",
          label: "发布状态",
          minWidth: 80,
          formatter: this.statusFormat
        },
        {
          prop: "sticky",
          label: "置顶状态",
          minWidth: 80,
          formatter: this.stickyFormat
        },
        { prop: "createTime", label: "创建时间", minWidth: 110 },
        { prop: "issureUserId", label: "发布人用户ID", minWidth: 100 },
        { prop: "issurePhone", label: "发布人手机号", minWidth: 80 },
        { prop: "browseNum", label: "浏览量", minWidth: 60 },
        { prop: "shareNum", label: "分享数", minWidth: 60 },
        { prop: "phoneNum", label: "拨打电话数", minWidth: 60 }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },
    //列表下载
    downloadExcel() {
      let this_ = this;
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.utils.request.downResourceReportExcel(this_.filters, function(
            data
          ) {
            if ((data.code = "0000")) {
              this_.$message({ message: "下载成功 ", type: "success" });

              const req = new XMLHttpRequest();
              let trueUrl = this_.utils.getBaseUrl();
              req.open(
                "POST",
                trueUrl + "/gy-resource/resource-manager/download-report",
                true
              );
              req.responseType = "blob";
              req.setRequestHeader("Content-Type", "application/json");
              req.onload = function() {
                const data = req.response;
                const a = document.createElement("a");
                const blob = new Blob([data]);
                const blobUrl = window.URL.createObjectURL(blob);
                this_.download(blobUrl);
              };

              req.send(JSON.stringify(this_.filters));
            } else {
              this_.$message({ message: "下载失败 ", type: "error" });
            }
          });
        })
        .catch(() => {});
    },
    download(blobUrl) {
        const a = document.createElement("a");
        a.style.display = "none";
        a.download = "资源汇总报表.xlsx";
        a.href = blobUrl;
        a.click();
        document.body.removeChild(a);
      },
    reset: function() {
      this.$refs["filters"].resetFields();
      this.$refs.CyTable.resetForm();
      this.findPage();
    },
    //获取昨日的时间
    changeYesterday: function(num, time) {
      //n 为传入的时间 正数为之前的日期 time为传入的置顶时间，默认为当前时间

      let this_ = this;
      let n = num;
      let d = "";
      if (time) {
        d = new Date(time);
      } else {
        d = new Date();
      }
      let year = d.getFullYear();
      let mon = d.getMonth() + 1;
      let day = d.getDate();
      if (day <= n) {
        if (mon > 1) {
          mon = mon - 1;
        } else {
          year = year - 1;
          mon = 12;
        }
      }
      d.setDate(d.getDate() - n);
      year = d.getFullYear();
      mon = d.getMonth() + 1;
      day = d.getDate();
      this_.filters.createStartTime =
        year +
        "-" +
        (mon < 10 ? "0" + mon : mon) +
        "-" +
        (day < 10 ? "0" + day : day);
      let now = new Date();
      this_.filters.createEndTime =
        now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
      this_.findPage(this_.filters);
    },
    //获取近7天的时间
    changeWeeks: function(num, time) {
      let this_ = this;
      let n = num;
      let d = "";
      if (time) {
        d = new Date(time);
      } else {
        d = new Date();
      }
      let year = d.getFullYear();
      let mon = d.getMonth() + 1;
      let day = d.getDate();
      if (day <= n) {
        if (mon > 1) {
          mon = mon - 1;
        } else {
          year = year - 1;
          mon = 12;
        }
      }
      d.setDate(d.getDate() - n);
      year = d.getFullYear();
      mon = d.getMonth() + 1;
      day = d.getDate();
      this_.filters.createStartTime =
        year +
        "-" +
        (mon < 10 ? "0" + mon : mon) +
        "-" +
        (day < 10 ? "0" + day : day);
      let now = new Date();
      this_.filters.createEndTime =
        now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
      this_.findPage(this_.filters);
    },
    //获取近30天时间
    changeMonths: function(num, time) {
      let this_ = this;
      let n = num;
      let d = "";
      if (time) {
        d = new Date(time);
      } else {
        d = new Date();
      }
      let year = d.getFullYear();
      let mon = d.getMonth() + 1;
      let day = d.getDate();
      if (day <= n) {
        if (mon > 1) {
          mon = mon - 1;
        } else {
          year = year - 1;
          mon = 12;
        }
      }
      d.setDate(d.getDate() - n);
      year = d.getFullYear();
      mon = d.getMonth() + 1;
      day = d.getDate();
      this_.filters.createStartTime =
        year +
        "-" +
        (mon < 10 ? "0" + mon : mon) +
        "-" +
        (day < 10 ? "0" + day : day);
      let now = new Date();
      this_.filters.createEndTime =
        now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    }
  },
  mounted() {
    this.initColumns();
  }
};
</script>

<style scoped>
</style>
