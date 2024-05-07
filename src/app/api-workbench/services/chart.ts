/**
 * Use this interface as the type for whatever is storing all the charts.
 */

export interface Chart {
    chartId: number;
    chartTitle: string;
    chartSubtitle: string;
    getChartFromService();
}