//linechart 的分析

/*
	新建一个 line-bar chart，
	其保存的 json：
*/

{
	"name": "temp",
	"categoryName": "Default Category",
	"data": {
		"config": {
			"option": {
				"dataZoom": false,
				"gridCustom": false,
				"legendShow": true
			},
			"chart_type": "line",
			"keys": [{
				"alias": "year",
				"col": "the_year",
				"level": "Date",
				"type": "eq",
				"values": [],
				"sort": "asc",
				"id": "a8d4b079-5074-4ddc-9379-074dadc76c90"
			}],
			"groups": [{
				"alias": "country",
				"col": "SALES_COUNTRY",
				"level": "Geo",
				"type": "eq",
				"values": [],
				"sort": "asc",
				"id": "4abf2747-3024-44bc-88ef-3cc2643d2b09"
			}],
			"values": [{
				"name": "",
				"cols": [{
					"col": "store_cost",
					"aggregate_type": "sum"
				}],
				"series_type": "line",  // 这里标记了类型
				"type": "value"
			}, {
				"name": "",
				"series_type": "bar", // 这里标记了类型
				"type": "value",
				"cols": [{
					"col": "store_sales",
					"aggregate_type": "sum"
				}]
			}],
			"filters": [],
			"valueAxis": "vertical"
		},
		"datasetId": 2,
		"expressions": [],
		"filterGroups": []
	}
}


// getAggregateData.do 的请求参数：
cfg: {
	"rows": [{
		"columnName": "the_year",
		"filterType": "eq",
		"values": [],
		"id": "a8d4b079-5074-4ddc-9379-074dadc76c90"
	}],
	"columns": [{
		"columnName": "SALES_COUNTRY",
		"filterType": "eq",
		"values": [],
		"id": "4abf2747-3024-44bc-88ef-3cc2643d2b09"
	}],
	"filters": [],
	"values": [{  //请求数据参数并不需要"series_type"字段
		"column": "store_cost",
		"aggType": "sum"
	}, {
		"column": "store_sales",
		"aggType": "sum"
	}]
}