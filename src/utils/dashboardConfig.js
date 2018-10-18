/*
    格式化 cfg 字段
*/

export function injectFilter(widget, filters) {
    const boardFilters = [];
    /*if($scope.widgetFilters[widget.id] !== undefined){
        _.each($scope.widgetFilters[widget.id], function(e){
            boardFilters.push(e);
        });
    }
    if($scope.datasetFilters[widget.data.datasetId] !== undefined){
        _.each($scope.datasetFilters[widget.data.datasetId], function(e){
            boardFilters.push(e);
        });
    }
    if($scope.relationFilters[widget.id] !== undefined){
        _.each($scope.relationFilters[widget.id], function(e){
            boardFilters.push(e);
        });
    }*/
    widget.config.boardFilters = boardFilters;

    if(widget.config.chart_type !== 'sankey' && widget.config.chart_type !== 'map') {
        /*var countryFilter = {
            col: 'SALES_COUNTRY',
            type: '=',
            //values: ['Canada']
            values: []
        };*/
       /* var otherFilter = {
            col: 'gender',
            type: '=',
            //values: ['F']
            values: []
        };*/
        //widget.config.boardFilters.push(countryFilter);
        //widget.config.boardFilters.push(otherFilter);
        if(filters) {
            widget.config.boardFilters = widget.config.boardFilters.concat(filters);
        }
    }

    return widget;
}


export function formatConfig(config) {
	const dataSeries = getDataSeries(config);
	let cfg = {rows: [], columns: [], filters: []}; 
    cfg.rows = getDimensionConfig(config.keys);
    cfg.columns = getDimensionConfig(config.groups);
    cfg.filters = getDimensionConfig(config.filters);
    cfg.filters = cfg.filters.concat(getDimensionConfig(config.boardFilters));
    cfg.values = dataSeries.map(function (s) {
        return {column: s.name, aggType: s.aggregate};
    });
    return cfg;
}

function getDimensionConfig(array) {
    var result = [];
    if (array) {
        array.forEach(function (e) {
            if (e.group === undefined) {
                let name = e.col || e.column;
                let type = e.type === 'column' ? 'eq' : e.type;
                result.push({columnName: name, filterType: type, values: e.values || [], id: e.id});
            } else {
                e.filters.forEach(function (f) {
                    let name = f.col || f.column;
                    let type = f.type === 'column' ? 'eq' : f.type;
                    result.push({columnName: name, filterType: f.type, values: f.values || []});
                });
            }
        });
    }
    return result;
}

function getDataSeries(config) {
    let result = [];
    config.values.forEach(function (v) {
        v.cols.forEach(function (c) {
            var series = configToDataSeries(c);
            series.forEach(function (s) {
                let isRepeat = false;
                for(let i=0,l=result.length; i<l; i++) {
                	if(JSON.stringify(result[i]) === JSON.stringify(s)) {
                		isRepeat = true;
                		break;
                	}
                }
                if(!isRepeat) result.push(s);
            });
        });
    });
    return result;
}

function configToDataSeries(config) {
    switch (config.type) {
        case 'exp':
        	alert('todo exp!');
            return [];
            break;
        default:
            return [{
                name: config.col,
                aggregate: config.aggregate_type
            }];
    }
}
