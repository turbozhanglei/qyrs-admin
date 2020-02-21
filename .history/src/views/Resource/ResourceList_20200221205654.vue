<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;width: 100%">
      <el-form
        :inline="true"
        :model="filters"
        :size="size"
        ref="filters"
        :label-position="labelPosition"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="资源信息编码" prop="resourceId">
              <el-input v-model="filters.resourceId" placeholder="资源信息编码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资源信息标题" prop="resourceTitle">
              <el-input v-model="filters.resourceTitle" placeholder="资源信息标题" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源信息类型" prop="resourceType">
              <el-select v-model="filters.resourceType" placeholder="资源信息类型">
                <!-- <el-option label="全部" value=""></el-option>
                <el-option label="出售" value="0"></el-option>
                <el-option label="求购" value="1"></el-option>-->
                <el-option
                  v-for="item in pushTypes"
                  :key="item.dictionaryValue"
                  :label="item.dictionaryValue"
                  :value="item.dictionaryKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="发布状态" prop="issureStatus">
              <el-select
                v-model="filters.issureStatus"
                placeholder="发布状态"
                style="padding-left: 28px;"
              >
                <el-option label="全部" value></el-option>
                <el-option label="待审核" value="0"></el-option>
                <el-option label="系统审核通过" value="1"></el-option>
                <el-option label="待人工审核" value="2"></el-option>
                <el-option label="人工审核通过" value="3"></el-option>
                <el-option label="人工审核不通过" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="置顶状态" prop="topStatus">
              <el-select v-model="filters.topStatus" placeholder="置顶状态" style="padding-left: 28px;">
                <el-option label="全部" value></el-option>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="createStartTime" >
              <el-date-picker
              style="width:209px;margin-left: 28px;"
                v-model="filters.createStartTime"
                type="date"
                placeholder="开始时间"
                @change="checkStartTime()"
                value-format="yyyy-MM-dd"
              ></el-date-picker>至
            </el-form-item>
            <el-form-item prop="createEndTime">
              <el-date-picker
                v-model="filters.createEndTime"
                type="date"
                placeholder="结束时间"
                @change="checkEndTime()"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item prop="issureId" label="发布人用户id">
              <el-input v-model="filters.issureId" placeholder="发布人用户id"  style="width:209px;padding-left: 3px;" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="issurePhone" label="发布人手机号">
              <el-input v-model="filters.issurePhone" placeholder="发布人手机号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="敏感词" prop="sensitiveCode">
              <el-select
                v-model="filters.sensitiveCode"
                placeholder="敏感词"
                style="padding-left: 42px;"
              >
                <el-option label="全部" value></el-option>
                <el-option label="含有敏感词" value="1"></el-option>
                <el-option label="不含敏感词" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item prop="browseStartNum" label="浏览量">
              <el-input v-model="filters.browseStartNum" clearable style="width: 90px;padding-left: 42px;"></el-input>—
            </el-form-item>
            <el-form-item prop="browseEndNum">
              <el-input v-model="filters.browseEndNum" clearable style="width: 90px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="shareStartNum" label="分享数">
              <el-input v-model="filters.shareStartNum" clearable style="width: 90px;padding-left: 42px;  "></el-input>—
            </el-form-item>
            <el-form-item prop="shareEndNum">
              <el-input v-model="filters.shareEndNum" clearable style="width: 91px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源信息标签" prop="resourceLabel">
              <el-select v-model="filters.resourceLabel" placeholder="资源信息标签">
                <el-option
                  v-for="item in resourceLabel"
                  :key="item.dictionaryValue"
                  :label="item.dictionaryValue"
                  :value="item.dictionaryKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="资源区域" prop="resourceArea">
              <el-select v-model="filters.resourceArea" placeholder="资源区域" style="padding-left:27px">
                <el-option
                  v-for="item in resourceArea"
                  :key="item.dictionaryValue"
                  :label="item.dictionaryValue"
                  :value="item.dictionaryKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="内贸外贸" prop="tradeType">
              <el-select v-model="filters.tradeType" style="padding-left:27px">
                <el-option
                  v-for="item in resourceTrade"
                  :key="item.dictionaryValue"
                  :label="item.dictionaryValue"
                  :value="item.dictionaryKey"
                ></el-option>
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
              @click=" findPage()"
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
import CyTable from "@/views/Core/ResourceTable";
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
      labelPosition: "right",
      filters: {
        resourceId: "", //id
        resourceTitle: "", //标题
        resourceType: "", //资源信息类型
        issureStatus: "", //发布状态
        topStatus: "", //"置顶状态
        createStartTime: "", //创建开始时间
        createEndTime: "", //创建结束时间
        issureId: "", //发布人用户id
        mobile: "", //发布人手机号
        issurePhone: null,
        sensitiveCode: "", //敏感词
        browseStartNum: "", //浏览量开始
        browseEndNum: "", //浏览量结束
        shareStartNum: "", //分享数开始
        shareEndNum: "", //分享数结束
        resourceLabel: "", //资源信息标签
        resourceArea: "", //资源区域
        tradeType: "", //内贸外贸
        url: "/gy-resource/resource-manager/query-resource-manager"
      },

      //发布类型
      pushTypes: [],
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      options: [],
      //资源信息标签
      resourceLabel: [],
      //资源区域
      resourceArea: [],
      //内贸外贸
      resourceTrade: []
    };
  },
  methods: {
    //时间判断
    checkStartTime: function() {
      let this_ = this;
      console.log(this_.filters.startTime);
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
    findPage: function() {
      //
      this.$refs.CyTable.findPage(this.filters);
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
    //内贸外贸
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
        { prop: "resourceTitle", label: "资源信息标题", minWidth: 130 },
        {
          prop: "resourceType",
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
          prop: "tradeType",
          label: "内贸外贸",
          minWidth: 80,
          formatter: this.resourceTradeFormat
        },
        {
          prop: "issureStatus",
          label: "发布状态",
          minWidth: 80,
          formatter: this.statusFormat
        },
        {
          prop: "topStatus",
          label: "置顶状态",
          minWidth: 80,
          formatter: this.stickyFormat
        },
        { prop: "createTime", label: "创建时间", minWidth: 110 },
        { prop: "issureId", label: "发布人用户ID", minWidth: 100 },
        { prop: "issurePhone", label: "发布人手机号", minWidth: 80 },
        { prop: "browseNum", label: "浏览量", minWidth: 60 },
        { prop: "shareNum", label: "分享数", minWidth: 60 }
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
          this.utils.request.downResourceExcel(this_.filters, function(data) {
            if ((data.code = "0000")) {
              //   this_.$message({ message: "下载成功 ", type: "success" });
              //   //  data.data.blob()
              //   //  console("******"+ data.data.blob());
              //   // var file = new File([data.data], "cesss.xlsx", { type: 'application/force-download' });
              //   // let blobUrl = URL.createObjectURL(file);
              //   const blob = new Blob([data.data]);
              //  const blobUrl = window.URL.createObjectURL(blob);

              //   this_.download(blobUrl);

              const req = new XMLHttpRequest();
              let trueUrl = this_.utils.getBaseUrl();
              req.open(
                "POST",
                trueUrl + "/gy-resource/resource-manager/download-resource",
                true
              );
              // req.open('POST', 'http://localhost:8087/gy-resource/resource-manager/download-resource', true);
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
      a.download = "资源列表.xlsx";
      a.href = blobUrl;
      a.click();
      document.body.removeChild(a);
    },

    reset: function() {
      this.$refs["filters"].resetFields();
      this.$refs.CyTable.resetForm();
      this.findPage();
    },
    //置顶与取消置顶
    handleStickyOperation: function(row, type) {
      let params = {};
      if (row.type == 1) {
        //判断按钮
        params.topStatus = "1";
        params.resourceIdList = row.row.resourceId;
        params.operaId = null;
        params.token = localStorage.getItem("token");
        let this_ = this;
        this.utils.request.setResourceTop(params, function(data) {
          if ((data.code = "0000")) {
            this_.$message({ message: "置顶成功 ", type: "success" });
            this_.findPage();
          } else {
            this_.$message({ message: "置顶失败 ", type: "error" });
            this_.findPage();
          }
        });
      } else if (row.type == 0) {
        params.topStatus = "0";
        params.resourceIdList = row.row.resourceId;
        params.operaId = null;
        params.token = localStorage.getItem("token");
        let this_ = this;
        this.utils.request.cancelResourceTop(params, function(data) {
          if ((data.code = "0000")) {
            this_.$message({ message: "取消置顶成功 ", type: "success" });
            this_.findPage();
          } else {
            this_.$message({ message: "取消置顶失败 ", type: "error" });
            this_.findPage();
          }
        });
      }
    },
    //查看详情
    handleDetail: function(params) {
      this.$router.push({
        path: "/resource/resourceInfo/" + params.row.resourceId
      });
    },
    //审核状态
    handleUpStatus: function(row, type) {
      let params = {};
      if (row.params.length > 1) {
        //批量审核通过
        if (row.type == 3) {
          params.checkStatus = "3";

          params.resourceIdList = [];
          for (var i in row.params) {
            params.resourceIdList.push(row.params[i].id);
          }

          params.checkUserId = null;
        } else if (row.type == 4) {
          //批量审核不通过
          params.checkStatus = "4";
          params.resourceIdList = [];
          for (var i in row.params) {
            params.resourceIdList.push(row.params[i].id);
          }

          params.checkUserId = null;
        }
        let this_ = this;
        this.utils.request.batchUpStatus(params, function(data) {
          if ((data.code = "0000")) {
            this_.$message({ message: "修改成功 ", type: "success" });
            this_.findPage();
          }
        });
      } else {
        if (row.type === 0 || row.type == 2 || row.type == 4) {
          params.checkStatus = "4";
          params.resourceIdList = row.params[0].id;
          params.checkUserId = null;
        } else if (row.type == 1 || row.type == 3) {
          params.checkStatus = "3";
          params.resourceIdList = row.params[0].id;

          params.checkUserId = null;
        }
        //  else {
        //
        // }
        let this_ = this;
        this.utils.request.handleUpStatus(params, function(data) {
          if ((data.code = "0000")) {
            this_.$message({ message: "修改成功 ", type: "success" });
            this_.findPage();
          }
        });
      }
    },

    //发布类型初始化
    ininPushType: function() {
      let this_ = this;
      let params = {};
      params.code = "release_type";
      this.utils.request.queryDictionry(params, function(res) {
        this_.pushTypes = res.data;
      });
    },
    //资源信息标签初始化
    initResourceLabel: function() {
      let this_ = this;
      let params = {};
      params.code = "resource_label";
      this.utils.request.queryDictionry(params, function(res) {
        this_.resourceLabel = res.data;
      });
    },

    //资源区域初始化
    initResourceArea: function() {
      let this_ = this;
      let params = {};
      params.code = "resource_area";
      this.utils.request.queryDictionry(params, function(res) {
        this_.resourceArea = res.data;
      });
    },

    //内贸外贸初始化
    initresourceTrade: function() {
      let this_ = this;
      let params = {};
      params.code = "resource_trade";
      this.utils.request.queryDictionry(params, function(res) {
        this_.resourceTrade = res.data;
      });
    }
  },
  mounted() {
    this.initColumns();
    this.ininPushType();
    this.initResourceLabel();
    this.initResourceArea();
    this.initresourceTrade();
  }
};
</script>

<style scoped>
</style>
