<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;width: 100%">
      <el-form :model="filters" ref="filters" label-width="100px">
        <el-row :gutter="60">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="createTime" label="创建时间:">
                <span>{{filters.createTime}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="mobile" label="发布人手机号:">
                <span>{{filters.mobile}}</span>
              </el-form-item>
            </div></el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="userId" label="发布人用户ID:">
                <span>{{filters.userId}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="id" label="资源信息编码:">
                <span>{{filters.id}}</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="60">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="title" label="资源信息标题:">
                <span>{{filters.title}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="releaseType" label="资源信息类型:">
                <span>出售</span>
              </el-form-item>
            </div></el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="status" label="发布状态:">
                <span>{{statusFormat(filters.status)}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="sticky" label="置顶状态:">
                <span>{{stickyFormat(filters.sticky)}}</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="60">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="browses" label="浏览量:">
                <span>{{filters.browses}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="shares" label="分享数:">
                <span>{{filters.shares}}</span>
              </el-form-item>
            </div></el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="auditor" label="审核人账号:">
                <span>{{filters.auditor}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="auditTime" label="审核时间:">
                <span>{{filters.auditTime}}</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="60">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="releaseLabel" label="资源信息标签:">
                <span>{{resourceLabelFormat(filters.releaseLabel)}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="releaseArea" label="资源区域:">
                <span>{{resourceAreaFormat(filters.releaseArea)}}</span>
              </el-form-item>
            </div></el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="releaseTrade" label="内贸外贸:">
                <span>{{resourceTradeFormat(filters.releaseTrade)}}</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item prop="content" label="内容:">
                <span>{{filters.content}}</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button type="danger" v-if="filters.status ==1 || filters.status ==3 || filters.status ==0" @click="updateStatus(4)">审核不通过</el-button>
            <el-button type="success" v-if="filters.status ==0 || filters.status ==2 || filters.status ==4" @click="updateStatus(3)">审核通过</el-button>
            <el-button type="success" v-if="filters.sticky == 1" @click="updateSticky(0)">置顶</el-button>
            <el-button type="info" v-if="filters.sticky == 0" @click="updateSticky(1)">取消置顶</el-button>
            <el-button type="primary"  @click="go()">返回</el-button>
          </el-form-item>

        </el-row>
      </el-form>
    </div>

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
      KtButton,
      TableColumnFilterDialog
    },
    data() {
      return {
        size: "small",
        filters: {
          createTime: "2016-08-09 15:56:00",//创建时间
          mobile:"15298798827",//手机号
          userId:"1231232432",//发布人用户id
          id:"50434234230",//id
          title:"备战开学季 全民半价购",//标题
          releaseType:"1",//资源类型
          status:"1",//状态
          sticky:"0",//置顶
          browses:"234",//浏览量
          shares:"232",//分享数
          auditor:"客服",//审核人账号
          auditTime:"2016-08-09 15:56:00",//审核时间
          releaseLabel:"1",//资源标签
          releaseArea:"3",//资源区域
          releaseTrade:"1",//内贸外贸
          content:"sdqqwe胜多负少防守打法",//内容
        },
        resourceId: this.$route.query.resourceId,
      };
    },
    methods: {
      //审核状态
      updateStatus:function (status) {

      },
      //置顶
      updateSticky:function () {

      },
      //状态格式化
      statusFormat: function(cellValue) {
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
      // 资源类型格式化
      releaseTypeFormat: function(row, column, cellValue, index) {
        if (Number(cellValue) == 0) {
          return "出售";
        }
        return "求购";
      },
      //资源标签格式化
      resourceLabelFormat: function(cellValue) {
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
      resourceAreaFormat: function(cellValue) {
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
      resourceTradeFormat: function(cellValue) {
        if (Number(cellValue) == 1) {
          return "内贸";
        }else if (Number(cellValue) == 2) {
          return "进口";
        }
        return "出口";
      },
      //资源置顶状态格式化
      stickyFormat: function(cellValue) {
        if (Number(cellValue) == 1) {
          return "是";
        }
        return "否";
      },
      go:function () {
        this.$router.go(-1);
      }

    },
    mounted() {
    }
  };
</script>

<style scoped>
</style>
