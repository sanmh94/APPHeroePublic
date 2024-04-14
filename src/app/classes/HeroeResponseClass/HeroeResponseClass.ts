import { ActionHeroesTypes } from "../../enum/actionsHeroes.enum";
import { MessageTypes } from "../../enum/messageTypes.enum";
import { Heroes } from "../HeroesClass/HeroesClass";

export class HeroesResponse {
  public heroes         : Array<Heroes>;
  public status         : MessageTypes;
  public modifyHeroe    : Heroes;
  public action         : ActionHeroesTypes;

  constructor(heroes: Array<Heroes>,status: MessageTypes,heroe: Heroes,action:ActionHeroesTypes){
    this.heroes = heroes;
    this.status   = status;
    this.modifyHeroe   = heroe;
    this.action = action;
  }
}
