<template>
  <div class="page-container">
    <template>
      <el-radio v-model="radio" label="1">备选项</el-radio>
      <el-radio v-model="radio" label="2">备选项</el-radio>

      <el-radio-group v-model="dataForm.status">
        <el-radio :label="item.label" :key="item.value" v-for="item in status">{{item.label}}</el-radio>
      </el-radio-group>
    </template>
  </div>
</template>

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
      status: [{ label: "启用", value: "0" }, { label: "停用", value: "1" }],
      radio: "",
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
      superCategorys: [],
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
        status: "0"
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
      let this_ = this;
      this.utils.request.queryCategoryList(this.filters, function(res) {
        if (res.data != null) {
          this_.tableData = res.data;
        }
      });
    },

    // 显示编辑界面
    handleEdit: function(index, row) {
      let this_ = this;
      this_.operation = false;
      this_.dialogVisible = true;
      this_.dataForm = row;
      this_.dataForm.refId = row.ref_id;
      this_.status = row.status;
      console.log(row.status + "******");
      if (row.ref_id == 1) {
        this_.setType();
      } else {
        this_.setTypes();
      }
    },

    // 删除按钮
    delCategory: function(index, row) {
      let this_ = this;
      let params = {};
      params.id = row.id;
      params.level = row.level;
      console.log(params);
      this.utils.request.delCategory(params, function(res) {
        if (res != null && res.code == "0000") {
          this_.$message({ message: "删除成功, ", type: "success" });
          this_.findPage();
        } else {
          this_.$message({ message: "操作失败, ", type: "error" });
        }
      });
    },

    //禁用按钮
    changeCateGoryStatus: function(index, row) {
      let this_ = this;
      let params = {};
      params.id = row.id;
      params.status = row.status;
      params.level = row.level;
      this.utils.request.changeCateGoryStatus(params, function(res) {
        if (res != null && res.code == "0000") {
          this_.$message({ message: "操作成功, ", type: "success" });
          this_.findPage();
        } else {
          this_.$message({ message: "操作失败, ", type: "error" });
        }
      });
    },

    //分类初始化

    getTypeList: function(params) {
      var this_ = this;

      this.utils.request.getTypeList(params, function(res) {
        this_.superCategorys = res.data;
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
        status: "0"
      };
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
            console.log("成功啊" + params.refId + params.level);
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
      this.operation = false;
      this.editLoading = false;
    },
    setType: function(data) {
      //编辑时如果是一级分类
      let this_ = this;
      this_.superCategorys = [{ name: "顶级分类", refId: 1 }];
    },

    setTypes: function(data) {
      let this_ = this;
      let params = {};
      params.level = 1;
      this_.getTypeList(params);
    }
  },

  mounted() {
    this.findPage();
    this.getTypeList();
  }
};
</script>

<style scoped>
</style>
