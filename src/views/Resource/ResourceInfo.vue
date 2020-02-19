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
              <el-form-item prop="issurePhone" label="发布人手机号:">
                <span>{{filters.issurePhone}}</span>
              </el-form-item>
            </div></el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="issureUserId" label="发布人用户ID:">
                <span>{{filters.issureUserId}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="resourceId" label="资源信息编码:">
                <span>{{filters.resourceId}}</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="60">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="resourceTitle" label="资源信息标题:">
                <span>{{filters.resourceTitle}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="resourceType" label="资源信息类型:">
               {{releaseTypeFormat(filters.resourceType)}}
              </el-form-item>
            </div></el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="issureStatus" label="发布状态:">
                <span>{{statusFormat(filters.issureStatus)}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="topStatus" label="置顶状态:">
                <span>{{stickyFormat(filters.topStatus)}}</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="60">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="browseNum" label="浏览量:">
                <span>{{filters.browseNum}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="shareNum" label="分享数:">
                <span>{{filters.shareNum}}</span>
              </el-form-item>
            </div></el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="checkAccount" label="审核人账号:">
                <span>{{filters.checkAccount}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="checkDate" label="审核时间:">
                <span>{{filters.checkDate}}</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="60">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="resourceLabel" label="资源信息标签:">
                <span>{{resourceLabelFormat(filters.resourceLabel)}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="resourceArea" label="资源区域:">
                <span>{{resourceAreaFormat(filters.resourceArea)}}</span>
              </el-form-item>
            </div></el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item prop="tradeType" label="内贸外贸:">
                <span>{{resourceTradeFormat(filters.tradeType)}}</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item prop="resourceContent" label="内容:">
                <span>{{filters.resourceContent}}</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button type="danger" v-if="filters.issureStatus === '1' || filters.issureStatus === '3' || filters.issureStatus === '0'" @click="updateStatus(4)">审核不通过</el-button>
            <el-button type="success" v-if="filters.issureStatus === '0' || filters.issureStatus === '2' || filters.issureStatus === '4'" @click="updateStatus(3)">审核通过</el-button>
            <el-button type="success" v-if="filters.topStatus === '0'&&(filters.issureStatus==='1'||filters.issureStatus==='3')" @click="updateSticky(1)">置顶</el-button>
            <el-button type="info" v-if="filters.topStatus === '1' &&(filters.issureStatus==='1'||filters.issureStatus==='3')" @click="updateSticky(0)">取消置顶</el-button>
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
          createTime: "",//创建时间
          issurePhone:"",//手机号
          issureUserId:"",//发布人用户id
          issureNickName:"",//id
          resourceTitle:"",//标题
          resourceType:"",//资源类型
          issureStatus:"",//状态
          topStatus:"",//置顶
          browseNum:"",//浏览量
          shareNum:"",//分享数
          checkAccount:"",//审核人账号
          checkDate:"",//审核时间
          resourceLabel:"",//资源标签
          resourceArea:"",//资源区域
          tradeType:"",//内贸外贸
          resourceContent:"",//内容
          resourceId: this.$route.params.resourceId,
          
        },
        resourceId: this.$route.params.resourceId,
      };
    },
    methods: {
      //页面初始化
       queryResourceDetail(){
  
        let this_=this
      let params  = {}
      params.resourceId=this_.resourceId
      this.utils.request.queryResourceDetail(params,function(res){
         res.data.resourceId=this_.resourceId
         this_.filters=res.data
       })

    },
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
      this.queryResourceDetail()
    }
  };
</script>

<style scoped>
</style>
