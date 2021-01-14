<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoods">
            <el-button slot="append" icon="el-icon-search" @click="getGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goTOAddPage">添加商品</el-button>
        </el-col>
      </el-row>
<!--        商品列表表格区域-->
        <el-table border stripe v-loading="loading" :data="goodslist">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name" width="550px"></el-table-column>
          <el-table-column label="商品价格(元)" prop="goods_price" width="120px"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
          <el-table-column label="创建时间" prop="add_time" width="180px">
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeGoods(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[2, 5, 8, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total" background>
        </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {getGoodsList,deleteGood} from "network/goodsList"
export default {
  name: "GoodsList",
  data(){
    return {
      loading:true,
      queryInfo:{
        query:"",
        pagenum:1,
        pagesize:10
      },
      goodslist:[],
      total:0
    }
  },
  created() {
    this.getGoods()
  },
  methods:{
    async getGoods(){
      const res = await getGoodsList(this.queryInfo)
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.goodslist = res.data.goods
      this.total = res.data.total
      this.loading = false
    },
    //page
    handleSizeChange(newSize){
      this.queryInfo.pagesize =  newSize
      this.getGoods()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getGoods()
    },

    //删除按钮
    async removeGoods(row){
      const result = await this.$confirm("该操作会永久删除商品,是否继续?","提示",{
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).catch(err=>err)

      if(result !== "confirm"){
        return this.$message.info("取消删除")
      }
      const res = await deleteGood(row.goods_id)
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getGoods()
    },
    goTOAddPage(){
      this.$router.push("/goods/add")
    }
  }
}
</script>

<style scoped>

</style>