const baseurl = '/api/';
const api = {
	//登录
	//login: baseurl + 'login',

	//获取目录
	getMenuList: baseurl + 'commons/getMenuList.do',
	getCategoryList: baseurl + 'dashboard/getCategoryList.do',

	/*############### dashboard ##################*/
	//dashboard 页面数据
	getBoardList: baseurl + 'dashboard/getBoardList.do',
	getBoardData: baseurl + 'dashboard/getBoardData.do',

	//widget 的具体数据
	getAggregateData: baseurl + 'dashboard/getAggregateData.do',

	/*############### config ##################*/
	getDatasetList: baseurl + 'dashboard/getDatasetList.do',
	getWidgetList: baseurl + 'dashboard/getWidgetList.do',
	//保存
	updateBoard: baseurl + 'dashboard/updateBoard.do',


}

export default api;