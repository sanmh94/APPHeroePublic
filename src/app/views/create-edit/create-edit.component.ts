import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule }  from '@angular/forms';
import { ActionHeroesTypes } from '../../enum/actionsHeroes.enum';
import { HeroesAction } from '../../classes/HeroeActionClass/HeroeActionClass';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import { HeroesCacheService } from '../../services/heroes-cache.service';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { NotificationsService } from '../../services/notifications.service';
import { MessageTypes } from '../../enum/messageTypes.enum';
import { CommunicationsService } from '../../services/communications.service';
import { Heroes } from '../../classes/HeroesClass/HeroesClass';
import { ViewList } from '../../assets/viewsListConstants';
import { CommonTaskService } from '../../services/common-task.service';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-edit',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule,
    ReactiveFormsModule,CommonModule,MatSelectModule,MatButtonModule,ConfirmDialogComponent,
    MatCardModule, MatDividerModule, MatButtonModule, MatProgressBarModule,MatSlideToggleModule],
  templateUrl: './create-edit.component.html',
  styleUrl: './create-edit.component.css'
})
export class CreateEditComponent {

  heroesForm;
  actionTitle : string;
  actionIcon  :string;
  publishers = ['DC','Marvel'];
  heroesAction = ActionHeroesTypes.Add;

  @Input()
  set actionPanelInfo(actionInfo:HeroesAction){
    if(actionInfo!=undefined){
      this.heroesAction = actionInfo.action;
      if(actionInfo.action == ActionHeroesTypes.Add){
        this.createForm('','',this.publishers[0],true,1,true);
        this.actionTitle = 'Add Heroe';
        this.actionIcon  = 'person_add';
      }else if(actionInfo.action == ActionHeroesTypes.Edit){
        this.actionTitle = 'Edit Heroe';
        this.actionIcon  = 'edit';
        let heroeInfo = actionInfo.selected;
        this.createForm(this.commonTask.capitalizeFirstLetter(heroeInfo.name),heroeInfo.power,heroeInfo.publisher,
          heroeInfo.active,heroeInfo.films,false,heroeInfo.id);
      }
    }
  }

  constructor(
    private cacheService : HeroesCacheService,
    private notificationsService : NotificationsService,
    private commonTask : CommonTaskService,
    public dialog: MatDialog,
    public communicationService: CommunicationsService
  ){
    this.createForm('','',this.publishers[0],true,1,true);
    this.actionTitle = 'Add Heroe';
    this.actionIcon  = 'person_add';
  }

  createForm(name,power,publisher,active,films,disable,id?){
    let heroesNames = this.cacheService.getHeroesNamesAndId();
    let idNumber = id || heroesNames.length;
    this.heroesForm = new FormGroup({
      id: new FormControl(idNumber),
      name:  new FormControl(name,[Validators.required,
        Validators.maxLength(20),this.forbiddenValuesValidator(heroesNames)]),
      power: new FormControl(power,[Validators.maxLength(128)]),
      publisher: new FormControl(publisher,[Validators.required]),
      active : new FormControl({value:active,disabled:disable}),
      films : new FormControl(films,[Validators.min(1),Validators.max(20)])
    });
    this.getFormActiveFieldChange();
  }

  getFormActiveFieldChange(){
    this.heroesForm.get('active').valueChanges.subscribe(activeValue => {
      if(this.heroesForm.invalid){
        this.notificationsService.openMessage('Forbiden action','Fix errors',MessageTypes.Error);
      }else{
        if (this.heroesForm.get('active').value) {
          this.notificationsService.openMessage('Status changed','Is enabled',MessageTypes.Sucess);
          this.heroesForm.get('name').enable();
          this.heroesForm.get('power').enable();
          this.heroesForm.get('publisher').enable();
          this.heroesForm.get('films').enable();
        } else {
          this.notificationsService.openMessage('Status changed','Is disabled',MessageTypes.Sucess);
          this.heroesForm.get('name').disable();
          this.heroesForm.get('power').disable();
          this.heroesForm.get('publisher').disable();
          this.heroesForm.get('films').disable();
        }
      }
    });
  }

  submitForm(): void {
    let heroesInfo = this.getFormValues();
    if(this.heroesAction == ActionHeroesTypes.Edit){
      this.cacheService.modifyHeroeById(heroesInfo.id,heroesInfo);
    }else{
      this.cacheService.addHeroe(heroesInfo);
    }
  }

  getFormValues():Heroes{
    let formInfo = this.heroesForm.controls;
    let infoHeroe = new Heroes();
    infoHeroe.active = formInfo.active.value;
    infoHeroe.films = formInfo.films.value;
    infoHeroe.id = formInfo.id.value;
    infoHeroe.name = formInfo.name.value;
    infoHeroe.power = formInfo.power.value;
    infoHeroe.publisher = formInfo.publisher.value;
    return infoHeroe;
  }

  forbiddenValuesValidator(forbiddenValues: any[]) {
    return (control: FormControl) => {
      const controlValue = control.value.toLowerCase().trim();
      const controlId =  this.heroesForm?.value?.id;

      if (forbiddenValues.some(item => {
        const name = item.name.toLowerCase().trim();
        const id = item.id.toString();
        return name == controlValue && id != controlId;
      })) {
        return { 'forbiddenValue': true };
      }
      return null;
    };
  }

  async cancel(){
    let heroeId = this.heroesForm.controls.id.value;
    let heroeSelected = new HeroesAction(null,ActionHeroesTypes.Navigate,ViewList.PanelsNames[0].index)
    await this.cacheService.getHeroeById(heroeId).then(res=>{
      heroeSelected.selected = res;
    }).catch(()=>{
      this.notificationsService.openMessage('Aborted action','Page does not change',MessageTypes.Error);
    }).finally(()=>{
      if(this.heroesForm.touched){
        let dialogRef = this.dialog.open(ConfirmDialogComponent,{
          disableClose:true
        });
        dialogRef.afterClosed().subscribe(res=>{
          if(res.action == 1){//Cambiar
            this.notificationsService.openMessage('Changed information lost','',MessageTypes.Warning);
            this.communicationService.sendSelectedNodeAndAction(heroeSelected);
          }else{
            this.notificationsService.openMessage('Aborted action','Page does not change',MessageTypes.Warning);
          }
        })
        }else{
          this.communicationService.sendSelectedNodeAndAction(heroeSelected);
        }
    })

  }
}
