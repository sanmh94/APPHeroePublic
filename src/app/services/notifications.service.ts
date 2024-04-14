import { Injectable } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { MessageTypes } from '../enum/messageTypes.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private toast : NgToastService) {

  }

  openMessage(message:string,subMessage:string,type:MessageTypes){
    switch (type) {
      case MessageTypes.Error:
        this.toast.error({detail:message,summary:subMessage,position:'bottomRight',sticky:false,duration:3000});
        break;
      case MessageTypes.Warning:
        this.toast.warning({detail:message,summary:subMessage,position:'bottomRight',sticky:false,duration:3000});
        break;
      case MessageTypes.Info:
        this.toast.info({detail:message,summary:subMessage,position:'bottomRight',sticky:false,duration:3000});
        break;
      default:
        this.toast.success({detail:message,summary:subMessage,position:'bottomRight',sticky:false,duration:3000});
        break;
    }
  }
}
