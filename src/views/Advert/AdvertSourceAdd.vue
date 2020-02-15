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
        :disabled="isEdit == 1"
      >
        <el-form-item label="广告名称" prop="name" required>
          <el-input v-model="dataForm.name" max-length="64"  show-word-limit placeholder="限制在64个字符以内" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="素材类型" prop="type" required>
          <el-radio-group v-model="dataForm.type">
            <el-radio label="0" v-if="textType">文字</el-radio>
            <el-radio label="1" v-if="imageType">图片</el-radio>
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
        <el-form-item label="广告有效期" prop="validDate" required>
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

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="go">返回</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
          v-if="isEdit != 1"
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
      var checkContent = (rule,value,callback) =>{
        if (this.dataForm.type && this.dataForm.type == '0'){
          if (!value){
            return callback(new Error('请输入广告文本'));
          }else if(value.length < 1 || value.length >64){
            return callback(new Error('限制在64个字符以内'));
          }else {
            callback();
          }
        }else {
          callback();
        }
      };
      var checkLinkUrl = (rule,value,callback) =>{
        if (this.dataForm.type && this.dataForm.type == '1'){
          if (!value){
            return callback(new Error('请输入跳转参数'));
          }else {
            callback();
          }
        }else {
          callback();
        }
      };
      return {
        size: "small",
        labelPosition: 'right',
        dataFormRules: {
          name: [
            { required: true, message: "请输入广告名称", trigger: "blur" },
            {min: 1, max:64, message: "限制在64个字符以内",trigger:"blur"}
            ],
          linkUrl: [{ validator:checkLinkUrl, trigger: "blur" }],
          content: [{ validator:checkContent, trigger: "blur" }],
          type: [{ required: true, message: "素材类型至少选择一种", trigger: "blur" }],
          validDate:[{ required: true, message: "有效期不能为空", trigger: "blur" }],
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
          validDate:"",
          adCodeId:this.$route.params.adCodeId,
        },
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        editLoading: false,
        imageSizeLimit:1,//图片上传个数控制
        imageAccept:".jpg,.jpeg,.png,.JPG,.JPEG",//图片上传格式
        adSourceId: this.$route.params.adSourceId,
        isEdit:this.$route.params.isEdit,
        adCodeId:this.$route.params.adCodeId,//广告位id
        textType:true,
        imageType:false,
      }
    },
    methods:{

      submitForm:function () {
        this.$refs.dataForm.validate(valid => {
          if (valid){
            var this_ = this;
            if (this_.dataForm.type == '0'){
              this_.dataForm.linkUrl = '';
              this_.dataForm.imageUrl = '';
            }else {
              this_.dataForm.content = '';
            }
            if (this_.dataForm.validDate && this_.dataForm.validDate.length > 0){
              this_.dataForm.startDate = this_.dataForm.validDate[0];
              this_.dataForm.endDate = this_.dataForm.validDate[1];
            }
            this.utils.request.saveAdvertSourceInfo(this.dataForm, function(data) {
              if (data && data.code == '0000'){
                this_.$message({
                  message: '操作成功!',
                  type: 'success'
                });
                setTimeout(function () {
                  this_.$router.push({path:"/advert/advertSource/" + this_.adCodeId});
                }, 3000);
              }else {
                this_.$message.error(data.msg || '操作失败!');
              }
            });
          }else {
            console.log(valid)
          }
        });
      },
      //取消按钮，返回上一级页面
      go:function () {
        this.$router.push({path:"/advert/advertSource/" + this.adCodeId});
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
      //查询素材详情
      queryAdSourceInfo:function (id) {
        var this_ = this;
        this.utils.request.getAdvertSourceInfo({id:id}, function(data) {
          if (data && data.data && data.code == '0000'){
            this_.dataForm = {
              id:data.data.id,
              name: data.data.name,
              type: data.data.type + '',
              content: data.data.content,
              refType:"0",
              linkUrl: data.data.link_url,
              imageUrl: data.data.image_url,
              startDate:data.data.start_date,
              endDate:data.data.end_date,
              validDate:[data.data.start_date,data.data.end_date],
              adCodeId:data.data.ad_code_id,
            }
          }else {
            this_.$message.error(data.msg || '获取详情失败!');
          }
        })
      },
      //查询对应广告位信息
      queryAdvertInfo:function (id) {
        var this_ = this;
        this.utils.request.getAdvertInfo({id:id}, function(data) {
          if (data && data.data && data.code == '0000'){
            if (data.data.type && data.data.type.length > 0){
              if (data.data.type.length == 1){
                if (data.data.type == '0'){
                  this_.textType = true;
                  this_.imageType = false;
                }else if (data.data.type == '1'){
                  this_.textType = false;
                  this_.imageType = true;
                }
                this_.dataForm.type = data.data.type;
              }else {
                this_.dataForm.type = '0';
                this_.textType = true;
                this_.imageType = true;
              }
            }
          }else {
            this_.$message.error(data.msg || '获取广告位详情失败!');
          }
        })
      },
      init:function () {
        if (this.adSourceId && this.adSourceId === '0'){
          this.adSourceId = null;
        }
        if (this.isEdit && this.isEdit === '0'){
          this.isEdit = null;
        }
        this.queryAdvertInfo(this.adCodeId);
        if (this.adSourceId){
          this.queryAdSourceInfo(this.adSourceId);
        }
      }
    },
    mounted(){
      this.init();
    }
  }
</script>

<style scoped>

</style>
