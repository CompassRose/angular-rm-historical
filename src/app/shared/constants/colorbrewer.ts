// This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).

export const EchartThemes = [
    // { key: 'GnBu', value: ['#a3aaff', '#959cff', '#878fff', '#7a81ff', '#6c72ff', '#5d63ff', '#4e54ff', '#3d43ff', '#2a30ff', '#0714ff'] },
    { key: 'dark', value: ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42'] },
    { key: 'essos', value: ['#893448', '#d95850', '#eb8146', '#ffb248', '#f2d643', '#ebdba4'] },
    { key: 'walden', value: ['#3fb1e3', '#6be6c1', '#626c91', '#a0a7e6', '#c4ebad', '#96dee8'] },
    { key: 'vintage', value: ['#d87c7c', '#919e8b', '#d7ab82', '#6e7074', '#61a0a8', '#efa18d', '#787464', '#cc7e63', '#724e58', '#4b565b'] },
    { key: 'westeros', value: ['#516b91', '#59c4e6', '#edafda', '#93b7e3', '#a5e7f0', '#cbb0e3'] },
    { key: 'wonderland', value: ['#4ea397', '#22c3aa', '#7bd9a5', '#d0648a', '#f58db2', '#f2b3c9'] },
    { key: 'chalk', value: ['#fc97af', '#87f7cf', '#f7f494', '#72ccff', '#f7c5a0', '#d4a4eb', '#d2f5a6', '#76f2f2'] },
    { key: 'infographic', value: ['#C1232B', '#27727B', '#FCCE10', '#E87C25', '#B5C334', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD', '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'] },
    { key: 'macarons', value: ['#008acd', '#aaaaaa', '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa', '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050', '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'] },
    { key: 'Roma', value: ['#E01F54', '#001852', '#f5e8c8', '#b8d2c7', '#c6b38e', '#a4d8c2', '#f3d999', '#d3758f', '#dcc392', '#2e4783', '#82b6e9', '#ff6347', '#a092f1', '#0a915d', '#eaf889', '#6699FF', '#ff6666', '#3cb371', '#d5b158', '#38b6b6'] },
    { key: 'Roma2', value: ['#e01f54', '#0b4fe3', '#f5e8c8', '#b8d2c7', '#c6b38e', '#a4d8c2', '#f3d999', '#d3758f', '#dcc392', '#2e4783', '#82b6e9', '#ff6347', '#a092f1', '#0a915d', '#eaf889', '#6699ff', '#ff6666', '#3cb371', '#d5b158', '#38b6b6'] },
    { key: 'Shine', value: ['#c12e34', '#e6b600', '#0098d9', '#2b821d', '#005eaa', '#339ca8', '#cda819', '#32a487'] },
    { key: 'PurplePassion', value: ['#8a7ca8', '#e098c7', '#8fd3e8', '#71669e', '#cc70af', '#7cb4cc'] },
    { key: 'Halloween', value: ['#ff715e', '#ffaf51', '#ffee51', '#8c6ac4', '#715c87'] },
];

export const Colorbrewer = {
    Accent: {
        3: ['#7fc97f', '#beaed4', '#fdc086'],
        4: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99'],
        5: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0'],
        6: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f'],
        7: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17'],
        8: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666']
    }, Dark2: {
        3: ['#1b9e77', '#d95f02', '#7570b3'],
        4: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a'],
        5: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e'],
        6: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02'],
        7: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d'],
        8: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666']
    }, Paired: {
        3: ['#a6cee3', '#1f78b4', '#b2df8a'],
        4: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c'],
        5: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
        6: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c'],
        7: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f'],
        8: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00'],
        9: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6'],
        10: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a'],
        11: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99'],
        12: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928']
    }, Pastel1: {
        3: ['#fbb4ae', '#b3cde3', '#ccebc5'],
        4: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4'],
        5: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6'],
        6: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc'],
        7: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd'],
        8: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec'],
        9: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2']
    }, Pastel2: {
        3: ['#b3e2cd', '#fdcdac', '#cbd5e8'],
        4: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4'],
        5: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9'],
        6: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae'],
        7: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc'],
        8: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc']
    }, Set1: {
        3: ['#e41a1c', '#377eb8', '#4daf4a'],
        4: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3'],
        5: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'],
        6: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33'],
        7: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628'],
        8: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf'],
        9: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999']
    }, Set2: {
        3: ['#66c2a5', '#fc8d62', '#8da0cb'],
        4: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3'],
        5: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854'],
        6: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f'],
        7: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494'],
        8: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3']
    }, Set3: {
        3: ['#8dd3c7', '#ffffb3', '#bebada'],
        4: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072'],
        5: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3'],
        6: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462'],
        7: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69'],
        8: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5'],
        9: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9'],
        10: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd'],
        11: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5'],
        12: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f']
    }
};
