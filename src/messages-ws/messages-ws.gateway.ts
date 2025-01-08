import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
      
    } catch (error) {
      client.disconnect();
      return;
    }
    
    // console.log('Cliente conectado: ', client.id);
    
    // console.log({conectados: this.messagesWsService.getConnectedClients()});
    this.server.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado: ', client.id);
    this.messagesWsService.removeClient(client.id);
    // console.log({conectados: this.messagesWsService.getConnectedClients()});
    this.server.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  // message-from-client
  // Decorador el cual va a esperar el evento que estamos escuchando
  @SubscribeMessage('message-from-client')
  async onMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emite unicamente al cliente.
    // client.emit('message-from-server', {
    //   fullName: 'SOY YO',
    //   message: payload.message || 'no-message'
    // });
    //! Emite a todos MENOS al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'SOY YO',
    //   message: payload.message || 'no-message'
    // });

    //! Emite a todos a todos
    this.server.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message'
    });
  }

}
