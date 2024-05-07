import { Component, OnInit } from '@angular/core';
import { DashboardFacade } from '../dashboard.facade';
import { QueryMap, QueryMapColumn } from '../models/dashboard.model';
import { BehaviorSubject } from 'rxjs';

import { json } from '@codemirror/lang-json';
import { defaultKeymap } from '@codemirror/commands';
import { defaultHighlightStyle } from '@codemirror/highlight';
import { history, historyKeymap } from '@codemirror/history';
import { basicSetup } from '@codemirror/basic-setup';
import { keymap } from '@codemirror/view';

export interface ColumnStructure {
    name: string;
    container: string;
    count: number;
}
@Component({
    selector: 'app-inventory-table',
    templateUrl: './inventory-table.component.html',
    styleUrls: ['./inventory-table.component.scss']
})

export class InventoryTableComponent implements OnInit {

    public jsonExtensions = [
        basicSetup,
        history(),

        // @ts-ignore
        keymap.of([...defaultKeymap, ...historyKeymap]),
        json(),
        defaultHighlightStyle
    ];

    // Codemirror Options
    public cmOptions = {
        lineNumbers: true,
        theme: 'material',
        autoRefresh: true,
        autoclosetag: true,
        mode: 'javascript',
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        extensions: this.jsonExtensions
    }

    public modelCollection: string[];
    public tableColumnsApiSubject$ = new BehaviorSubject<any[]>([]);
    public jsTemplate: any;
    public columnObjArray: ColumnStructure[] = [];

    constructor(private dashboardFacade: DashboardFacade) {

        this.dashboardFacade.getTableColumnApiData()
            .subscribe((response: any) => {
                console.log('getTableColumnApiData ', response)
                if (response !== null) {
                    const columnCollection: any[] = [];
                    const allContainers = [];
                    this.modelCollection = [];
                    response.columns.forEach((d, i) => {
                        if (d.name && !columnCollection.includes(d.name)) {
                            columnCollection.push(d.name);
                        }
                        if (d.container && !allContainers.includes(d.container)) {
                            allContainers.push(d.container);
                        }
                    })
                    response.models.forEach((d, j) => {
                        if (d.kpiName && !this.modelCollection.includes(d.kpiName)) {
                            this.modelCollection.push(d.kpiName)
                        }
                    })
                    this.jsTemplate = JSON.stringify(response, null, 4);
                    this.dashboardFacade.setMirrorContent(this.jsTemplate);
                    this.tableColumnsApiSubject$.next(this.getColumnCounts(response.columns, columnCollection, allContainers));
                }
            })
    }

    public getColumnCounts(columns: QueryMapColumn[], allColls: string[], containers: string[]) {
        console.log('getColumnCounts ', columns)
        let count: number = 0;
        let container = '';
        const columnObjArray: ColumnStructure[] = allColls.map((d, i) => {
            count = 0;
            columns.forEach((e, j) => {
                if (d === e.name) {
                    containers.forEach((f, k) => {
                        if (e.container && e.container === f) {
                            count += 1;
                            container = f
                        }
                    })
                }
            })
            return { name: d, container: container, count: count }
        })
        return columnObjArray;
    }

    public setColumn(el) {
        // console.log('Setting Column:: ', el)
    }

    ngOnInit(): void { }

    ngOnDestroy(): void { }
}