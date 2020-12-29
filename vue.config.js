module.exports={
	configureWebpack: {
		//解决路径问题
		resolve: {
			alias: {
				"assets": "@/assets",
				"components": "@/components",
				"network":"@/network"
			}
		},
	}
}