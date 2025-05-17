import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityCheckerComponent } from './availability-checker.component';

describe('AvailabilityCheckerComponent', () => {
  let component: AvailabilityCheckerComponent;
  let fixture: ComponentFixture<AvailabilityCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityCheckerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailabilityCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
