export class SocketGatewayMock{
    public handleConnection = jest.fn();
    public handleDisconnect = jest.fn();
    public getNotification = jest.fn();
    public getDataNotification = jest.fn();
}
