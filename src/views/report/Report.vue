<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 600px;height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts"
import {getEchartData} from "network/report"
import _ from "lodash"
export default {
  name: "Report",
  data(){
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created(){

  },
  mounted(){
    this.$nextTick(()=>{
      setTimeout(()=>{
        this.echartsInit()
      })
    })

  },
  methods:{
    async echartsInit(){
      var myChart = echarts.init(document.getElementById('main'))
      const res = await getEchartData()
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }


      //将数据和配置项合并
      const result= _.merge(res.data,this.options)
      myChart.setOption(result)
    },
  }
}
</script>

<style scoped>

</style>