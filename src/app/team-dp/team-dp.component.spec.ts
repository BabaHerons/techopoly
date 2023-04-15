import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamDpComponent } from './team-dp.component';

describe('TeamDpComponent', () => {
  let component: TeamDpComponent;
  let fixture: ComponentFixture<TeamDpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamDpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamDpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
