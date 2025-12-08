import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingFormComponent } from './missing-form.component';

describe('MissingFormComponent', () => {
  let component: MissingFormComponent;
  let fixture: ComponentFixture<MissingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
