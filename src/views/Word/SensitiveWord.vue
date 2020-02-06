<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" :label-position="labelPosition">
        <el-form-item prop="nickname" label="敏感词：">
          <el-input v-model="filters.word" placeholder="敏感词" clearable></el-input>
        </el-form-item>
        <el-row>
          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              perms="sys:user:view"
              type="primary"
              @click="$refs.CyTable.findPageBeforeRestPages(filters)"
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
      :header-cell-style="{ 'color': '#FFF','background-color': 'rgb(20, 136, 154)'}">
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
          word: "",//会员昵称
          t: "sysUser",
        },
        tableData: [{
          word: '王小虎',
        }]
      };
    },
    methods: {
      // 获取分页数据
      findPage: function(data) {
        this.$refs.CyTable.findPage(this.filters);
      },
      reset: function() {
        this.$refs["filters"].resetFields();
        this.$refs.CyTable.resetForm();
        this.findPage();
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
    },
    mounted() {
    }
  };
</script>

<style scoped>
</style>
