import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextForWriteComponent } from './text-for-write.component';

describe('TextForWriteComponent', () => {
  let component: TextForWriteComponent;
  let fixture: ComponentFixture<TextForWriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextForWriteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextForWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
