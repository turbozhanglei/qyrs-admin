<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :model="filters" ref="filters" label-width="80px">
        <el-row :gutter="80">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="nickname" label="头像:">
                <div class="block">
                  <el-avatar :size="50" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="userId" label="性别:">
                <span>男</span>
              </el-form-item>
            </div></el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="mobile" label="粉丝数">
                <span>500</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="80">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="nickname" label="手机号:">
                <div class="block">
                  <span>15298798827</span>
                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="userId" label="公司名称:">
                <span>国烨集团</span>
              </el-form-item>
            </div></el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="mobile" label="公司地址">
                <span>上海上海市浦东新区春申大厦</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="80">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="nickname" label="昵称:">
                <span>昵称昵称</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="userId" label="用户ID:">
                <span>16245345435345</span>
              </el-form-item>
            </div></el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item prop="mobile" label="注册来源">
                <span>小程序</span>
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
      userId: this.$route.query.categoryId,
    };
  },
  methods: {
  },
  mounted() {
  }
};
</script>

<style scoped>
</style>
