import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fire } from './fire';

describe('Fire', () => {
  let component: Fire;
  let fixture: ComponentFixture<Fire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
