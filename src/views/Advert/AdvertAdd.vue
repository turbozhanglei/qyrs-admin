<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form
        :model="dataForm"
        label-width="130px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
        style="margin-bottom: 100px"
      >
        <el-form-item label="广告位名称" prop="name" required>
          <el-input v-model="dataForm.name" max-length="32" show-word-limit placeholder="广告位名称不能位空,不能包含特殊字符,限制在32个字符以内" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="广告位页面设置" prop="pageType" required>
          <el-select v-model="dataForm.pageType" placeholder="广告位页面">
            <el-option label="全部" value=""></el-option>
            <el-option label="首页" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告位标识" prop="code" required>
          <el-input v-model="dataForm.code" placeholder="广告位唯一的标识符，随意修改后可能导致广告位广告不生效" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="素材类型" prop="type" required>
          <el-checkbox-group v-model="dataForm.type">
            <el-checkbox label="0">文字</el-checkbox>
            <el-checkbox label="1">图片
              <el-form-item v-if="dataForm.type && dataForm.type.length>0 && (dataForm.type[0] ==1 ||dataForm.type[1] ==1 )" label="图片高度" prop="height">
                <el-input v-model="dataForm.height" auto-complete="off"></el-input>PX
              </el-form-item>
              <el-form-item v-if="dataForm.type && dataForm.type.length>0 && (dataForm.type[0] ==1 ||dataForm.type[1] ==1 )" label="图片宽度" prop="width">
                <el-input v-model="dataForm.width" auto-complete="off"></el-input>PX
              </el-form-item>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="广告位显示个数" prop="num">
          <el-input v-model="dataForm.num" placeholder="该广告位广告在前台的显示数" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="dataForm.status" label="0">启用</el-radio>
          <el-radio v-model="dataForm.status" label="1">关闭</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="go">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import ElRadio from "element-ui/packages/radio/src/radio";
  export default {
    components: {
      ElRadio,
    },
    name: "article-add",
    data(){
      return {
        size: "small",
        labelPosition: 'right',
        dataFormRules: {
          name: [{ required: true, message: "请输入广告名称", trigger: "blur" }],
          pageType: [{ required: true, message: "请选择广告页面类型", trigger: "blur" }],
          code: [{ required: true, message: "请输入广告位标识", trigger: "blur" }],
          type: [{ required: true, message: "素材类型至少选择一种", trigger: "blur" }],
        },
        // 新增编辑界面数据
        dataForm: {
          name: "",
          pageType: "",
          code: "",
          type:[],
          num: "",
          status: "0",
        },

        editLoading: false,

      }
    },
    methods:{

      submitForm:function () {
        this.$refs.dataForm.validate(valid => {});
      },
      go:function () {
        this.$router.go(-1);
      }
    }
  }
</script>

<style scoped>

</style>
