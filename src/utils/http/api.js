const baseurl = '/api/';
const api = {
	//登录
	//login: baseurl + 'login',

	//获取目录
	getMenuList: baseurl + 'commons/getMenuList.do',
	getCategoryList: baseurl + 'dashboard/getCategoryList.do',

	//dashboard 页面数据
	getBoardList: baseurl + 'dashboard/getBoardList.do',
	getBoardData: baseurl + 'dashboard/getBoardData.do',

	//widget 的数据
	getAggregateData: baseurl + 'dashboard/getAggregateData.do',


}

export default api;