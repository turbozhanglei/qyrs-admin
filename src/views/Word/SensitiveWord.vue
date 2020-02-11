<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" :label-position="labelPosition">
        <el-form-item prop="word" label="敏感词：">
          <el-input v-model="filters.word" placeholder="敏感词" clearable></el-input>
        </el-form-item>
        <el-row>
          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              perms="sys:user:view"
              type="primary"
              @click="findPage(filters)"
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
      <el-row style="margin-bottom: 8px">
        <span >提示：敏感词之间用英文逗号隔离。</span>
      </el-row>
    </div>

    <!--表格内容栏-->
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ 'color': '#FFF','background-color': 'rgb(20, 136, 154)'}"
      v-loading="loading"
      element-loading-text="$t('action.loading')">
      <el-table-column
        label="敏感词库"
        min-width="280"
        align="center">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            placeholder="请输入敏感词，敏感词之间用英文逗号隔离。"
            v-model="scope.row.word"
            maxlength="500"
            show-word-limit
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">保存</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import KtButton from "@/views/Core/KtButton";
  export default {
    components: {
      KtButton,
    },
    data() {
      return {
        size: "small",
        labelPosition: 'left',
        filters: {
          word: "",//敏感词
        },
        tableData: [],
        loading:false,
      };
    },
    methods: {
      // 获取分页数据
      findPage: function(data) {
        let this_= this;
        this_.loading = true;
        this.utils.request.getWordInfo(this.filters, function(data) {
          if (data && data.data && data.code == '0000'){
            this_.tableData = [];
            this_.tableData.push(data.data);
          }else {
            if (!this_.filters.word){
              this_.tableData = [{word:""}];
            }else {
              this_.tableData = [];
            }
          }
          this_.loading = false;
        });
      },
      reset: function() {
        this.$refs["filters"].resetFields();
        this.findPage();
      },
      handleEdit(index, row) {
        let word = row.word,
        this_=this;
        if (!word || word == ''){
          this_.$message({
            message: '请输入敏感词!',
            type: 'warning'
          });
          return;
        }else if (word.indexOf("，") > 0){
          this_.$message.error('请输入英文逗号!');
          return;
        }else {
          this.utils.request.saveWordInfo(row, function(data) {
            if (data && data.code == '0000'){
              this_.findPage();
              this_.$message({
                message: '敏感词修改成功!',
                type: 'success'
              });
            }else {
              this_.$message.error(data.msg || '敏感词修改失败!');
            }
          });
        }

      },
    },
    mounted() {
      this.findPage();
    }
  };
</script>

<style scoped>
</style>
