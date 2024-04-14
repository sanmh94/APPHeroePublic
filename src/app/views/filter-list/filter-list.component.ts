import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { TableHeroesComponent } from '../../table-heroes/table-heroes.component';
import { Heroes } from '../../classes/HeroesClass/HeroesClass';
import { ActionHeroesTypes } from '../../enum/actionsHeroes.enum';
import { Action } from 'rxjs/internal/scheduler/Action';
import { HeroesAction } from '../../classes/HeroeActionClass/HeroeActionClass';
import { CommunicationsService } from '../../services/communications.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog/delete-dialog.component';
import { NotificationsService } from '../../services/notifications.service';
import { MessageTypes } from '../../enum/messageTypes.enum';
import { HeroesCacheService } from '../../services/heroes-cache.service';
import { ViewList } from '../../assets/viewsListConstants';
import { CommonTaskService } from '../../services/common-task.service';

@Component({
  selector: 'app-filter-list',
  standalone: true,
  imports: [MatIconModule,MatButtonModule, MatTooltipModule,TableHeroesComponent,DeleteDialogComponent],
  templateUrl: './filter-list.component.html',
  styleUrl: './filter-list.component.css'
})
export class FilterListComponent {

  selection: Heroes;
  actionHeroes = ActionHeroesTypes;
  tableModify :boolean = false;

  @Output() changeViewSelection:EventEmitter<HeroesAction> = new EventEmitter()

  constructor(
    private communicationService : CommunicationsService,
    public dialog: MatDialog,
    private notificationsService : NotificationsService,
    private heroesCacheService : HeroesCacheService,
    private commonTask : CommonTaskService
  ){
  }

  listenerSelection(event){
    this.selection = event;
  }

  editHeroe(action:ActionHeroesTypes){
    let heroeSelected = new HeroesAction(this.selection,action,ViewList.PanelsNames[1].index)
    this.communicationService.sendSelectedNodeAndAction(heroeSelected);
  }

  downloadTableAsCsv(){
    let infoHeroes = this.heroesCacheService.getHeroesInfo();
    this.commonTask.downloadJSONAsCSV(infoHeroes,'Heroes');
  }

  deleteHeroe(){
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data:{heroe:this.selection},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res=>{
      if(res!=undefined && res.action == 1){
        try {
          this.heroesCacheService.deleteHeroeById(this.selection.id);
          this.notificationsService.openMessage('Heroe deleted',`${res.heroe.name} was deleted`,MessageTypes.Sucess);
        } catch (error) {
          this.notificationsService.openMessage('Heroe deleted',`${res.heroe.name} was deleted`,MessageTypes.Error);
        }
      }else if(res.action == 0){
        this.notificationsService.openMessage('No Heroe deleted',`${res.heroe.name} was not deleted`,MessageTypes.Info);
      }
    })
  }
}
