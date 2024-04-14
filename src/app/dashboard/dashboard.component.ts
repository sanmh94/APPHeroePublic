import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FilterListComponent } from '../views/filter-list/filter-list.component';
import { CreateEditComponent } from '../views/create-edit/create-edit.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,FilterListComponent,CreateEditComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit,OnDestroy {

  selectedPanel : number = 0;

  @Input()
  set selectedPanelIndex(index){
    this.selectedPanel = index;
  };

  @Input() actionPanelInfo;

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }
}
