import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeroesComponent } from './table-heroes.component';

describe('TableHeroesComponent', () => {
  let component: TableHeroesComponent;
  let fixture: ComponentFixture<TableHeroesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHeroesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableHeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
