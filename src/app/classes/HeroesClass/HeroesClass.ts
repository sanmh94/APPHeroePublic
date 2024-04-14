export class Heroes {
  public id         : Number;
  public name       : String;
  public power      : String;
  public publisher  : String;
  public films      : Number;
  public active     : Boolean;

  constructor(){
    this.id         = 0;
    this.name       = "";
    this.power      = "";
    this.publisher  = "";
    this.films      = 0;
    this.active     = false;
  }

  deserialize(input:any){
    this.id         = input.id;
    this.name       = input.name;
    this.power      = input.power;
    this.publisher  = input.publisher;
    this.films      = input.films;
    this.active     = input.active;
    return this;
  }
}
