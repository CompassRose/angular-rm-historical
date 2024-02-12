import { Injectable } from '@angular/core';
import { HistoryData } from '../models/dashboard.model';
import { BehaviorSubject } from 'rxjs';

export type ResultType = {
  [key: string]: any
};

@Injectable()
export class MetricMapper {

  public compFareHeaders: any[] = ['FR', 'EI'];
  public progressionHeaders: any[] = ['LAF', 'LAFPY', 'LoadFactor'];
  public lfFareHeaders: any[] = ['LAF', 'LAFPY', 'AVF_Fare', 'AVF_FarePY'];
  public regionCollection: string[] = [];
  public regionCollectionSubject$ = new BehaviorSubject<string[]>([]);

  // Full Chart data array of objects      
  public lfFareCollection: any[] = [];
  public compFareCollection: any[] = [];
  public progressionCollection: any[] = [];
  public regionSelectedFlights: any[] = [];
  public categorizedFlightData: any[] = [];
  public regionSelectedDestinations: string[] = [];


  public convertValuesToMetricModel = (metricEntity: HistoryData[]): any[] => {
    this.setProgressionDetail(metricEntity);
    return [this.lfFareCollection, this.progressionCollection];
  }

  // Competitive Fare Model
  public convertCompetitiveFareModel = (metricEntity: any[]): any => {
    return this.setCompetitiveFareData(metricEntity, 'compFare');
  }

  public convertCategorizedModel = (metricEntity: any[], region: any[], plot: number, ndoRanges: any[]): any[] => {

    this.categorizedFlightData = metricEntity;

    if (!this.testRegions()) {
      this.regionCollectionSubject$.next(this.getGlobalRegionsList(metricEntity));
    }
    return this.setCategorizedDetail(region, plot, ndoRanges);
  }


  // From Selected regions/plot type selection in New Tile Hacky string compare --TODO remove
  public setCategorizedDetail(regions: any[], plot: number, ndoRanges: any[]): any[] {

    let newRanges: any[] = [];
    if (ndoRanges.length > 0) {
      newRanges = this.getNdoRangeValues(ndoRanges);
    }

    let type: string;
    if (plot === 0) {
      type = "Lf";
    }
    if (plot === 1) {
      type = "Stand";
    }

    this.regionSelectedFlights = [];
    console.log('   --- ', this.categorizedFlightData)
    // Respects selected NDO ranges
    this.categorizedFlightData.map((d: any, i) => {

      regions.forEach((a: any, j) => {

        if (d.Region === a) {
          if (newRanges.length > 0) {
            newRanges.forEach((n, i) => {
              if (+d.Ndo > n.from && +d.Ndo < n.to) {
                this.regionSelectedFlights.push([+d.Ndo, d[type], +d.Ntile, +d.flt, d.Departure, d.Origin, d.Destination, a]);
              }
            })
          } else {

            this.regionSelectedFlights.push([+d.Ndo, d[type], +d.Ntile, +d.flt, d.Departure, d.Origin, d.Destination, a]);
          }
        }
      })
    })
    return this.regionSelectedFlights;
  }

  // returns NDO ranges for Scatter Data
  public getNdoRangeValues(vals: any[]): any[] {
    return vals.map((d, i) => {
      return i !== 0 ? { from: (d.item_id * 50 - 50) + 1, to: d.item_id * 50 } : { from: (d.item_id * 50 - 50), to: d.item_id * 50 };
    })
  }

  // Region list for flight categorization
  public getGlobalRegionsList(data: any): any {
    //console.log('getGlobalRegionsList ', data)
    data.map((d: any, i: number) => {
      if (!this.regionCollection.includes(d.Region)) {

        if (d.Region !== '' && d.Region) {
          this.regionCollection.push(d.Region);
        }
      }
    })
    return this.regionCollection.sort()
  }


  getRegionsList(): string[] {
    return this.regionCollection;
  }

  // runs through region specific destinations
  public setDestinationCollection(): any {
    if (this.regionSelectedFlights.length > 1) {
      this.regionSelectedFlights.map((d: any, i) => {
        if (!this.regionSelectedDestinations.includes(d[6])) {
          this.regionSelectedDestinations.push(d[6])
        }
      })
    }
    return this.regionSelectedDestinations;
  }

  // Generates Region  list
  public testRegions(): boolean {
    let regionState = false;
    this.regionCollectionSubject$
      .subscribe(res => {
        // console.log('regionCollectionSubject$ ', res)
        regionState = res.length > 0 ? true : false;
      })
    return regionState;
  }

  // Selected Flight Details container(right)
  getFilteredResults(indexes: number[]): any[] {
    return indexes.map((d, i) => {
      return this.regionSelectedFlights[d];
    })
  }

  // Sets aggregate collection properties
  private setProgressionStates(type: string, set: any) {
    const test = `${type}Headers`;

    this[test].map((e: any, j: any) => {
      this[`${type}Collection`].push({
        key: this[`${type}Headers`][j],
        max: this.getMaxValues(set[j]),
        value: set[j]
      });
    });
  }


  // Sets competitive fare values and finishes with createSvg
  private setCompetitiveFareData(data: any[], type: string) {

    this[`${type}Headers`].map((e: string | number, j: string | number) => {
      const temp: (number | null)[][] = [];
      data.map((d: any, i) => {
        if (!d[e]) {
          temp.push([null, 0]);
        }
        if (d[e] && d[e] !== undefined) {
          const concat = +d[e];
          temp.push([+concat.toFixed(0), 0]);
        }
      });
      this[`${type}Collection`].push({
        key: this[`${type}Headers`][j],
        max: this.getMaxValues(temp[j]),
        value: temp
      });
    });
    return this[`${type}Collection`];
  }


  // Cache LAF Progression Values
  setProgressionDetail(data: HistoryData[]) {
    const Laf: number[] = [];
    const py: number[] = [];

    const compareArray = [];
    const tempLoadF: number[][] = [];
    const tempLoadFPy: number[][] = [];
    const tempAvgFare: number[][] = [];
    const tempAvgFarePy: number[][] = [];
    const tempLoadFactor: any[] = [];
    const progressionArray = [];


    data.map((d: any, i) => {

      tempLoadF.push([Math.round(Math.floor((d.Bk / d.Cap) * 100)), 0]);
      tempLoadFPy.push([Math.round(Math.floor((d.BkPY / d.CapPY) * 100)), 0]);
      tempAvgFare.push([Math.round(Math.floor((d.Rv / d.Bk))), 0]);
      tempAvgFarePy.push([Math.round(Math.floor((d.RvPY / d.BkPY))), 0]);

      const num = d.Overview !== '' ? Math.floor(Math.random() * 2) + 1 : 0;
      const pholder: any = (d.Bk / d.Cap) * 100;

      tempLoadFactor.push([+pholder.toFixed(0), num]);

      this.progressionHeaders.map((e, j) => {
        switch (e) {
          case 'LAF':
            Laf.push(+d[e]);
            return;
          case 'LAFPY':
            py.push(+d[e]);
            return;
        }
      });
    });

    compareArray.push(tempLoadF, tempLoadFPy, tempAvgFare, tempAvgFarePy);
    progressionArray.push(Laf, py);

    this.setProgressionStates('lfFare', compareArray);
    this.sortChartValuesPerNdo('progression', progressionArray, true);
    this.sortChartValuesPerNdo('progression', tempLoadFactor, false);
  }


  // Set frames for NDO occurances
  private sortChartValuesPerNdo(metric: string, dataset: any[], state: boolean) {


    let vholder = [];
    if (state) {
      this[`${metric}Collection`] = dataset.map((d: any, h: any) => {
        vholder = [];
        for (let i = 0; i < d.length; i++) {
          if (d[i + 1] !== d[i]) {
            vholder.push([d[i], d[i]]);
          } else {
            vholder.push([d[i], 0]);
          }
        }
        return { key: this[`${metric}Headers`][h], max: this.getMaxValues(vholder), value: vholder };
      });
    } else {
      this[`${metric}Collection`].push({ key: this[`${metric}Headers`][2], max: this.getMaxValues(dataset), value: dataset });
    }
  }

  // yAxix Max Values
  private getMaxValues(data: any[]) {
    let max = 0;
    data.forEach((d: (string | number)[], i: any) => {
      if (d[0] > max) {
        max = +d[0];
      }
    });
    return max;
  }
}
