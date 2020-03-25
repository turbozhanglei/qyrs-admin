<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;width: 100%">
      <el-form :model="filters" ref="filters" label-width="80px">
        <el-row :gutter="80">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="head_pic" label="头像:">
                <div class="block">
                  <el-avatar :size="50" :src="filters.head_pic"></el-avatar>
                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="sex" label="性别:">
                <span>{{filters.sec}}</span>
              </el-form-item>
            </div></el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="fens" label="粉丝数:">
                <span>{{filters.fens}}</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="80">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="mobile" label="手机号:">
                <div class="block">
                  <span>{{filters.mobile}}</span>
                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="company_name" label="公司名称:">
                <span>{{filters.company_name}}</span>
              </el-form-item>
            </div></el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="company_adress" label="公司地址:">
                <span>{{filters.company_adress}}</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="80">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="nickname" label="昵称:">
                <span>{{filters.nickname}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="userId" label="用户ID:">
                <span>{{filters.id}}</span>
              </el-form-item>
            </div></el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="source" label="注册来源:">
                <span>{{filters.sources}}</span>
              </el-form-item>
            </div>
          </el-col>
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
        nickname: "",//会员昵称
        t: "sysUser",
        userId:"",//用户id
        mobile:"",//手机号
        userStatus:"",//用户状态
        startTime:"",//开始日期
        endTime:"",//结束日期
      },
      userId: this.$route.params.id,
    };
  },
  methods: {
    
    queryInfo(){
      let this_=this
      let query={};
      query.id=this.userId
      query.t='sysUser';
      this.utils.request.queryMemberInfo(query,function(res){
         this_.filters=res.data
       })
      console.log(this.userId);
    }
    
    
  },
  mounted() {
    this.queryInfo()
  }
};
</script>

<style scoped>
</style>
