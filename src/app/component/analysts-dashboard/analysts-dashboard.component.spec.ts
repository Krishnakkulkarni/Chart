import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystsDashboardComponent } from './analysts-dashboard.component';

describe('AnalystsDashboardComponent', () => {
  let component: AnalystsDashboardComponent;
  let fixture: ComponentFixture<AnalystsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalystsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalystsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
