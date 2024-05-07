let isFunction = (functionToCheck) => {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}


let treeMap = () => {

  let temp = apiResponse ? initializeChartValues() : [];

  let options = {
    title: {
      left: 'leafDepth'
    },

    tooltip: {
      // formatter: function (params) {
      //   console.log('params ', params)
      // }
    },

    series: [{
      name: 'option',
      type: 'treemap',
      visibleMin: 100,
      data: [temp],
      leafDepth: 2,
      levels: [
        {
          itemStyle: {
            borderColor: '#555',
            borderWidth: 4,
            gapWidth: 4
          }
        },
        {
          color: ['#2113a1'],
          colorSaturation: [0.7, 0.2],
          itemStyle: {
            borderColorSaturation: 0.7,
            gapWidth: 2,
            borderWidth: 2
          }
        },
        {
          colorSaturation: [0.3, 0.75],
          color: ['#269f3c'],
          //color: ['#942e38', '#269f3c'],
          // colorMappingBy: 'value',
          itemStyle: {
            borderColorSaturation: 0.6,
            gapWidth: 1
          }
        },
        {
          colorSaturation: [0.3, 0.75]
        }
      ]
    }]
  };
  return options;
}


let treeChart = () => {

  let temp = apiResponse ? initializeChartValues() : [];

  var options = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'tree',
        data: [temp],
        symbolSize: 10,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 13
        },
        leaves: {
          label: {
            position: 'right',
            fontSize: 13,
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        emphasis: {
          focus: 'descendant'
        },

        expandAndCollapse: true,
        animationDuration: 250,
        animationDurationUpdate: 350
      },
    ]
  };
  return options;
}

let clearChartNodes = () => {
  if (echarts.init(document.getElementById('chart2'))) {
    echarts.init(document.getElementById('chart2')).dispose();
  }
  if (echarts.init(document.getElementById('chart1'))) {
    echarts.init(document.getElementById('chart1')).dispose();
  }
  if (echarts.init(document.getElementById('chartAll'))) {
    echarts.init(document.getElementById('chartAll')).dispose();
  }
}


let clearTableNodes = () => {
  if (document.querySelector('table')) {
    document.querySelector('table').remove();
  }
}

let refreshChartVisual = (el) => {
  el.resize();
}

let sunburstExample = () => {
  let temp = apiResponse ? initializeChartValues() : [];

  const colors = ['#FFAE57', '#FF7853', '#EA5151', '#CC3F57', '#9A2555'];
  const bgColor = '#000';
  var options = {
    color: colors,
    series: [{
      type: 'sunburst',
      center: ['50%', '48%'],
      data: [temp],
      sort: function (a, b) {
        return a.depth === 1 ? b.getValue() - a.getValue() : a.dataIndex - b.dataIndex;
      },
      label: {
        rotate: 'radial',
        fontSize: 13,
        color: bgColor
      },
      itemStyle: {
        borderColor: bgColor,
        borderWidth: 2
      },
      levels: [{}, {
        r0: 80,
        r: 170,
        label: {
          fontSize: 18,
          rotate: 0
        }
      }, {
        r0: 170,
        r: 355
      }, {
        r0: 355,
        r: 420,
        itemStyle: {
          shadowBlur: 2,
          shadowColor: colors[2],
          color: 'transparent'
        },
        label: {
          rotate: 'tangential',
          fontSize: 12,
          color: colors[0]
        }
      }, {
        r0: 420,
        r: 450,
        itemStyle: {
          shadowBlur: 60,
          shadowColor: '#fade43'
        },
        label: { // Outside Ring Text
          position: 'outside',
          textShadowBlur: 5,
          color: colors[1],
          fontSize: 11,
          textShadowColor: '#333'
        },
        downplay: {
          label: {
            opacity: 1
          }
        }
      }]
    }]
  };
  return options
}


let dateBasedScatterChart = (dateResName, valueResName) => {

  let dateIdx = apiResponse.resourceNames.findIndex((e) => e == dateResName);
  let flightValueIdx = apiResponse.resourceNames.findIndex((e) => e == valueResName);

  var options = {
    xAxis: {
      type: 'time'

    },
    yAxis: {
    },
    series: [{
      symbolSize: 2,
      data: [],
      type: 'scatter'
    }]
  };

  for (let i = 0; i < apiResponse.data.length; i++) {
    var date = new Date(apiResponse.data[i][dateIdx]);
    var flightValue = apiResponse.data[i][flightValueIdx];
    options.series[0].data.push([date, flightValue]);
  }

  return options;
};




let verticalCalendarHeatMap = (dateResName, valueResName, chartType, valueCallback) => {

  if (apiResponse) {
    let widthPctForCharts = .85; // lets reserve 80% of the area for the charts (vs legends etc)

    // find the array index for the kpis's we're using for the date + the heatmap value
    let dateIdx = apiResponse.resourceNames.findIndex((e) => e == dateResName);
    let flightValueIdx = apiResponse.resourceNames.findIndex((e) => e == valueResName);

    // sort all data into a hierarchical data structure:  year -> date -> [value1, value2,...]
    let dataByYear = {}

    for (let i = 0; i < apiResponse.data.length; i++) {
      var date = new Date(apiResponse.data[i][dateIdx]);
      var ymd = date.toISOString().split('T')[0];
      var yearOnly = ymd.split('-')[0];
      var flightValue = apiResponse.data[i][flightValueIdx];

      var yearEntry = dataByYear[yearOnly] || {};
      if (!yearEntry[ymd]) yearEntry[ymd] = [];

      yearEntry[ymd].push(flightValue);
      dataByYear[yearOnly] = yearEntry;
    }

    // initialize the echarts options object, which we'll return
    let options = {
      tooltip: {
        position: 'top',
        formatter: function (p) {
          var format = echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
          return format + ': ' + p.data[1];
        }
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: 'vertical',
        left: (widthPctForCharts * 50) + "%", top: 'center'
      },
      calendar: [],
      series: []
    };

    let minValue = 0;
    let maxValue = 0;
    let calendarIdx = 0;
    let hasFunctionCallback = isFunction(valueCallback);


    let allYears = Object.keys(dataByYear).sort();

    // now populate options.calendar & option.series with an entry corresponding to each yearly heatmap
    for (const year of allYears) {
      let calObj = {
        orient: 'vertical',
        range: year,
        cellSize: [16, 16]
      }

      calObj.left = ((calendarIdx / allYears.length) * widthPctForCharts * 50) + "%";
      options.calendar.push(calObj);

      var dataForYear = [];

      for (const date of Object.keys(dataByYear[year]).sort()) {
        let chartValue = undefined;

        let values = dataByYear[year][date];
        if (hasFunctionCallback) {
          chartValue = valueCallback(values);
        }
        else chartValue = values.reduce((a, b) => a + b); // sum them by default

        if (chartValue > maxValue) maxValue = chartValue;
        if (chartValue < minValue) minValue = chartValue;
        dataForYear.push([date, chartValue])
      }

      let seriesObj = { type: 'heatmap', coordinateSystem: chartType, calendarIndex: calendarIdx, data: dataForYear };

      options.series.push(seriesObj);
      calendarIdx++;
    }

    options.visualMap.min = Math.round(minValue);
    options.visualMap.max = Math.round(maxValue);

    return options;
  }
}


// Sets up fake data for chart visuals
let initializeChartValues = () => {

  let days = [];
  let oCollector = [];
  let dCollector = [];

  if (apiResponse && apiResponse.data.length > 0) {
    apiResponse.data.forEach((d, k) => {
      if (!oCollector.includes(d[3])) {
        if (oCollector.length < 8) {
          oCollector.push(d[3])
        }
      }
      if (!dCollector.includes(d[4])) {
        if (dCollector.length < 8) {
          dCollector.push(d[4])
        }
      }
      if (!days.includes(d[2])) {
        days.push(d[2])
      }
    });

    let collapsed = false;
    let odGroups = [];

    days.map((d, i) => {
      let dayValue = getRandomInt(100);
      let oTemp = [];
      let dTemp = [];

      oTemp = oCollector.map((o, c) => {
        return { name: o, value: getRandomInt(100) }
      })

      dTemp = dCollector.map((d, t) => {
        return { name: d, value: getRandomInt(100) }
      })

      collapsed = i % 2 === 0 ? true : false;

      if (i < 1) {
        collapsed = false;
        odGroups.push({ name: "Origin", children: oTemp, collapsed: true }, { name: "Destination", children: dTemp, collapsed: false })
      }
      days[i] = { name: d, children: odGroups, collapsed: collapsed }
    })
    return { name: "Flights", children: days, collapsed: false };
  }
}


let getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

let getArgs = () => {
  let argList = [];
  let count = 0;

  apiResponse.resourceNames.forEach((f, i) => {
    if (f.includes("LegInventory:") && f !== undefined) {
      argList.push({ id: count++, value: f });
    }
  })
}



let appendTableData = () => {

  clearTableNodes();
  let tableValueHeaders = [];
  tableValueHeaders = apiResponse.resourceNames.map(f => {

    if (f.includes("LegInventory:")) {
      return f.replace('LegInventory:', '')
    } else if (f.includes("LegSnapshot:")) {
      return f.replace('LegSnapshot:', '')
    } else if (f.includes("LegSchedule:")) {
      return f.replace('LegSchedule:', '')
    }
    return f;
  })

  let tableValueArrays = [];

  tableValueArrays = apiResponse.data.map((d, i) => {
    return d.map((n, j) => {
      if (!isNaN(n) && countDecimals(n) > 0) {
        return getRoundedData(n);
      }
      return n;
    })
  })

  return [tableValueHeaders, tableValueArrays]
}

let countDecimals = (value) => {
  if ((value % 1) != 0 && !Number.isInteger(value)) {
    return value.toString().split(".")[1].length;
  }
};

let getRoundedData = (num) => {
  return (num * 100).toFixed(0) + '%';
}

export { dateBasedScatterChart, verticalCalendarHeatMap, sunburstExample, appendTableData, initializeChartValues, getArgs, refreshChartVisual, treeChart, treeMap, clearChartNodes, clearTableNodes };
// export { ChartBuilder, DateBasedScatterChartBuilder };