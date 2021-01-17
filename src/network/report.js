import {request} from "network/request";

export function getEchartData(){
	return request({
		url:"/reports/type/1",
		method:"get"
	})
}