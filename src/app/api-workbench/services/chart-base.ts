
import { Chart } from './chart';
/**
 * This class mainly provides some helper methods for implementers of Tiles that extend it.
 */
export abstract class ChartBase implements Chart {

    public chartId: number;
    public chartTitle: string;
    public chartWidth: number;
    public chartSubtitle: string;

    protected constructor(chartId: number, chartTitle: string, chartSubtitle: string) {
        this.chartId = chartId;
        this.chartTitle = chartTitle;
        this.chartSubtitle = chartSubtitle;
        this.chartTitle = chartTitle;
    }

    public getChartFromService() { }

}