import {request} from "@/network/request";

export function getRightsList(){
	return request({
		url:"/rights/list",
		method:"get"
	})
}

export function getRightsListTree(){
	return request({
		url:"/rights/tree",
		method:"get"
	})
}

