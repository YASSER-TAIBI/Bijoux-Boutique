import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BraceletsComponent } from './bracelets.component';

describe('BraceletsComponent', () => {
  let component: BraceletsComponent;
  let fixture: ComponentFixture<BraceletsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BraceletsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BraceletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
