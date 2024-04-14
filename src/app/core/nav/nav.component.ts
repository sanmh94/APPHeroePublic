import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ViewList } from '../../assets/viewsListConstants';
import { MatIconModule } from '@angular/material/icon';
import {MatTabGroup, MatTabsModule} from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommunicationsService } from '../../services/communications.service';
import { Subscription } from 'rxjs';
import { Heroes } from '../../classes/HeroesClass/HeroesClass';
import { NotificationsService } from '../../services/notifications.service';
import { MessageTypes } from '../../enum/messageTypes.enum';
import { HeroesCacheService } from '../../services/heroes-cache.service';
import { HeroesAction } from '../../classes/HeroeActionClass/HeroeActionClass';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    MatIconModule,
    MatTabsModule,
    CommonModule,
    MatProgressSpinnerModule,
    DashboardComponent
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit,OnDestroy {

  activeLinkIndex         : number;
  navLinks                : any[];
  isLoading               : boolean;
  isInError               : boolean;
  actionPanelInfo             :HeroesAction;
  selectedHeroeSubscription: Subscription;

  constructor(
    private commsService        : CommunicationsService,
    private notificationService : NotificationsService,
    private heroesCacheService  : HeroesCacheService
  ){
    this.activeLinkIndex  = 0;
    this.navLinks         = ViewList.PanelsNames;
    this.isLoading        = true;
    this.isInError        = false;
  }
  ngOnDestroy(): void {
    this.activeLinkIndex  = 0;
    this.isLoading        = true;
    this.selectedHeroeSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.getSuperHeroesInfo();
    this.getSelectedInfoHeroeAndAction();
  }

  private getSuperHeroesInfo(){
    let heroesInfoPromise = this.commsService.getSuperHeroesInfo('heroes.json');
    heroesInfoPromise.then(res=>{
      let infoPromise = res['heroes'].map((heroe:any)=>new Heroes().deserialize(heroe));
      this.heroesCacheService.setHeroesInfo(infoPromise);
      this.isLoading = false;
    }).catch(()=>{
      this.notificationService.openMessage('Error in loading','No Heroes are available',MessageTypes.Error);
      this.isInError = true;
    }
    ).finally(()=>{
      this.isLoading = false;
    })
  }

  getSelectedInfoHeroeAndAction(){
    this.selectedHeroeSubscription = this.commsService.PutSelectedNodeAndAction$.subscribe((info:HeroesAction)=>{
      this.activeLinkIndex = info.viewIndex;
      this.actionPanelInfo = info;
      this.notificationService.openMessage('View Changed','Change to Create/Edit',MessageTypes.Info);
    });
  }
}

