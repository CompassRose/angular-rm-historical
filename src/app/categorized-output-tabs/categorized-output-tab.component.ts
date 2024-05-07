import { Component, ViewChild, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';

import { DashboardFacade } from '../dashboard.facade';
// Models
import { AppConstants } from '../shared/constants/app.constants';
// Third Party
import { json } from '@codemirror/lang-json';
import { defaultKeymap } from '@codemirror/commands';
import { defaultHighlightStyle } from '@codemirror/highlight';
import { history, historyKeymap } from '@codemirror/history';
import { basicSetup } from '@codemirror/basic-setup';
import { keymap } from '@codemirror/view';
@Component({
  selector: 'categorized-output-tab',
  templateUrl: './categorized-output-tab.component.html',
  styleUrls: ['./categorized-output-tab.component.scss']
})

export class CategorizedOutputTabComponent implements OnInit, AfterViewInit {
  public jsTemplate: any;

  public jsonExtensions = [
    basicSetup,
    history(),
    //@ts-ignore
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
    gutters: ['CodeMirror-foldgutter'],
    extensions: this.jsonExtensions
  }

  public tabActive = 0;
  public categoryOptionsConfig: Array<ColumnOptions>;
  public categoryTabsActive: AnalyticsTabsType;


  constructor(private dashboardFacade: DashboardFacade) { }

  @ViewChild('codeEditor', { static: false }) codeEditor: CodemirrorComponent;

  ngOnInit(): void {

    this.dashboardFacade.getMirrorContent()
      .subscribe(res => {
        this.jsTemplate = res;
      })

    this.categoryOptionsConfig = [
      {
        type: AnalyticsTabsType.AllColumDataSource,
        label: "All",
        showTab: true
      },
      {
        type: AnalyticsTabsType.SelectedColumnDataSource,
        label: "Selected Column",
        showTab: true
      }
    ];

    this.categoryOptionsConfig = this.categoryOptionsConfig.filter(item => item.showTab === true);
  }

  /**
   * @param type
   */

  // Visual Tab
  public onTabChange(e): void {
    this.tabActive = e.index;
  }

  public ngAfterViewInit(): void {
    console.log('editor ', this.codeEditor.codeMirror.getTextArea())
    console.log('options ', this.codeEditor.options)
    console.log('getWrapperElement ', this.codeEditor.codeMirror.getWrapperElement())
    console.log('getDoc ', this.codeEditor.codeMirror.setGutterMarker(5, null, null))
    console.log('getGutterElement ', this.codeEditor.codeMirror.getGutterElement())
    console.log('getTextArea ', this.codeEditor.codeMirror.getTextArea())
  }

  onCategoryOptionsTabClick(type: AnalyticsTabsType) {
    this.categoryTabsActive = type;
  }
}

export class ColumnOptions {
  label: string;
  type: AnalyticsTabsType;
  showTab: boolean;
}

export enum AnalyticsTabsType {
  AllColumDataSource = AppConstants.ALL_COLUMNS,
  SelectedColumnDataSource = AppConstants.SELECTED_COLUMN,
}

