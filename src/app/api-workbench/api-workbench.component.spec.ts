import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiWorkbenchComponent } from './api-workbench.component';

describe('ApiWorkbenchComponent', () => {
  let component: ApiWorkbenchComponent;
  let fixture: ComponentFixture<ApiWorkbenchComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiWorkbenchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiWorkbenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
