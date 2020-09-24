import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewdocumentComponent } from './newdocument.component';

describe('NewdocumentComponent', () => {
  let component: NewdocumentComponent;
  let fixture: ComponentFixture<NewdocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewdocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewdocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
