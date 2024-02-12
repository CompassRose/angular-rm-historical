import { Component, Output, EventEmitter } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
    selector: 'ag-grid-checkbox',
    templateUrl: './ag-grid-checkbox.component.html',
    styleUrls: ['./ag-grid-checkbox.component.scss']
})

export class AgGridCheckboxComponent implements AgRendererComponent {

    @Output()
    public updateDetailRows: EventEmitter<any> = new EventEmitter();

    public params: any;

    constructor() { }

    agInit(params) {
        this.params = params;
        //this.afterGuiAttached(params)
        //this.componentParent = this.params.context.componentParent;
        // the grid component can now be accessed - for example: this.componentParent.parentMethod()
    }

    afterGuiAttached(params: IAfterGuiAttachedParams): void {
        //this.input.element.nativeElement.focus();
    }

    onChange(ev) { }

    refresh(params: any): boolean {
        params.data.cbox = params.value
        this.updateDetailRows.emit(params.data)
        params.api.refreshCells(params);
        return false;
    }
}