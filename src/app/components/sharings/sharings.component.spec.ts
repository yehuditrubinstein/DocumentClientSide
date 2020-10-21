import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingsComponent } from './sharings.component';

describe('SharingsComponent', () => {
  let component: SharingsComponent;
  let fixture: ComponentFixture<SharingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
