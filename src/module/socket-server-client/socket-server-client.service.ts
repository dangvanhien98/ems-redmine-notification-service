import { URL_SOCKET } from './../../common/environment/api';
import { Reminder } from './../reminder/reminder.model.i';
import { Injectable } from '@nestjs/common';
import * as io from 'socket.io-client';
import { GetDataReminder } from '../reminder/reminder.model.i';
@Injectable()
export class SocketServerClientService {
  public socket: SocketIOClient.Socket;
  constructor() {
    this.socket = io.connect(URL_SOCKET, {
      transports: ['polling', 'websocket'],
      query: { username: 'EMS' },
    });
  }
  getDataNotification(dataReminder: GetDataReminder) {
    console.log('Socket Client getDataNotification');
    this.socket.emit('getDataNotification', dataReminder);
  }
  sendDataReminder(data) {
    this.socket.emit('getDataNotification', data);
  }
}
