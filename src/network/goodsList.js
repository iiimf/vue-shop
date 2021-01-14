import {request} from "network/request"
export function getGoodsList(queryInfo){
	return request({
		url:"/goods",
		params:queryInfo,
		method:"get"
	})
}

//删除商品
export function deleteGood(id){
	return request({
		url:"/goods/"+id,
		method:"delete"
	})
}

//添加商品
export function addGood(goodsInfo){
	return request({
		url:"/goods",
		data:goodsInfo,
		method:"post"
	})
}