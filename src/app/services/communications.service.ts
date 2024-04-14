import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HeroesAction } from '../classes/HeroeActionClass/HeroeActionClass';

@Injectable({
  providedIn: 'root'
})
export class CommunicationsService {


  constructor()
  {}

  async getSuperHeroesInfo(fileName:string){
    let response = await fetch(`assets/${fileName}`);
    if(response.ok){
      return response.json();
    }else{
      return Promise.reject(response);
    }
  }

  private PutSelectedNodeAndAction = new Subject<any>();
  PutSelectedNodeAndAction$ = this.PutSelectedNodeAndAction.asObservable();

  sendSelectedNodeAndAction(heroeInfo:HeroesAction){
    this.PutSelectedNodeAndAction.next(heroeInfo);
  }
}
