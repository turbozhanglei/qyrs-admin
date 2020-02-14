<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form
        :inline="true"
        :model="filters"
        :size="size"
        ref="filters"
        :label-position="labelPosition"
      >
        <el-form-item prop="categoryId" label="分类ID">
          <el-input v-model="filters.categoryId" placeholder="分类ID" clearable></el-input>
        </el-form-item>
        <el-form-item prop="name" label="分类名称">
          <el-input v-model="filters.name" placeholder="分类名称" clearable></el-input>
        </el-form-item>
        <el-form-item prop="platform" label="所属平台">
          <el-select v-model="filters.platform" placeholder="所属平台">
            <el-option
              v-for="item in platforms"
              :key="item.platform"
              :label="item.platformName"
              :value="item.platform"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="filters.status" placeholder="状态">
            <el-option
              v-for="item in categoryStatus"
              :key="item.status"
              :label="item.statusName"
              :value="item.status"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-row>
          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              type="primary"
              @click="findPage()"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="fa fa-plus"
              :label="$t('action.add')"
              type="primary"
              @click="handleAdd"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="el-icon-refresh"
              :label="$t('action.reset')"
              type="primary"
              @click="reset"
            />
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <!--表格内容栏-->
    <el-table
      :data="tableData"
      style="width: 100%"
      :stripe="stripe"
      :max-height="countHeight(maxHeight)"
      :size="size"
      align="left"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :header-cell-style="{ 'color': '#FFF','background-color': 'rgb(20, 136, 154)'}"
    >
      <el-table-column label="分类名称" width="200" align="center" prop="name"></el-table-column>
      <el-table-column label="分类ID" width="100" align="center" prop="id"></el-table-column>
      <el-table-column
        label="支持平台"
        width="100"
        align="center"
        prop="platform"
        :formatter="platformFormat"
      ></el-table-column>
      <el-table-column label="显示顺序" width="100" align="center" prop="sort">
        <template slot-scope="scope">
          <el-input placeholder maxlength="2" v-model="scope.row.sort" @blur="updateSort"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="100"
        align="center"
        prop="status"
        :formatter="statusFormat"
      ></el-table-column>
      <el-table-column label="修改时间" width="160" align="center" prop="update_time"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="warning" @click="addChildrenCategory(scope.$index, scope.row)" v-if="scope.row.level == 1">添加子类</el-button>
          <el-button
            size="mini"
            type="info"
            @click="changeCateGoryStatus(scope.$index, scope.row)"
            v-if="scope.row.status == 0"
          >禁用</el-button>
          <el-button
            size="mini"
            type="success"
            @click="changeCateGoryStatus(scope.$index, scope.row)"
            v-if="scope.row.status == 1"
          >启用</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="delCategory(scope.$index, scope.row)"
            v-if="scope.row.isArticle"
          >删除</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="delCategory(scope.$index, scope.row)"
            v-else-if="scope.row.children==''"
          >删除</el-button>
         
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
      >
        <el-form-item label="上级分类" prop="refId" required>
          <el-select v-model="dataForm.refId" placeholder="请选择上级分类" >
            <el-option
              v-for="item in superCategorys"
              :key="item.refId"
              :label="item.name"
              :value="item.refId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属平台" prop="platform"  required>
          <el-radio v-model="radio" label="1">微信小程序</el-radio>
        </el-form-item>
        <el-form-item label="分类名称" prop="name" required>
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="dataForm.sort" maxlength="2" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" required>
          <el-radio-group v-model="dataForm.status">
            <el-radio
              v-for="item in status"
              :key="item.value"
              :value="item.value"
              :label="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group> 
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>



    <el-dialog
      title="新增子类"
      width="40%"
      :visible.sync="dialogVisible1"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
      >
        <el-form-item label="上级分类" prop="refId" required>
          <el-select v-model="dataForm.refId" placeholder="请选择上级分类" >
            <el-option
              v-for="item in superCategorys"
              :key="item.refId"
              :label="item.name"
              :value="item.refId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属平台" prop="platform"  required>
          <el-radio v-model="radio" label="1">微信小程序</el-radio>
        </el-form-item>
        <el-form-item label="分类名称" prop="name" required>
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="dataForm.sort" maxlength="2" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" required>
          <el-radio-group v-model="dataForm.status">
            <el-radio
              v-for="item in status"
              :key="item.value"
              :value="item.value"
              :label="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group> 
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible1 = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm1">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
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
    KtButton
  },
  data() {
    return {
      dialogVisible1:false,
      radio: '1',
       status: [
        { label: "启用", value: 0},
        { label: "停用", value: 1}
      ],
      size: "small",
      labelPosition: "left",
      stripe: true,
      maxHeight: 900,
      filters: {
        categoryId: "", //分类id
        name: "", //分类名称
        platform: "", //支持平台
        status: "" //状态
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      tableData: [],
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      options: [],
      superCategorys: [
       
      ],
      categoryStatus: [
        {
          statusName: "全部",
          value: ""
        },
        {
          statusName: "启用",
          status: "0"
        },
        {
          statusName: "禁用",
          status: "1"
        }
      ],
      platforms: [
        {
          platform: 1,
          platformName: "小程序"
        },
        {
          platform: 2,
          platformName: "微信H5"
        }
      ],
      // 新增编辑界面数据
      dataForm: {
        refId: "",
        platform: "1",
        name: "",
        sort: "",
        status: ""
      },
      dataFormRules: {
        refId: [{ required: true, message: "请选择上级分类", trigger: "blur" }],
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      // this.$refs.CyTable.findPage({ content: pageResult, total: 11 });
      let this_=this;
      this.utils.request.queryCategoryList(this.filters,function(res){
        if(res.data!=null){
         this_.tableData=res.data
         }
         
      });
    },

    // 显示编辑界面
    handleEdit: function(index,row) {
      
      let this_=this
      this_.operation = false;
      this_.dialogVisible = true;
      this_.dataForm=row
      this_.dataForm.refId=row.ref_id
      this_.dataForm.status=row.status
      this_.dataForm.id = row.id
      console.log(row.id);
     console.log(row.status+"******")
     if(row.ref_id==1){
       this_.setType();
     }else{
       this_.setTypes();
     }
      

    },
  
    // 删除按钮
      delCategory:function(index,row){
        let this_=this;
        let params={};
        params.id=row.id;
        params.level=row.level;
        console.log(params);
        this.utils.request.delCategory(params,function(res){
          if(res != null && res.code == "0000"){
             this_.$message({ message: "删除成功, ", type: "success" });
             this_.findPage();
          }else{
            this_.$message({ message: "操作失败, ", type: "error" });
          }
        });
      },

      //禁用按钮
      changeCateGoryStatus:function(index,row){
       
        let this_ = this;
        let params = {};
        params.id = row.id;
        params.status=row.status;
        params.level=row.level;
        this.utils.request.changeCateGoryStatus(params,function(res){
          if(res != null && res.code == "0000"){
             this_.$message({ message: "操作成功, ", type: "success" });
             this_.findPage();
          }else{
            this_.$message({ message: "操作失败, ", type: "error" });
          }
        });

      },

    //分类初始化

  
    getTypeList: function(params) {
       
        var this_ = this;
        
        this.utils.request.getTypeList(params, function(res) {
          this_.superCategorys=res.data
         
        });
      },
    

    handleAdd: function() {
      
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        refId: "",
        platform: "1",
        name: "",
        sort: "",
        status: ""
      };
    },
//新增子类
    addChildrenCategory:function(index,row){
      

        this.dialogVisible1 = true;
        
        
      this.dataForm = {
        refId: "",
        platform: "1",
        name: "",
        sort: "",
        status: ""
      };
      this.dataForm.refId=row.ref_id
      dataForm.firstId=row.id
      
        
    },
    //保存新增子类
    submitForm1: function() {
    this.$refs.dataForm.validate(valid => {
      if (valid) {
        this.$confirm("确认提交吗？", "提示", {}).then(() => {
          this.editLoading = true;
          let params = Object.assign({}, this.dataForm);
         
          console.log("成功啊"+params.refId+params.level)
          this.utils.request.saveChildrenCategory(params, this.editInfoBack);
          
        });
      }
    });
  },
    
    updateSort: function(row) {
      console.log("111");
    },

    // 平台格式化
    platformFormat: function(row, column, cellValue, index) {
      if (Number(cellValue) == 2) {
        return "微信H5";
      }
      return "微信小程序";
    },
    // 状态格式化，更加生效时间判断 1、生效中 2、未生效 3、已过期
    statusFormat: function(row, column, cellValue, index) {
      if (Number(cellValue) == 0) {
        return "启用";
      }
      return "禁用";
    },

    reset: function() {
      this.$refs["filters"].resetFields();
      // this.$refs.CyTable.resetForm();
      this.findPage();
    },
    countHeight(height) {
      var winHeight =
        document.body.clientHeight || document.documentElement.clientHeight;
      if (height > winHeight * 0.7) {
        height = winHeight * 0.7;
      }
      return height;
    },
    // submitForm: function(data) {
    //   let this_ = this;
    //   if (this_.dataForm.refId == 1) {
    //     //判断是否为顶级Id
    //     dataForm.level = 1;
    //     //ref_id在后台判断 为当前新增id
    //   } else {
    //     dataForm.level = 2;
    //     dataForm.refId = this_.dataForm.refId;
    //   }

    //   console.log("成功啊" + this_.dataForm);
    //   this.utils.request.saveCategory(dataForm, function(res) {});
    //   // this.$refs.dataForm.validate(valid => {});
    //   this.dialogVisible = false;
    // }
    // 编辑
  submitForm: function() {
    this.$refs.dataForm.validate(valid => {
      if (valid) {
        this.$confirm("确认提交吗？", "提示", {}).then(() => {
          this.editLoading = true;
          let params = Object.assign({}, this.dataForm);
          console.log("成功啊"+params.refId+params.level)
          this.utils.request.saveCateGory(params, this.editInfoBack);
          
        });
      }
    });
  },

  editInfoBack: function(data) {
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
      } else {
        this.$message({ message: "操作失败, ", type: "error" });
      }
      this.findPage();
      this.dialogVisible = false;
       this.dialogVisible1 = false;
      this.operation = false;
      this.editLoading = false;
    },
     setType:function(data){//编辑时如果是一级分类
       let this_ = this
       this_.superCategorys=[{name: "顶级分类", refId: 1}]
     },

     setTypes:function(data){
       let this_ = this
       let params={}
       params.level=1
       this_.getTypeList(params);
     },
     
  },

 
  mounted() {
    this.findPage();
    this.getTypeList();
  }
};
</script>

<style scoped>
</style>
