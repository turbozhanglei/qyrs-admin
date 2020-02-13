<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
        style="margin-bottom: 100px"
      >
        <el-form-item label="文章标题" prop="title" required>
          <el-input v-model="dataForm.title" placeholder="文章标题" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId" required>
          <el-select v-model="dataForm.categoryId" placeholder="所属分类">
            <el-option
              v-for="item in categorys"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支持平台" prop="platform" required>
          <el-radio v-model="dataForm.platform" label="1">微信小程序</el-radio>
        </el-form-item>
        <el-form-item label="有效期" prop="startDate" required>
          <el-date-picker
            v-model="dataForm.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
          至
        </el-form-item>
        <el-form-item prop="endDate" required>
          <el-date-picker
            v-model="dataForm.endDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="封面图" prop="images">
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
        <el-form-item label="文章摘要" prop="desc">
          <el-input type="textarea" v-model="dataForm.describes" placeholder="不填写会默认抓取正文前54字" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor ref="myTextEditor" v-model="dataForm.content" class="myQuillEditor"
                        :options="editorOption"
                        style="height: 250px;"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click="closeArticleAdd">{{$t('action.cancel')}}</el-button>
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
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
    export default {
        components: {
          quillEditor
        },
        name: "article-add",
        data(){
          return {
            size: "small",
            articleId: this.$route.query.articleId,
            labelPosition: 'right',
            dataFormRules: {
              title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
              categoryId: [{ required: true, message: "请选择所属分类", trigger: "blur" }],
              startDate: [{ required: true, message: "请输入开始时间", trigger: "blur" }],
              endDate: [{ required: true, message: "请输入结束时间", trigger: "blur" }],
            },
            fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
            // 新增编辑界面数据
            dataForm: {
              title: "",
              categoryId: "",
              platform: "1",
              startDate: "",
              endDate: "",
              describes: "",
              content: "",
            },
            categorys:[
            ],
            editLoading: false,
            editorOption:{
              theme: 'snow',
              boundary: document.body,
              modules: {
                toolbar: [
                  ['bold', 'italic', 'underline', 'strike'],
                  ['blockquote', 'code-block'],
                  [{ 'header': 1 }, { 'header': 2 }],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  [{ 'script': 'sub' }, { 'script': 'super' }],
                  [{ 'indent': '-1' }, { 'indent': '+1' }],
                  [{ 'direction': 'rtl' }],
                  [{ 'size': ['small', false, 'large', 'huge'] }],
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'font': [] }],
                  [{ 'align': [] }],
                  ['clean'],
                  ['link', 'image']
                ]
              },
              placeholder: '请输入文章内容',
              readOnly: false
            },
            imageSizeLimit:1,//图片上传个数控制
            imageAccept:".jpg,.jpeg,.png,.JPG,.JPEG",//图片上传格式
          }
        },
      methods:{
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
        submitForm:function () {
          this.$refs.dataForm.validate(valid => {
            if (valid) {
              this.$confirm("确认提交吗？", "提示", {}).then(() => {
                this.editLoading = true;

                let params = Object.assign({}, this.dataForm);
                params.t="newsArticle"
                this.utils.request.editUserInfo(params, this.editInfoBack);
              });
            }
          });
        },
        // 新增修改回调
        editInfoBack: function(data) {
          if (data.code == "0000") {
            this.$message({ message: "操作成功", type: "success" });
            this.$router.push({path:"/news/newsArticle",query:{}});
          } else {
            this.$message({ message: "操作失败, " + data.msg, type: "error" });
          }
        },
        closeArticleAdd:function () {
          this.$router.push({path:"/news/newsArticle",query:{}});
          this.dataForm={
            title: "",
              categoryId: "",
              platform: "1",
              startDate: "",
              endDate: "",
              desc: "",
              content: "",
          }
        },
        queryUserList(){
          var that=this;
          let params={}
          params.t="newsArticle"
          params.sql="queryCategorys"
          this.utils.request.queryUserList(params,function(data){
            that.categorys=data.data
          })
        },
        queryArticleById(){
          if(this.articleId!=null && this.articleId!=''){
            var that=this;
            let params={}
            params.t="newsArticle"
            params.articleId=that.articleId
            this.utils.request.queryUserInfo(params,function(data){
              that.dataForm=data.data
            })
          }
        }

      },
      mounted() {
        this.queryUserList();
        if(this.articleId!=null&&this.articleId!=''){
          this.queryArticleById()
        }
      }
    }
</script>

<style scoped>

</style>
