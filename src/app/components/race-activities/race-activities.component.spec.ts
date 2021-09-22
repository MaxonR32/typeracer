import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceActivitiesComponent } from './race-activities.component';

describe('RaceActivitiesComponent', () => {
  let component: RaceActivitiesComponent;
  let fixture: ComponentFixture<RaceActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaceActivitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
