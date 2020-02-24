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
          <el-select v-model="dataForm.pageType" placeholder="广告位页面设置">
            <el-option label="全部" value=""></el-option>
            <el-option label="首页" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告位标识" prop="code" required>
          <el-input v-model="dataForm.code" @blur="checkAdvertByCode" placeholder="广告位唯一的标识符，随意修改后可能导致广告位广告不生效" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="素材类型" prop="adType" required>
          <el-checkbox-group v-model="dataForm.adType">
            <el-checkbox label="0">文字</el-checkbox>
            <el-checkbox label="1">图片
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <div v-if="dataForm.adType && dataForm.adType.length>0 && (dataForm.adType[0] ==1 ||dataForm.adType[1] ==1 )">
          <el-form-item label="图片高度" prop="height" required>
            <el-input v-model="dataForm.height" type="number" min="0" auto-complete="off">
              <template slot="append">PX</template>
            </el-input>
          </el-form-item>
          <el-form-item label="图片宽度" prop="width" required>
            <el-input v-model="dataForm.width" type="number" min="0" auto-complete="off">
              <template slot="append">PX</template>
            </el-input>
          </el-form-item>
          <el-form-item label="图片大小" prop="sizeLimit" required>
            <el-input v-model="dataForm.sizeLimit" type="number" min="0" auto-complete="off">
              <template slot="append"> M</template>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item label="广告位显示个数" prop="num">
          <el-input v-model="dataForm.num" type="number" min="0" placeholder="该广告位广告在前台的显示数" auto-complete="off"></el-input>
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
      var checkName = (rule,value,callback) =>{
        if (!value){
          return callback(new Error('请输入广告名称'));
        }else if (value.length < 1 || value.length >32){
          return callback(new Error('广告名称在32字符内'));
        }else if((/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im.test(value))){
          return callback(new Error('广告名称不能包含特殊字符'));
        }else {
          callback();
        }
      };
      var checkWidth = (rule,value,callback) =>{
        if (!value){
          return callback(new Error('请输入图片宽度'));
        }else if (Number(value) <= 0){
          return callback(new Error('图片宽度必须大于0'));
        }else {
          callback();
        }
      };
      var checkHeight = (rule,value,callback) =>{
        if (!value){
          return callback(new Error('请输入图片高度'));
        }else if (Number(value) <= 0){
          return callback(new Error('图片高度必须大于0'));
        }else {
          callback();
        }
      };
      var checkLimit = (rule,value,callback) =>{
        if (!value){
          return callback(new Error('请输入图片大小'));
        }else if (Number(value) <= 0){
          return callback(new Error('图片大小必须大于0'));
        }else {
          callback();
        }
      };
      var checkNum = (rule,value,callback) =>{
        if (value && Number(value) <= 0){
          return callback(new Error('显示个数必须大于0'));
        }else {
          callback();
        }
      };
      return {
        size: "small",
        labelPosition: 'right',
        dataFormRules: {
          name: [
            { validator:checkName, trigger: "blur" },
            { validator:checkName, trigger: "change" }
          ],
          pageType: [
            { required: true, message: "请选择广告页面类型", trigger: "blur" },
            { required: true, message: "请选择广告页面类型", trigger: "change" }
          ],
          code: [
            { required: true, message: "请输入广告位标识", trigger: "blur" },
            { required: true, message: "请输入广告位标识", trigger: "change" }
          ],
          adType: [
            { required: true, message: "素材类型至少选择一种", trigger: "blur" },
            { required: true, message: "素材类型至少选择一种", trigger: "change" }
          ],
          width: [
            { required: true,validator:checkWidth, trigger: "blur" },
            { required: true,validator:checkWidth, trigger: "change" }
          ],
          height: [
            { required: true,validator:checkWidth, trigger: "blur" },
            { required: true,validator:checkWidth, trigger: "change" }
          ],
          sizeLimit: [
            { required: true,validator:checkLimit, trigger: "blur" },
            { required: true,validator:checkLimit, trigger: "change" }
          ],
          num: [
            { validator:checkNum, trigger: "blur" },
            { validator:checkNum, trigger: "change" },
          ],
        },
        // 新增编辑界面数据
        dataForm:{
          name: "",
          pageType: "1",
          code: "",
          adType:[],
          type:"",
          num: "",
          status: "0",
          width:"",
          height:"",
          sizeLimit:"",
        },
        editLoading: false,
        adId:this.$route.params.id,
        checkCodeFlag:false,
      }
    },
    methods:{
      //新增或修改
      submitForm:function () {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            var this_ = this;
            if (this_.checkCodeFlag){
              this_.$message.error('该广告位标识已存在，请重新填写!');
              return;
            }
            if (this_.dataForm.adType && this_.dataForm.adType.length > 0){
              this_.dataForm.type = this_.dataForm.adType.join(',');
              if (this_.dataForm.type.indexOf('1') < 0){
                this_.dataForm.width = '';
                this_.dataForm.height = '';
                this_.dataForm.sizeLimit = '';
              }
            }
            this.utils.request.saveAdvertInfo(this.dataForm, function(data) {
              if (data && data.code == '0000'){
                this_.$message({
                  message: '操作成功!',
                  type: 'success'
                });
                setTimeout(function () {
                  this_.$router.push({path:"/advert/AdvertList"});
                }, 3000);
              }else {
                this_.$message.error(data.msg || '操作失败!');
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      queryAdvertInfo:function (id) {
        var this_ = this;
        this.utils.request.getAdvertInfo({id:id}, function(data) {
          if (data && data.data && data.code == '0000'){
            this_.dataForm = {
              id:data.data.id,
              name: data.data.name,
              pageType: '' + data.data.page_type,
              code: data.data.code,
              adType: data.data.type.split(','),
              type:"",
              num: data.data.num,
              status: '' + data.data.status,
              width: data.data.width,
              height: data.data.height,
              sizeLimit:data.data.source_size_limit
            }
          }else {
            this_.$message.error(data.msg || '获取详情失败!');
          }
        })
      },
      //校验code是否重复
      checkAdvertByCode:function() {
        var this_ = this;
        this.utils.request.getAdvertInfo({code:this_.dataForm.code}, function(data) {
          if (data && data.code == '0000'){
            if (data.data){
              if (this_.adId && this_.adId == data.data.id){
                this_.checkCodeFlag = false;
              }else {
                this_.checkCodeFlag = true;
                this_.$message.error('该广告位标识已存在，请重新填写!');
              }
            }else {
              this_.checkCodeFlag = false;
            }

          }else {
            this_.$message.error(data.msg || '获取详情失败!');
            return false;
          }
        })
      },
      //返回
      go:function () {
        this.$router.go(-1);
      },
      //初始化
      init:function () {
        if (this.adId && this.adId === '0'){
          this.adId = null;
        }
        if (this.adId){
          this.queryAdvertInfo(this.adId);
        }
      }
    },
    mounted(){
      this.init();
    },
  }
</script>

<style scoped>

</style>
