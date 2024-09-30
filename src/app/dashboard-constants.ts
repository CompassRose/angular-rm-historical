

export enum ImagePath {
    devPathToAssets = '../../assets/images/',
    prodPathToAssets = ''
}



export const PathToAssets = ImagePath.devPathToAssets;

export const ndoDaysOut = [
    '0 to 50',
    '51 to 100',
    '101 to 150',
    '151 to 200',
    '201 to 250',
    '250 + ',
    '0 to 300'
]

export const scatterRightAxisOptions: any[] = [
    { name: 'Region', value: 0 },
    { name: 'Ntile', value: 1 }
];

export const plotListLeftOptions = [
    "Load Factor",
    "Standardized",
]

export const plotListLeftOptionsObject = [
    { state: false, value: "Load Factor" },
    { state: false, value: "Standardized" },
]


export const marketAnalysisOptions = [
    "RpS",
    "RASM",
    "Slope",
    "AvgFare",
    "Revenue",
    "LoadFactor",

]

export const departureDateOptions: string[] = [
    '21-01-11 - 21-01-15 M-F',
    '21-01-18 - 21-01-22 M-F',
    '21-01-25 - 21-01-29 M-F',
    '21-02-01 - 21-02-05 M-F',
    '21-02-08 - 21-02-12 M-F',
];

export const cabinSelections: string[] = [
    'Eco Cabin: Capacity',
    'Eco Cabin: Load Factor',
    'Eco Cabin: LAF',
    'Eco Cabin: Obk Seats',
];




export const fareClasses = ['Y', 'D', 'B', 'A', 'Z', 'W', 'U', 'S', 'R', 'I', 'L', 'J', 'H', 'K', 'N', 'Q', 'T', 'O'];
export const days = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct'];
export const blueRamp16 = ['#2058A7', '#2A5FAB', '#3467AF', '#3E6EB3', '#4876B8', '#527EBC', '#5C85C0', '#668DC4', '#7094C9', '#7A9CCD', '#84A4D1', '#8EABD5', '#98B3DA', '#A2BADE', '#ACC2E2', '#B6CAE7'];
export const redRamp10 = ['#cb1c1e', '#d2382a', '#d84c36', '#de5e43', '#e46e51', '#e97e5f', '#ef8d6e', '#f39c7e', '#f8aa8e', '#fcb99f'];

export const ThemeCollection = [
    'dark',
    'cool',
    'helianthus',
    'inspired',
    'bee-inspired',
    'dark-digerati',
    'dark-fresh-cut',
    'dark-bold',
    'dark-blue',
    'dark-mushroom',
    'roma',
    'royal',
    'tech-blue',
    'red-velvet',
    'red',
    'azul',
    'fresh-cut'
];


export const jsonContent = `{
    "resourceNames": [
        "ODMasterKey",
        "LegSchedule:FlightNumber",
        "LegSchedule:DepartureDate",
        "LegSchedule:Origin",
        "LegSchedule:Destination",
        "LegSchedule:Equipment",
        "LegSnapshot:Au/FC1",
        "LegSnapshot:Au/FC25",
        "LegInventory:CapacityLF",
        "LegInventory:LidLF",
        "LegInventory:LidLF/Cabin2",
        "LegInventory:LidLF/Cabin3",
        "LegInventory:FlightBk",
        "LegInventory:CabinBk/Cabin2",
        "LegInventory:CabinBk/Cabin3",
        "LegInventory:CabinSA/Cabin1",
        "LegInventory:CabinSA/Cabin2",
        "LegInventory:CabinSA/Cabin3",
        "LegInventory:FlightSA",
        "LegInventory:SA/FC25"
    ],
    "recordLimit": 400
}`


export const heatmapExample =
    `examples.clearChartNodes()
    var singleheatmap = null;
    var chart =  null;
    chart = document.getElementById('chart1');
    singleheatmap = echarts.init(chart);
    var options = examples.verticalCalendarHeatMap("LegSchedule:DepartureDate", "LegInventory:FlightBk", "calendar");
    singleheatmap.setOption(options);`


export const sunburstExample =

    `examples.clearChartNodes()
    var singleSunburst = null;
    var chart = null;
    chart = document.getElementById('chartAll');
    singleSunburst = echarts.init(chart);
    var options = examples.sunburstExample()
    singleSunburst.setOption(options);
    window.addEventListener('resize', examples.refreshChartVisual(singleSunburst));`


export const treeChart =
    `examples.clearChartNodes()
    var singleTree = null;
    var chart =  null;
    chart = document.getElementById('chartAll');
    singleTree = echarts.init(chart);
    var options = examples.treeChart()
    singleTree.setOption(options);
    window.addEventListener('resize', examples.refreshChartVisual(singleTree));`


export const departuresNodeGraph =
    `examples.clearChartNodes();
var singleGraph = null;
var chart = null;
chart = document.getElementById('chartAll');
singleGraph = echarts.init(chart);
var graphBuilder = new rmcharts.FlightPathGraphBuilder();
var graphOptions = graphBuilder.buildOptions(apiResponse);
singleGraph.setOption(graphOptions);
window.addEventListener('resize', examples.refreshChartVisual(singleGraph));`;

export const totalBkCrossGraph =
    `examples.clearChartNodes();
var singleGraph = null;
var chart = null;
chart = document.getElementById('chartAll');
singleGraph = echarts.init(chart);
var graphBuilder = new rmcharts.FlightPath3DBarGraphBuilder()
  .setZAxisResource('LegInventory:FlightBk')
  .setZAxisValueMethod('sum')
  .setZAxisLabel('TotalBk');
var graphOptions = graphBuilder.buildOptions(apiResponse);
singleGraph.setOption(graphOptions);`;


export const treeMap =
    `examples.clearChartNodes()
    var singleTreeMap = null;
    var chart =  null;
    chart = document.getElementById('chartAll');
    singleTreeMap = echarts.init(chart);
    var options = examples.treeMap()
    singleTreeMap.setOption(options);
    window.addEventListener('resize', examples.refreshChartVisual(singleTreeMap));`



export const dualChartsHeatScatter =

    `examples.clearChartNodes()
    var scatterChart = null;
    var chart02 = document.getElementById('chart2');
    var chart01 = document.getElementById('chart1');
    var heatmap = null;
    heatmap = echarts.init(chart01);
    var heatmapOptions = 
    examples.verticalCalendarHeatMap("LegSchedule:DepartureDate", "LegInventory:FlightBk", 'calendar');
    heatmap.setOption(heatmapOptions);
    scatterChart = echarts.init(chart02);
    var scatterChartOptions = 
    examples.dateBasedScatterChart("LegSchedule:DepartureDate", "LegInventory:FlightBk");
    scatterChart.setOption(scatterChartOptions);
    var scoptions =
    new rmcharts.DateBasedScatterChartBuilder("LegSchedule:DepartureDate", "LegInventory:FlightBk")
    .handleValues((item,date) => item * 1)
    .buildOptions(apiResponse);`


export const simpleTableContent =
    `
    var chart =  null;
    chart = document.getElementById('chartAll');
        tableCreateFormat = () => {}
     tableCreateFormat();`



export const jsonContent2 = '{"resourceNames":["ODMasterKey", "FlightNumber", "DepartureDate", "Origin", "Destination","LegSnapshot:Au/FC1","LegSnapshot:Au/FC2", "LegInventory:CapacityLF","LegInventory:LidLF", "LegInventory:LidLF/Cabin3", "LegInventory:FlightBk", "LegInventory:CabinBk/Cabin3"], "recordLimit": 400}';

export const nTile = "M 39.766 0 L 39.766 56.875 L 28.281 56.875 L 11.484 19.57 L 11.484 56.875 L 0 56.875 L 0 0 L 11.484 0 L 28.32 37.344 L 28.32 0 L 39.766 0 Z M 85.82 0 L 85.82 9.57 L 71.758 9.57 L 71.758 56.875 L 60.234 56.875 L 60.234 9.57 L 46.406 9.57 L 46.406 0 L 85.82 0 Z";

export const loadFactor = "M 67.617 24.141 L 67.617 33.672 L 49.766 33.672 L 49.766 56.875 L 38.281 56.875 L 38.281 0 L 69.766 0 L 69.766 9.57 L 49.766 9.57 L 49.766 24.141 L 67.617 24.141 Z M 11.484 0 L 11.484 47.344 L 31.641 47.344 L 31.641 56.875 L 0 56.875 L 0 0 L 11.484 0 Z";

export const activeState = 'path://m399.99012,328.48387l-35.10692,25.50428l13.41998,-41.25577l-35.09902,-25.50428l43.38573,0.0079l11.53107,-35.47443l1.88101,-5.76158l13.39627,41.2281l43.39759,0l-35.11482,25.50428l13.42393,41.26762l-35.11482,-25.51614l0,0z';

export const inactiveState = 'path://m307.5768,228.57689l-0.05491,0l-0.01695,-0.38172l-0.00238,0.05334l-0.01459,0.32845l-0.05489,-0.00007l0.04441,0.23614l-0.01698,0.38198l0.04442,-0.23614l0.04443,0.23625l-0.01698,-0.38209l0.04443,-0.23614zm-0.06599,0.32278l-0.00587,-0.03121l-0.00587,0.03125l-0.01951,0.10369l0.00745,-0.16772l0.00225,-0.05056l-0.00588,-0.03128l-0.0195,-0.10369l0.03137,0l0.00225,-0.05053l0.00744,-0.16772l0.00744,0.16761l0.00224,0.05053l0.0314,0l-0.01953,0.10376l-0.00589,0.03125l0.00224,0.05064l0.00746,0.16772l-0.01951,-0.10373z';

export const lockSymbol = 'path://m429.3797,291.91432l0,-15.27656l-0.00464,0c-0.00464,-18.85582 -13.15246,-34.13777 -29.37507,-34.13777s-29.37507,15.28734 -29.37507,34.14316l0,0l0,15.27117l-10.62493,0l0,65.5857l79.99999,0l0,-65.5857l-10.62029,0zm-49.47478,-15.27117c0,0 0,0 0,0c0,-12.88319 9.01565,-23.36224 20.09507,-23.36224c11.08869,0 20.10435,10.47905 20.10435,23.35685c0,0 0,0 0,0l0,15.27656l-40.19942,0l0,-15.27117z';

export const unlockSymbol = 'path://m420.68437,291.56275l-10.39631,0l0,-15.93513c0,0 0,0 0,-0.00562c0,-13.43771 9.15383,-24.37237 20.39728,-24.37237c11.25286,0 20.40198,10.93466 20.40198,24.37237c0,0 0,0 0,0l0,15.94075l9.41268,0l0,-15.94075l-0.00471,0c-0.00471,-19.67564 -13.34718,-35.62202 -29.80996,-35.62202s-29.80996,15.952 -29.80996,35.62764l0,15.93513l-61.37538,0l0,68.43725l81.18437,0l0,-68.43725z';

export const arrowUpPath = 'path://m335.99999,299.84654l64,-63.78502l64,63.78502l-32,0l0,64.09194l-64,0l0,-64.09194l-32,0z';

export const arrows = 'M1.62687,11.5001C1.62687,11.6328,1.67955,11.7599,1.77332,11.8537C1.86709,11.9475,1.99426,12.0001,2.12687,12.0001H13.9199L10.7729,15.1461C10.679,15.24,10.6262,15.3674,10.6262,15.5001C10.6262,15.6329,10.679,15.7603,10.7729,15.8541C10.8668,15.948,10.9941,16.0008,11.1269,16.0008C11.2596,16.0008,11.387,15.948,11.4809,15.8541L15.4809,11.8541C15.5274,11.8077,15.5644,11.7525,15.5896,11.6918C15.6148,11.631,15.6278,11.5659,15.6278,11.5001C15.6278,11.4344,15.6148,11.3693,15.5896,11.3085C15.5644,11.2478,15.5274,11.1926,15.4809,11.1461L11.4809,7.14614C11.387,7.05226,11.2596,6.99951,11.1269,6.99951C10.9941,6.99951,10.8668,7.05226,10.7729,7.14614C10.679,7.24003,10.6262,7.36737,10.6262,7.50014C10.6262,7.63292,10.679,7.76026,10.7729,7.85414L13.9199,11.0001H2.12687C1.99426,11.0001,1.86709,11.0528,1.77332,11.1466C1.67955,11.2404,1.62687,11.3675,1.62687,11.5001ZM15.6269,4.50014C15.6269,4.63275,15.5742,4.75993,15.4804,4.8537C15.3867,4.94746,15.2595,5.00014,15.1269,5.00014H3.33387L6.48087,8.14614C6.52736,8.19263,6.56423,8.24782,6.58939,8.30856C6.61455,8.3693,6.6275,8.4344,6.6275,8.50014C6.6275,8.56589,6.61455,8.63099,6.58939,8.69173C6.56423,8.75247,6.52736,8.80766,6.48087,8.85414C6.43438,8.90063,6.37919,8.93751,6.31845,8.96267C6.25771,8.98783,6.19261,9.00077,6.12687,9.00077C6.06113,9.00077,5.99603,8.98783,5.93529,8.96267C5.87455,8.93751,5.81936,8.90063,5.77287,8.85414L1.77287,4.85414C1.72631,4.8077,1.68936,4.75252,1.66416,4.69178C1.63895,4.63103,1.62598,4.56591,1.62598,4.50014C1.62598,4.43438,1.63895,4.36926,1.66416,4.30851C1.68936,4.24776,1.72631,4.19259,1.77287,4.14614L5.77287,0.146143C5.86676,0.0522567,5.99409,-0.000488281,6.12687,-0.000488281C6.25965,-0.000488281,6.38698,0.0522567,6.48087,0.146143C6.57476,0.24003,6.6275,0.367368,6.6275,0.500143C6.6275,0.632919,6.57476,0.760257,6.48087,0.854143L3.33387,4.00014H15.1269C15.2595,4.00014,15.3867,4.05282,15.4804,4.14659C15.5742,4.24036,15.6269,4.36754,15.6269,4.50014Z'

import { Injectable } from '@angular/core';

@Injectable()
export class AppConstants {

    public static contextKey = 'SESSION_ROOT_CONTEXT';

    public static ALL_COLUMNS = 1;
    public static SELECTED_COLUMN = 2;


    public static planePath = 'path://M.6,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705';

    public static zoomIcon = "m351.28457,253.32421c4.8775,-8.04279 7.73795,-17.4523 7.74303,-27.54262c-0.00508,-29.43265 -23.83877,-53.27143 -53.25618,-53.28159c-29.42249,0.01016 -53.26635,23.84893 -53.26635,53.27651c0,29.41233 23.84385,53.2511 53.26635,53.2511c10.09541,0 19.50491,-2.86045 27.5477,-7.73795l36.21542,36.21034l17.96037,-17.97053l-36.21034,-36.20526zm-45.51316,5.39573c-18.19917,-0.04065 -32.91295,-14.75443 -32.94344,-32.94344c0.03048,-18.19917 14.74935,-32.91295 32.94344,-32.9536c18.18392,0.04065 32.91295,14.75443 32.94344,32.9536c-0.03557,18.189 -14.75951,32.90279 -32.94344,32.94344zm10.15637,-57.50367l-20.32291,0l0,14.3937l-14.3937,0l0,20.32799l14.3937,0l0,14.3937l20.32291,0l0,-14.39878l14.38862,0l0,-20.31783l-14.3937,0l0,-14.39878l0.00508,0z";

    public static zoomOutIcon = "m359.66241,252.63332c4.62459,-7.62576 7.33672,-16.54736 7.34154,-26.11449c-0.00482,-27.90652 -22.60269,-50.5092 -50.49475,-50.51884c-27.89688,0.00963 -50.50439,22.61232 -50.50439,50.51402c0,27.88725 22.60751,50.48994 50.50439,50.48994c9.57194,0 18.49355,-2.71213 26.1193,-7.33672l34.33759,34.33277l17.02909,-17.03873l-34.33277,-34.32795zm-43.15321,5.11595c-17.25551,-0.03854 -31.20635,-13.98939 -31.23526,-31.23526c0.0289,-17.25551 13.98457,-31.20635 31.23526,-31.24489c17.24105,0.03854 31.20635,13.98939 31.23526,31.24489c-0.03372,17.24587 -13.99421,31.19672 -31.23526,31.23526zm-23.28674,-40.87464l0,19.27395l46.55903,-0.00482l0,-19.26431l-46.55903,-0.00482z";

    public static arrowUpPath = 'path://m335.99999,299.84654l64,-63.78502l64,63.78502l-32,0l0,64.09194l-64,0l0,-64.09194l-32,0z';

    public static returnHome = 'm427.69446,300l-43.74271,-32.5l0,16.25l-46.95175,0l0,-48.75l126,0l0,130l-126,0l0,-48.75l46.95175,0l0,16.25l43.74271,-32.5z';

    public static zoominPath = 'M8,12H12M12,12H16M12,12V16M12,12V8M4,16.8002V7.2002C4,6.08009,4,5.51962,4.21799,5.0918C4.40973,4.71547,4.71547,4.40973,5.0918,4.21799C5.51962,4,6.08009,4,7.2002,4H16.8002C17.9203,4,18.4801,4,18.9079,4.21799C19.2842,4.40973,19.5905,4.71547,19.7822,5.0918C20.0002,5.51962,20.0002,6.07967,20.0002,7.19978V16.7998C20.0002,17.9199,20.0002,18.48,19.7822,18.9078C19.5905,19.2841,19.2842,19.5905,18.9079,19.7822C18.4805,20,17.9215,20,16.8036,20H7.19691C6.07899,20,5.5192,20,5.0918,19.7822C4.71547,19.5905,4.40973,19.2842,4.21799,18.9079C4,18.4801,4,17.9203,4,16.8002Z';
    public static zoomoutPath = 'M8 12H16M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z';

    public static editButton = 'm436.05827,302.62712l12.44172,-6.58037c-0.24458,-2.4381 -0.71727,-4.80321 -1.3086,-7.12823l-13.82097,-1.91386c-1.19625,-2.88172 -2.77595,-5.55443 -4.63285,-8.00785l5.26837,-12.95709c-1.73234,-1.68947 -3.60319,-3.22977 -5.57229,-4.64708l-11.7358,7.36758c-2.75206,-1.44725 -5.71714,-2.54645 -8.82976,-3.25241l-4.24114,-13.13906c-1.20283,-0.09083 -2.40531,-0.18679 -3.63196,-0.18679s-2.42573,0.09375 -3.63217,0.18679l-4.19912,13.02268c-3.19606,0.68334 -6.22661,1.79531 -9.0494,3.26042l-11.55303,-7.25921c-1.96661,1.41731 -3.83739,2.95762 -5.56959,4.64708l5.12339,12.59919c-1.99685,2.55923 -3.66866,5.38297 -4.92434,8.42629l-13.38466,1.85111c-0.58884,2.32175 -1.064,4.68435 -1.30606,7.12793l12.01306,6.35592c0.1361,3.34578 0.69081,6.58839 1.67308,9.64192l-9.062,10.01982c1.05415,2.18643 2.22778,4.30681 3.58547,6.29612l13.34176,-2.86421c2.18748,2.38009 4.67975,4.46543 7.42946,6.18994l-0.5057,13.65061c2.19116,0.98824 4.46781,1.81532 6.81397,2.47642l8.44057,-10.84951c1.49762,0.19119 3.01416,0.31997 4.56097,0.31997c1.67569,0 3.31442,-0.15138 4.92676,-0.37291l8.48452,10.9097c2.34984,-0.66034 4.62303,-1.48737 6.81397,-2.47567l-0.51546,-13.89575c2.62084,-1.69673 4.99734,-3.72664 7.0925,-6.01846l13.68873,2.93721c1.3577,-1.98901 2.53149,-4.10713 3.58526,-6.29539l-9.35551,-10.34788c0.89871,-2.8923 1.40072,-5.94552 1.54688,-9.09498l0,0zm-20.67906,15.80663l-5.89884,3.84013l-3.62818,-5.57443c-1.88743,0.72599 -3.91947,1.16743 -6.06156,1.16743c-9.35547,0 -16.93721,-7.58472 -16.93721,-16.93874c0,-9.3544 7.58174,-16.93619 16.93721,-16.93619c9.35303,0 16.93754,7.58178 16.93754,16.93619c0,4.67448 -1.89363,8.90016 -4.95455,11.96613l3.60558,5.53948z'

}
