import { Body, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsGuard } from '../../common/guards/wsguard.guard';
import { GetDataReminder } from '../reminder/reminder.model.i';

//Host 3001 , namespace : default = '/'
@WebSocketGateway(3001)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}
  private listUserSocketId: Map<string, string> = new Map<string, string>();
  public user: number = 0;

  @WebSocketServer() public server: Server;
  //Conection
  handleConnection(client: Socket) {
    this.user++;
    console.log('Connection');
    // Get username from Socket
    let userId = client.handshake.query.userId;
    //Get socketId from Socket
    let socketId = client.id;
    // Push username and socketId to Map

    this.listUserSocketId.set(userId, socketId);
    console.log('Users Connection : ' + this.listUserSocketId.size);
  }
  //Disconection
  handleDisconnect(client: Socket) {
    //TODO
    this.user--;
    console.log('Disconnection');
    // Get username from Socket
    let username = client.handshake.query.username;
    // Delete username and socketId to Map
    this.listUserSocketId.delete(username);
  }
  @UseGuards(WsGuard)
  @SubscribeMessage('authentication')
  authenticationSocket() {}
  @SubscribeMessage('getSocketId')
  getNotification(@Body() Users: string[]) {
    Users.forEach(user => {
      if (this.listUserSocketId.get(user)) {
        this.server
          .to(this.listUserSocketId.get(user))
          .emit('getNotification', 'Notification for Schedule ');
      }
    });
  }
  @SubscribeMessage('getDataNotification')
  getDataNotification(
    @Body() dataReminder: GetDataReminder,
  ) {
    dataReminder.userIds.forEach(userId => {
      if (this.listUserSocketId.get(userId.toString())) {
        this.server
          .to(this.listUserSocketId.get(userId.toString()))
          .emit('setPopUpNotification', dataReminder);
      }
    });
  }
}
