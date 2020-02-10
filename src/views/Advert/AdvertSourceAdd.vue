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
        <el-form-item label="广告名称" prop="name" required>
          <el-input v-model="dataForm.name" max-length="64" show-word-limit placeholder="限制在64个字符以内" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="素材类型" prop="type" required>
          <el-radio-group v-model="dataForm.type">
            <el-radio label="0">文字</el-radio>
            <el-radio label="1">图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="广告文本" prop="content" v-if="dataForm.type != 1" required>
          <el-input v-model="dataForm.content" max-length="64" show-word-limit placeholder="限制在64个字符以内" auto-complete="off"></el-input>
        </el-form-item>
        <div v-if="dataForm.type != 0">
          <el-form-item label="跳转类型" prop="refType">
            <el-radio-group v-model="dataForm.refType">
              <el-radio label="0">URL</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="跳转参数" prop="linkUrl" required>
            <el-input v-model="dataForm.linkUrl" max-length="64" show-word-limit placeholder="输入正确的URL链接，如：http://www.baidu.com/" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="广告图片" prop="imageUrl">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :file-list="fileList"
              list-type="picture-card"
              :limit="imageSizeLimit"
              :accept="imageAccept"
            >
              <!--<el-button size="small" type="primary">点击上传</el-button>-->
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb;建议尺寸：750 * 400PX，预览封面图不会出现在文章内容中</div>
            </el-upload>
          </el-form-item>
        </div>
        <el-form-item label="广告有效期" prop="startDate" required>
          <el-date-picker
            v-model="dataForm.startDate"
            type="date"
            placeholder="开始时间">
          </el-date-picker>
          至
          <el-date-picker
            v-model="dataForm.endDate"
            type="date"
            placeholder="结束时间">
          </el-date-picker>
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
          type: "",
          content: "",
          refType:"0",
          linkUrl: "",
          imageUrl: "",
          startDate:"",
          endDate:"",
        },
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        editLoading: false,
        imageSizeLimit:1,//图片上传个数控制
        imageAccept:".jpg,.jpeg,.png,.JPG,.JPEG",//图片上传格式
        adSourceId: this.$route.query.adSourceId,
        isEdit:this.$route.query.isEdit,
      }
    },
    methods:{

      submitForm:function () {
        this.$refs.dataForm.validate(valid => {});
      },
      go:function () {
        this.$router.go(-1);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed:function () {
        this.$alert('最多上传一张', '警告', {
          confirmButtonText: '确定'
        });
      },
    }
  }
</script>

<style scoped>

</style>
