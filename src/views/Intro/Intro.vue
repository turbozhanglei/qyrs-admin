<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="clearfix">
          <span style="font-size: 18px; color: #212121;">
            <span>欢迎您使用企业人事管理系统</span>
          </span>
        </div>
        <div>
          <img :src="emptyGif" class="emptyGif" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  data() {
    return {
      // emptyGif: "http://img.soogif.com/kqKSjKYA4YWF7MCPDQ3LRbJO0JaNjlqc.gif",
    };
  },
  computed: {},
  mounted: function() {
    //初始化，

  },
  methods: {
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.dashboard-editor-container {
  width: 90%;
  height: 100%;
  text-align: center
}
</style>
