import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntranceInRoomComponent } from './entrance-in-room.component';

describe('EntranceInRoomComponent', () => {
  let component: EntranceInRoomComponent;
  let fixture: ComponentFixture<EntranceInRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntranceInRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntranceInRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
