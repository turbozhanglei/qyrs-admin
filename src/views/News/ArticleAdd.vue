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
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
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
          <el-radio v-model="platform" label="1">微信小程序</el-radio>
        </el-form-item>

        <el-form-item label="有效期" prop="validDate" required>
          <el-date-picker
            v-model="dataForm.validDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="封面图" prop="images" required>
          <el-upload
            class="upload-demo"
            :action="imgUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :before-upload="beforeArticleUpload"
            :on-success="handleArticleSuccess"
            :file-list="fileList"
            list-type="picture-card"
            :limit="imageSizeLimit"
            :accept="imageAccept"
          >
            <!--<el-button size="small" type="primary">点击上传</el-button>-->
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb;建议尺寸：750 * 400PX，预览封面图不会出现在文章内容中</div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" hieght="80%" :src="dialogImageUrl" alt="">
          </el-dialog>
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
            imgUpload: this.utils.getUpLoadHost(),
            size: "small",
            articleId: this.$route.params.articleId,
            labelPosition: 'right',
            dataFormRules: {
              title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
              categoryId: [{ required: true, message: "请选择所属分类", trigger: "blur" }],
              validDate:[{ required: true, message: "有效期不能为空", trigger: "blur" }],
              images:[{ required: true, message: "请上传封面图", trigger: "blur" }],
            },
            // fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
            fileList:[],
            // 新增编辑界面数据
            dataForm: {
              id:"",
              title: "",
              categoryId: "",
              platform: "1",
              startDate: "",
              endDate: "",
              describes: "",
              content: "",
              validDate:"",
              images:""
            },
            dialogImageUrl: '',
            dialogVisible: false,
            platform:"1",
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
                  [{ 'size': ['12px', '14px', false ,'18px', '22px', '26px', '30px', '36px', '42px']  }],
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'font': ['Microsoft-YaHei','SimSun', 'SimHei','KaiTi','Arial'] }],
                  [{ 'align': [] }],
                  ['clean'],
                  ['image']
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
          if (fileList && fileList.length == 0){
            this.dataForm.images = '';
          }
        },
        //上传图片成功
        handleArticleSuccess:function (res, file) {
          if (res && res.code == '0000' && res.data && res.data.imgUrl){
            this.dataForm.images = res.data.imgUrl;
            this.fileList.push(res.data.imgUrl)
          }
          this.$message({
            message: '上传成功!',
            type: 'success'
          });
        },
        //上传图片校验
        beforeArticleUpload(file) {
          var size = 2, this_ = this;
          const isLt2M = file.size / 1024 / 1024 < size;
          if (!isLt2M) {
            this_.$message.error("上传图片大小不能超过" + size + " MB!");
          }
          //jpg,jpeg,png,JPG,JPEG
          const isJPG =
            file.type === "image/jpeg" ||
            file.type === "image/png" ||
            file.type === "image/jpg" ||
            file.type === "image/JPG" ||
            file.type === "image/JPEG" ||
            file.type === "image/PNG";
          if (!isJPG) {
            this_.$message.error("上传图片只能是jpeg、png、jpg、JPG、JPEG、PNG 格式!");
          }
        },
        handlePreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        },
        handleExceed:function () {
          this.$alert('最多上传一张', '警告', {
            confirmButtonText: '确定'
          });
        },
        submitForm:function () {
          var this_=this
          this_.$refs.dataForm.validate(valid => {
            if (valid) {
              this_.editLoading = true;
              if(this_.dataForm.describes==""){
                if(this_.dataForm.content.length>=54){
                  this_.dataForm.describes=this_.dataForm.content .replace(/<[^>]+>/g, "").slice(0,54)
                }else{
                  this_.dataForm.describes=this_.dataForm.content .replace(/<[^>]+>/g, "")
                }
              }
              if (this_.dataForm.validDate && this_.dataForm.validDate.length > 0){
                this_.dataForm.startDate = this_.dataForm.validDate[0];
                this_.dataForm.endDate = this_.dataForm.validDate[1];
              }

              let params = Object.assign({}, this_.dataForm);

              params.t="newsArticle"
              this_.utils.request.editUserInfo(params, this_.editInfoBack);
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
          this.$router.push({path:"/news/newsArticle"});
          this.dataForm={
              title: "",
              categoryId: "",
              platform: "1",
              startDate: "",
              endDate: "",
              desc: "",
              content: "",
            validDate:"",
          }
        },
        queryUserList(){
          var that=this;
          let params={}
          params.t="newsArticle"
          params.sql="queryCategorys"
          this.utils.request.queryUserList(params,function(data){
            that.categorys=data.data
            if(that.articleId!=null || that.articleId!=''){
              that.queryArticleById()
            }
          })
        },
        queryArticleById(){
          if(this.articleId!=0){
            var this_=this;
            let params={}
            params.t="newsArticle"
            params.articleId=this_.articleId
            this.utils.request.queryUserInfo(params,function(data){
              if (data && data.data && data.code == '0000'){
                this_.dataForm = {
                  id:data.data.id,
                  title: data.data.title,
                  describes: data.data.describes,
                  content: data.data.content,
                  categoryId: data.data.categoryId,
                  images: data.data.images,
                  platform:"1",
                  startDate:data.data.start_date,
                  endDate:data.data.end_date,
                  validDate:[data.data.startDate,data.data.endDate],
                }
                if(data.data.images!=null || data.data.images!=""){
                  let imgUrl={}
                  imgUrl.name = 1;
                  imgUrl.url = data.data.images;
                  this_.fileList.push(imgUrl)
                }
              }else {
                this_.$message.error(data.msg || '获取详情失败!');
              }

            })
          }
        },
        checkDate:function () {
          let this_=this
          if(this.dataForm.startDate>=this.dataForm.endDate){
            this_.$message({ message: "开始时间不能大于结束时间", type: "error" });
            this_.dataForm.endDate="";
          }
        }
      },
      mounted() {
        this.queryUserList();

      }
    }
</script>

<style scoped>

</style>
