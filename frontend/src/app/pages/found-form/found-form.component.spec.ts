import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundFormComponent } from './found-form.component';

describe('FoundFormComponent', () => {
  let component: FoundFormComponent;
  let fixture: ComponentFixture<FoundFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoundFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoundFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
