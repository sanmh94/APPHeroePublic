import { ActionHeroesTypes } from "../../enum/actionsHeroes.enum";
import { Heroes } from "../HeroesClass/HeroesClass";

export class HeroesAction {
  public selected         : Heroes;
  public action       : ActionHeroesTypes;
  public viewIndex         : number;

  constructor(selected: Heroes,action: ActionHeroesTypes,viewIndex:number){
    this.selected = selected;
    this.action   = action;
    this.viewIndex = viewIndex;
  }
}
