import { Component, EventEmitter, Input, OnDestroy, OnInit,Output,ViewChild } from '@angular/core';
import { HeroesCacheService } from '../services/heroes-cache.service';
import { Heroes } from '../classes/HeroesClass/HeroesClass';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { HeroesResponse } from '../classes/HeroeResponseClass/HeroeResponseClass';
import { MessageTypes } from '../enum/messageTypes.enum';
import { ActionHeroesTypes } from '../enum/actionsHeroes.enum';
import { NotificationsService } from '../services/notifications.service';
import { HeroesAction } from '../classes/HeroeActionClass/HeroeActionClass';
import { ViewList } from '../assets/viewsListConstants';
import { CommunicationsService } from '../services/communications.service';
import {MatSort, MatSortModule} from '@angular/material/sort';

@Component({
  selector: 'app-table-heroes',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule,
    CommonModule,MatPaginatorModule,MatProgressSpinnerModule,MatSort, MatSortModule],
  templateUrl: './table-heroes.component.html',
  styleUrl: './table-heroes.component.css'
})
export class TableHeroesComponent implements OnInit, OnDestroy {

  isLoading                   : boolean;
  ELEMENT_DATA                : Heroes[];
  displayedColumns            : string[] = ['name','power'];
  dataSource                  : MatTableDataSource<Heroes>;
  clickedRow                 :Heroes;
  tableModifySubscription : Subscription;

  @Output() selectionEmiter: EventEmitter<Heroes> = new EventEmitter();

  @ViewChild(MatPaginator) paginator;
  @ViewChild('sort') sort: MatSort;

  constructor(
    private heroesCacheService: HeroesCacheService,
    private notificationsService : NotificationsService,
    private communicationService : CommunicationsService
  ){
    this.isLoading = true;
    this.ELEMENT_DATA = new Array();
  }
  ngOnInit(): void {
    this.initTable();
    this.getHeroesInfoModify();
  }

  initTable(){
    this.ELEMENT_DATA = this.heroesCacheService.getHeroesInfo();
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.clickedRow = this.dataSource.data[0];
    this.selectionEmiter.emit(this.clickedRow );
    this.dataSource.filterPredicate = (data, filter) => {
      return data.name.includes(filter.trim().toLowerCase());
    };
  }

  getMessage(action){
    if(action == ActionHeroesTypes.Delete){
      return'deleted';
    }else if(action == ActionHeroesTypes.Add){
      return 'added';
    }else{
      return 'edited';
    }
  }

  clearTable() {
    this.dataSource.data = [];
  }

  getHeroesInfoModify(){
    this.tableModifySubscription = this.heroesCacheService.PutHeroesInfoChanged$.subscribe((res:HeroesResponse)=>{
      let messageAction = this.getMessage(res.action);
      let heroeSelected = new HeroesAction(res.modifyHeroe,res.action,ViewList.PanelsNames[0].index)
      this.communicationService.sendSelectedNodeAndAction(heroeSelected);
        if(res.status == MessageTypes.Sucess){
          this.isLoading = true;
          this.initTable();
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
          this.notificationsService.openMessage(`Heroe ${messageAction}`,`${res.modifyHeroe.name} was ${messageAction}`,MessageTypes.Sucess);
        }else{
          this.notificationsService.openMessage(`Heroe not ${messageAction}`,`${res.modifyHeroe.name} was not ${messageAction}`,MessageTypes.Error);
        }
    })
  }

  ngOnDestroy(): void {
    this.tableModifySubscription.unsubscribe();
    this.clearTable();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = false;
  }

  clickRow(row){
    this.clickedRow = row;
    this.selectionEmiter.emit(row);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
