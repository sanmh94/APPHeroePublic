import { Injectable } from '@angular/core';
import { Heroes } from '../classes/HeroesClass/HeroesClass';
import { HeroesResponse } from '../classes/HeroeResponseClass/HeroeResponseClass';
import { Subject } from 'rxjs';
import { MessageTypes } from '../enum/messageTypes.enum';
import { ActionHeroesTypes } from '../enum/actionsHeroes.enum';

@Injectable({
  providedIn: 'root'
})
export class HeroesCacheService {

  private heroesInfo: Heroes[];

  private PutHeroesInfoChanged = new Subject<any>();
  PutHeroesInfoChanged$ = this.PutHeroesInfoChanged.asObservable();

  sendHeroesInfoChanged(heroesInfo:HeroesResponse){
    this.PutHeroesInfoChanged.next(heroesInfo);
  }

  constructor() {
    this.heroesInfo = new Array();
  }

  setHeroesInfo(heroesInfo:Array<Heroes>){
    this.heroesInfo = heroesInfo;
  }

  modifyHeroeById(heroeId:Number,newInfoHeroe:Heroes){
    let heroeModifyAction = MessageTypes.Error;
    let heroeIndexModify = this.heroesInfo.findIndex(heroe=>heroe.id==heroeId);
    if(heroeIndexModify != -1){
      try {
        this.heroesInfo[heroeIndexModify] = new Heroes().deserialize(newInfoHeroe);;
        heroeModifyAction = MessageTypes.Sucess;
      } catch (error) {

      } finally {
        let heroeInfoMessage = new HeroesResponse(this.heroesInfo,heroeModifyAction,newInfoHeroe,ActionHeroesTypes.Edit);
        this.sendHeroesInfoChanged(heroeInfoMessage);
      }
    }else{
      let heroeInfoMessage = new HeroesResponse(this.heroesInfo,heroeModifyAction,newInfoHeroe,ActionHeroesTypes.Edit);
      this.sendHeroesInfoChanged(heroeInfoMessage);
    }
  }

  addHeroe(heroe:Heroes){
    let heroeModifyAction = MessageTypes.Error;
      try {
        this.heroesInfo.push(heroe);
        heroeModifyAction = MessageTypes.Sucess;
      } catch (error) {

      } finally {
        let heroeInfoMessage = new HeroesResponse(this.heroesInfo,heroeModifyAction,heroe,ActionHeroesTypes.Add);
        this.sendHeroesInfoChanged(heroeInfoMessage);
      }
  }

  deleteHeroeById(heroId){
    let heroeDeleteAction = MessageTypes.Error;
    let heroeIndexDelete = this.heroesInfo.findIndex(heroe=>heroe.id!=heroId);
    let deletedheroe = undefined;
    if(heroeIndexDelete != -1){
      try {
        deletedheroe = this.heroesInfo.splice(heroeIndexDelete -1, 1);
        heroeDeleteAction = MessageTypes.Sucess;
      } catch (error) {

      } finally {
        let heroeInfoMessage = new HeroesResponse(this.heroesInfo,heroeDeleteAction,deletedheroe,ActionHeroesTypes.Delete);
        this.sendHeroesInfoChanged(heroeInfoMessage);
      }
    }else{
      let heroeInfoMessage = new HeroesResponse(this.heroesInfo,heroeDeleteAction,deletedheroe,ActionHeroesTypes.Delete);
      this.sendHeroesInfoChanged(heroeInfoMessage);
    }
  }

  getHeroesInfo(){
    return this.heroesInfo;
  }

  getHeroesNamesAndId(){
    return this.heroesInfo.map(h=>{
      let info ={
        name : h.name,
        id   : h.id
      }
      return info
    });
  }

  getHeroeById(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const heroeInfo = this.heroesInfo.find(h => h.id === id);
      if (heroeInfo !== undefined) {
        resolve(heroeInfo);
      } else {
        reject(new Error('Heroe was not found'));
      }
    });
  }

  getJSONHeroes(){
    return JSON.stringify(this.heroesInfo);
  }
}
