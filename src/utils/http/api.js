const baseurl = '/api/'; // In Dev
//const baseurl = '生产环境 CBoard 访问路径';  // In Production
const api = {
	//登录
	//login: baseurl + 'login',
	//getUserDetail: baseurl + 'commons/getUserDetail.do'

	//获取目录
	getMenuList: baseurl + 'commons/getMenuList.do',
	getCategoryList: baseurl + 'dashboard/getCategoryList.do',

	/*############### dashboard ##################*/
	//dashboard 页面数据
	getBoardList: baseurl + 'dashboard/getBoardList.do',
	getBoardData: baseurl + 'dashboard/getBoardData.do',

	//widget 的具体数据
	getAggregateData: baseurl + 'dashboard/getAggregateData.do',

	//获得 param 的数据
	getDimensionValues: baseurl + 'dashboard/getDimensionValues.do',

	/*############### config ##################*/
	/*--- dashboard config ---*/
	getDatasetList: baseurl + 'dashboard/getDatasetList.do',
	getWidgetList: baseurl + 'dashboard/getWidgetList.do',
	//保存
	updateBoard: baseurl + 'dashboard/updateBoard.do',
	// 保存新增布局
	saveNewBoard: baseurl + 'dashboard/saveNewBoard.do',
	// 删除布局
	deleteBoard: baseurl + 'dashboard/deleteBoard.do',
	// config--add param--弹出框的列表
	getColumns: baseurl + 'dashboard/getColumns.do',

	/*---dashboard category config---*/
	//新增 dashboard category
	saveNewCategory: baseurl + 'dashboard/saveNewCategory.do',
	//删除 dashboard category
	deleteCategory: baseurl + 'dashboard/deleteCategory.do',
	//修改 dashboard category
	updateCategory: baseurl + 'dashboard/updateCategory.do',

	/*----widget config----*/
	saveNewWidget: baseurl + 'dashboard/saveNewWidget.do',
	updateWidget: baseurl + 'dashboard/updateWidget.do',
	deleteWidget: baseurl + 'dashboard/deleteWidget.do',

	/*---Dataset 数据集管理---*/
	getDatasourceList: baseurl + 'dashboard/getDatasourceList.do',
	getDatasetCategoryList: baseurl + 'dashboard/getDatasetCategoryList.do',
	updateDataset: baseurl + 'dashboard/updateDataset.do',
	addDataset: baseurl + 'dashboard/saveNewDataset.do',
	deleteDataset: baseurl + 'dashboard/deleteDataset.do',

	/*---Dataset 数据源管理---*/
	updateDatasource: baseurl + 'dashboard/updateDatasource.do',
	getProviderList: baseurl + 'dashboard/getProviderList.do',
	addDatasource: baseurl + 'dashboard/saveNewDatasource.do',
	deleteDatasource: baseurl + 'dashboard/deleteDatasource.do',
	test: baseurl + 'dashboard/test.do',
	//get : dashboard/getDatasourceParams.do?type=jdbc

	
}

export default api;