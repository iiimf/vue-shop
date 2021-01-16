import {request} from "network/request";

export function getOrderlist(queryInfo){
	return request({
		url:"/orders",
		params:queryInfo,
		method:"get"
	})
}

export function getKuaidi(){
	return request({
		url:"/kuaidi/1106975712662",
		method:"get"
	})
}