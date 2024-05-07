import * as echarts from 'echarts';
import {stripUnnecessaryQuotes} from '@angular/compiler/src/render3/view/style_parser';

export class Foobar {
    thing: string;
}

export class ChartBuilder {
    constructor() {
    }

}

export class ApiResponse {
    public resourceNames: string[];
    public data: object[][];
}

export class HeatMapBuilder extends ChartBuilder {
    cellValueCallback: (currValues: number[], currDate: Date) => number;
    dateResourceName: string;
    valueResourceName: string;

    constructor(dateResourceName: string, valueResourceName: string) {
        super();
        this.dateResourceName = dateResourceName;
        this.valueResourceName = valueResourceName;
    }

    handleValues(callback: (currValue: number[], currDate: Date) => number) {
        this.cellValueCallback = callback;
        return this;
    }

    setDateResourceName(resourceName: string) {
        this.dateResourceName = resourceName;
        return this;
    }

    setValueResourceName(resourceName: string) {
        this.valueResourceName = resourceName;
        return this;
    }


    buildOptions(apiResponse: ApiResponse) {

        console.log('dateResName ', this.dateResourceName, ' valueResName ', this.valueResourceName, ' apiResponse ', apiResponse)

        let widthPctForCharts = .85; // lets reserve 80% of the area for the charts (vs legends etc)

        // find the array index for the kpis's we're using for the date + the heatmap value
        let dateIdx = apiResponse.resourceNames.findIndex((e) => e == this.dateResourceName);
        let flightValueIdx = apiResponse.resourceNames.findIndex((e) => e == this.valueResourceName);

        // sort all data into a hierarchical data structure:  year -> date -> [value1, value2,...]
        let dataByYear = {}

        for (let i = 0; i < apiResponse.data.length; i++) {
            var dataRow = apiResponse.data[i];

            var date = new Date(dataRow[dateIdx] as unknown as string);
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
            visualMap: { min: 0, max: 100, calculable: true, orient: 'vertical', left: (widthPctForCharts * 100) + "%", top: 'center' },
            calendar: [],
            series: []
        };

        let minValue = 0;
        let maxValue = 0;
        let calendarIdx = 0;
        let hasFunctionCallback = this.cellValueCallback != undefined;

        let allYears = Object.keys(dataByYear).sort();

        // now populate options.calendar & option.series with an entry corresponding to each yearly heatmap
        for (const year of allYears) {
            let calObj = { orient: 'vertical', range: year, cellSize: [14, 14], left: undefined }

            calObj.left = ((calendarIdx / allYears.length) * widthPctForCharts * 100) + "%";
            options.calendar.push(calObj);

            var dataForYear = [];

            for (const date of Object.keys(dataByYear[year]).sort()) {
                let chartValue = undefined;

                let values = dataByYear[year][date];
                if (hasFunctionCallback) chartValue = this.cellValueCallback(values, new Date(date));
                else chartValue = values.reduce((a, b) => a + b); // sum them by default

                if (chartValue > maxValue) maxValue = chartValue;
                if (chartValue < minValue) minValue = chartValue;
                dataForYear.push([date, chartValue]);
            }

            let seriesObj = { type: 'heatmap', coordinateSystem: 'calendar', calendarIndex: calendarIdx, data: dataForYear };

            options.series.push(seriesObj);
            calendarIdx++;
        }

        options.visualMap.min = Math.round(minValue);
        options.visualMap.max = Math.round(maxValue);

        return options;

    }
}

export class DateBasedScatterChartBuilder extends ChartBuilder {
    dataValuesCallback: (currValue: number, currDate: Date) => number;
    dateResourceName: string;
    valueResourceName: string;

    constructor(dateResourceName: string, valueResourceName: string) {
        super();
        this.dateResourceName = dateResourceName;
        this.valueResourceName = valueResourceName;
    }

    handleValues(callback: (currValue: number, currDate: Date) => number) {
        this.dataValuesCallback = callback;
        return this;
    }

    setDateResourceName(resourceName: string) {
        this.dateResourceName = resourceName;
        return this;
    }

    setValueResourceName(resourceName: string) {
        this.valueResourceName = resourceName;
        return this;
    }

    buildOptions(apiResponse: ApiResponse) {
        // throw an error if there are any conflicting/incomplete builder parameters

        const dateIdx = apiResponse.resourceNames.findIndex((e) => e === this.dateResourceName);
        const flightValueIdx = apiResponse.resourceNames.findIndex((e) => e === this.valueResourceName);
        var data = [];

        for (let i = 0; i < apiResponse.data.length; i++) {
            var dataRow = apiResponse.data[i];

            var date = new Date(dataRow[dateIdx] as unknown as string);

            var chartValue = dataRow[flightValueIdx] as unknown as number;

            if (this.dataValuesCallback !== undefined) {
                chartValue = this.dataValuesCallback(chartValue, date);
            }

            data.push([date, chartValue]);
        }

        return {
            xAxis: {
                type: 'time'

            },
            yAxis: {
            },
            series: [{
                symbolSize: 2,
                data: data,
                type: 'scatter'
            }]
        };
    }
}

export class FlightPathGraphBuilder extends ChartBuilder {

    private blueRamp16 = [
        '#2058A7', '#2A5FAB', '#3467AF', '#3E6EB3',
        '#4876B8', '#527EBC', '#5C85C0', '#668DC4',
        '#7094C9', '#7A9CCD', '#84A4D1', '#8EABD5',
        '#98B3DA', '#A2BADE', '#ACC2E2', '#B6CAE7'
    ];

    constructor(private dateResourceName: string, private valueResourceName: string) {
        super();
    }

    onlyUnique(value, index: number, self): boolean {
        // this could be an array.prototype extension method
        return self.indexOf(value) === index;
    }

    buildOptions(apiResponse: ApiResponse): any { // actual return type is echartOptions or something, find that out
        console.log('FlightPathGraphBuilder.buildOptions() running here');
        console.log('apiResponse', apiResponse);

        // get all departure counts
        const originIdx = apiResponse.resourceNames.indexOf('LegSchedule:Origin');
        const destIdx = apiResponse.resourceNames.indexOf('LegSchedule:Destination');
        const lidLfIdx = apiResponse.resourceNames.indexOf('LegInventory:LidLF');
        // console.log('originIdx', originIdx);
        // const origins = apiResponse.data.map(d => d[departureIdx]).filter(this.onlyUnique);
        const allOrigins = apiResponse.data.map(d => d[originIdx]);
        // console.log('all origins', allOrigins);
        const uniqueOrigins = allOrigins.filter(this.onlyUnique).sort();
        // console.log('unique origins', uniqueOrigins);

        const uniqueDestinations = apiResponse.data.map(d => d[destIdx]).filter(this.onlyUnique).sort();
        // console.log('uniqueDestinations', uniqueDestinations);

        const airports = uniqueOrigins.concat(uniqueDestinations).filter(this.onlyUnique);
        // console.log('airports', airports);

        const sfoRatios = [];
        for (const flight of apiResponse.data) {

        }

        const flightPaths = apiResponse.data.map(d => {
            const org = d[originIdx];
            const dest = d[destIdx];
            return {origin: org, destination: dest, flightPath: `${org}${dest}`};
        });
        // console.log('flightPaths', flightPaths);

        const uniqueFlightPaths = flightPaths.filter((value, index: number, self) => {
            return self.findIndex(d => d.flightPath === value.flightPath) === index;
        }).sort((first, second) => {
            if (first.flightPath < second.flightPath) { return -1; }
            if (first.flightPath > second.flightPath) { return 1; }
            return 0;
        });
        // const uniqueFlightPaths = flightPaths.filter(this.onlyUnique);
        // console.log('uniqueFlightPaths', uniqueFlightPaths);

        let departureLfs = {};
        let maxDepartures = 1; // for any given airport
        for (let i = 0; i < uniqueOrigins.length; i++) {
            const origin = String(uniqueOrigins[i]);
            const departureData = apiResponse.data.filter(d => String(d[originIdx]) === origin);
            const departureCount = departureData.length;
            // const departureCount = apiResponse.data.filter(d => d[originIdx] === origin).length;
            if (departureCount > maxDepartures) { maxDepartures = departureCount; }


            const originLfs: number[] = departureData.map(d => Number(d[lidLfIdx]));
            const originLfAvg = originLfs.reduce((a, b) => a + b, 0) / originLfs.length;
            // console.log(`${origin} LFs`, originLfs);
            // console.log(`${origin} average LF`, originLfAvg);
            departureLfs[origin] = originLfAvg;
        }

        // create nodes, which are just the airports
        let theNodes = [];
        for (let i = 0; i < airports.length; i++) {
            // const origin = uniqueOrigins[i];
            const airport = String(airports[i]);
            const departureCount = apiResponse.data.filter(d => String(d[originIdx]) === airport).length;

            const avgLf = departureLfs[airport];
            const airportColor = this.blueRamp16[Math.floor((avgLf * 16))];
            console.log(`${airport} color`, airportColor);

            theNodes.push(
              {
                  id: i.toString(),
                  name: airports[i],
                  symbolSize: 7 + (24 * (departureCount / maxDepartures)),
                  x: 130 * (i / 6) + (Math.random() * 25),
                  y: 130 * (i % 6) + (Math.random() * 25),
                  // x: i * 2,
                  // y: i * 2,
                  value: departureCount,
                  // category: airport.toString() === 'GTP' ? 1 : 0
                  category: 0,
                  // itemStyle: { color: 'red' }
                  // TODO: we could really use some sort of color interpolator (preferably that can handle 3+)
                  itemStyle: { color: airportColor }
              });
        }
        // console.log('theNodes', theNodes);

        let theLinks = [];
        for (let i = 0; i < uniqueFlightPaths.length; i++) {
            const orgI = airports.indexOf(uniqueFlightPaths[i].origin);
            const destI = airports.indexOf(uniqueFlightPaths[i].destination);

            // if (orgI < destI) {
            //     theLinks.push({source: orgI.toString(), target: destI.toString()});
            // }
            theLinks.push({source: orgI.toString(), target: destI.toString()});
        }
        // console.log('theLinks', theLinks);



        const option = {
            title: {
                text: 'Flight Path Graph',
                subtext: 'Default layout',
                top: 'bottom',
                left: 'right'
            },
            tooltip: {},
            legend: [ ],
            series: [
                {
                    name: 'Flight Path Graph',
                    type: 'graph',
                    // layout: 'force',
                    // layout: 'none',
                    layout: 'circular',
                    circular: {
                        rotateLabel: true
                    },
                    data: theNodes,
                    links: theLinks,
                    categories: [{name: 'others'}, {name: 'GTP'}],
                    label: { position: 'right' , formatter: '{b}', show: true},
                    roam: true,
                    force: {
                        repulsion: 100,
                        gravity: 0.1,
                        edgeLength: 175
                    },
                    lineStyle: {
                        color: 'source',
                        curveness: 0.3
                    },
                    emphasis: {
                        focus: 'adjacency',
                        lineStyle: {
                            width: 10
                        }
                    }
                }
            ]
        };

        return option;
    }

}

export class FlightPath3DBarGraphBuilder extends ChartBuilder {

    private colorScale = ['#c62b3a',
        '#cd4653',
        '#d4606b',
        '#db7b84',
        '#e3959d',
        '#eab0b5',
        '#f1cace',
        '#f8e5e6',
        '#ffffff',
        '#e2edff',
        '#c4daff',
        '#a7c8fe',
        '#89b5fe',
        '#6ca3fe',
        '#4e90fe',
        '#317efd',
        '#136bfd'];

    private zAxisResourceName: string;

    // TODO: add avg, min, max
    private zAxisMethod: 'sum' | 'count' = 'count';

    private zAxisLabel = 'value';

    constructor() {
        super();
    }

    setZAxisResource(resourceName: string): FlightPath3DBarGraphBuilder {
        this.zAxisResourceName = resourceName;
        return this;
    }

    setZAxisValueMethod(method: 'sum' | 'count'): FlightPath3DBarGraphBuilder {
        // if set to 'count' then we really don't need to even use the zAxisResourceName
        this.zAxisMethod = method;
        return this;
    }

    setZAxisLabel(label: string): FlightPath3DBarGraphBuilder {
        this.zAxisLabel = label;
        return this;
    }

    buildOptions(apiResponse: ApiResponse): any {

        const originResourceIdx = apiResponse.resourceNames.indexOf('LegSchedule:Origin');
        const destResourceIdx = apiResponse.resourceNames.indexOf('LegSchedule:Destination');
        const bkResourceIdx = apiResponse.resourceNames.indexOf('LegInventory:FlightBk');
        const resourceIdx = apiResponse.resourceNames.indexOf(this.zAxisResourceName);

        const origins: string[] = apiResponse.data.map(d => String(d[originResourceIdx]))
          .filter(this.onlyUnique).sort();
        const destinations: string[] = apiResponse.data.map(d => String(d[destResourceIdx]))
          .filter(this.onlyUnique).sort();

        // [origin,destination,bk]
        // let maxBk = 0;
        // let maxFlights = 0;
        let maxValue = 0;
        const data = []; // contains origins
        for (let i = 0; i < origins.length; i++) {
            for (let j = 0; j < destinations.length; j++) {
                const flightPath: string = origins[i] + destinations[j];
                const flights = apiResponse.data
                  .filter(d => (String(d[originResourceIdx]) + String(d[destResourceIdx])) === flightPath);

                let flightPathTotal = 0;
                if (flights && flights.length > 0) {
                    if (this.zAxisMethod === 'count') {
                        if (flights.length > 0) { flightPathTotal = flights.length; }
                    } else if (this.zAxisMethod === 'sum') {
                        flightPathTotal = flights.map(d => Number(d[bkResourceIdx]))
                          .reduce((a, b) => a + b, 0);
                    }
                }

                maxValue = Math.max(maxValue, flightPathTotal);
                data.push([i, j, flightPathTotal]);
            }
        }

        const bigThis = this;

        const options = {
            tooltip: {
                // backgroundColor: 'rgba(255,0,255,122)'
                formatter: function(params) {
                    const org = origins[params.data.value[0]];
                    const dest = destinations[params.data.value[1]];
                    const bks = params.data.value[2];
                    // console.log('params.data', params.data);
                    // console.log('params.data.value[2]', params.data.value);
                    return `Origin: ${org}<br/>Destination: ${dest}<br/>Bks: ${bks}`;
                }
            },
            xAxis3D: {
                type: 'category',
                data: origins,
                name: 'ORIGIN',
                axisLabel: {
                    interval: 0,
                    color: 'white',
                    hideOverlap: false,
                    fontSize: 10
                },
                nameTextStyle: {
                    color: 'white'
                }
            },
            yAxis3D: {
                type: 'category',
                data: destinations,
                name: 'DESTINATION',
                axisLabel: {
                    interval: 0,
                    color: 'white',
                    hideOverlap: false,
                    fontSize: 10,
                },
                nameTextStyle: {
                    color: 'white'
                }
            },
            zAxis3D: {
                type: 'value',
                name: this.zAxisLabel,
                axisLabel: {
                    color: 'white'
                },
                nameTextStyle: {
                    color: 'white'
                }
            },
            grid3D: {
                boxWidth: 200, // * destinations.length,
                boxDepth: 200, // * origins.length,
                light: {
                    main: { intensity: 1.2 },
                    ambient: { intensity: 0.3 }
                }
            },
            series: [
                {
                    type: 'bar3D',
                    data: data.map(function(item) {
                        console.log(item[2]);
                        const val = item[2];
                        const colorIdx = Math.floor(16 * (val / maxValue));
                        // console.log('item[2], colorIdx', [item[2], colorIdx]);
                        return {
                            value: [item[0], item[1], item[2]],
                            itemStyle: {
                                color: bigThis.colorScale[colorIdx]
                            }
                        };
                    }),
                    shading: 'color',
                    label: {
                        show: false, // not the popup, but the on-graph display on top of the block
                        fontSize: 16,
                        borderWidth: 1
                    },
                    itemStyle: { opacity: 0.4 },
                    emphasis: {
                        label: { fontSize: 20, color: '#900'},
                        itemStyle: { color: '#900'}
                    }
                }
            ]
        };

        return options;
    }

    onlyUnique(value, index: number, self): boolean {
        // this could be an array.prototype extension method
        return self.indexOf(value) === index;
    }
}


