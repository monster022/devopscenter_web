<!-- eslint-disable vue/no-parsing-error -->
<template>
  <!-- <el-card class="grid-content bg-purple">
    <div slot="header">
      <el-button type="text">
        <a href="http://grafana.chengdd.cn/d/2TzSA6YVk/kubernetes?orgId=1&refresh=5s">Kubernetes Monitor</a>
      </el-button>
    </div>
    <div class="grid-content bg-purple">
      {{ 'Kubernetes Dashboard' }}
    </div>
  </el-card> -->

  <el-row>
    <el-col :span="24"><div class="grid-content bg-purple-dark" /></el-col>
    <el-col :span="4">
      <el-card style="margin-top: 5%; margin-left: 5%;" shadow="hover" class="card-background">
        <a href="https://harbor.chengdd.cn"><img src="@/assets/svg/harbor.svg" class="image" width="200" height="100"></a>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card style="margin-top: 5%; margin-left: 5%;" shadow="hover" class="card-background">
        <a href="http://jaeger.chengdd.cn"><img src="@/assets/svg/jaeger.svg" class="image" width="200" height="100"></a>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card style="margin-top: 5%; margin-left: 5%;" shadow="hover" class="card-background">
        <a href="http://prometheus.chengdd.cn"><img src="@/assets/svg/prometheus.svg" class="image" width="200" height="100"></a>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card style="margin-top: 5%; margin-left: 5%;" shadow="hover" class="card-background">
        <a href="http://grafana.chengdd.cn"><img src="@/assets/svg/grafana.svg" class="image" width="200" height="100"></a>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card style="margin-top: 5%; margin-left: 5%;" shadow="hover" class="card-background">
        <a href="http://apollo.chengdd.cn"><img src="@/assets/svg/apollo.svg" class="image" width="200" height="100"></a>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card style="margin-top: 5%; margin-left: 5%;" shadow="hover" class="card-background">
        <a href="http://jenkins.chengdd.cn"><img src="@/assets/svg/jenkins.svg" class="image" width="200" height="100"></a>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card style="margin-top: 5%; margin-left: 5%;" shadow="hover" class="card-background">
        <a href="http://ceph.chengdd.cn"><img src="@/assets/svg/ceph.svg" class="image" width="200" height="100"></a>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card style="margin-top: 5%; margin-left: 5%;" shadow="hover" class="card-background">
        <a href="http://rancher.chengdd.cn"><img src="@/assets/svg/kubernetes.svg" class="image" width="200" height="100"></a>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card style="margin-top: 5%; margin-left: 5%;" shadow="hover" class="card-background">
        <a href="http://kibana.chengdd.cn"><img src="@/assets/svg/kibana.svg" class="image" width="200" height="100"></a>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card style="margin-top: 5%; margin-left: 5%;" shadow="hover" class="card-background">
        <a href="http://gitlab.chengdd.cn"><img src="@/assets/svg/gitlab.svg" class="image" width="200" height="100"></a>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      currentDate: new Date()
    }
  }
}
</script>

<style>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .card-background {
    background: #fafaf6;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

</style>
