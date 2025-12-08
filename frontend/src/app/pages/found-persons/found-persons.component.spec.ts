import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundPersonsComponent } from './found-persons.component';

describe('FoundPersonsComponent', () => {
  let component: FoundPersonsComponent;
  let fixture: ComponentFixture<FoundPersonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoundPersonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoundPersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
