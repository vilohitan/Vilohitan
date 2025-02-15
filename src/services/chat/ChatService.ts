import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
@Injectable()
export class ChatService {
  @WebSocketServer()
  server: Server;

  private readonly timestamp = '2025-02-15 07:48:34';
  private readonly currentUser = 'vilohitan';

  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>
  ) {}

  async sendMessage(data: SendMessageDto): Promise<Message> {
    const message = new this.messageModel({
      ...data,
      createdAt: this.timestamp,
      createdBy: this.currentUser
    });
    await message.save();

    this.server.to(data.conversationId).emit('newMessage', message);
    return message;
  }

  async initiateVideoCall(callData: InitiateCallDto): Promise<CallSession> {
    const session = await this.createCallSession(callData);
    this.server.to(callData.receiverId).emit('incomingCall', session);
    return session;
  }
}