import { Socket, io } from 'socket.io-client'
import { API_URL } from './data';
import { FriendRequest, User } from './types';

export interface ClientToServerEvents {
  userUpdate: (updatedUser: User) => void
  friendRequestCreate: (newRequest: FriendRequest)=> void
  friendRequestDelete: (oldRequest: FriendRequest)=> void
  friendAdd: (friend: User) => void
  friendRemove: (friend: User) => void
}

export interface ServerToClientEvents {
  userUpdate: (updatedUser: User) => void 
  friendRequestCreate: (newRequest: FriendRequest)=> void
  friendRequestDelete: (oldRequest: FriendRequest)=> void
  friendAdd: (friend: User) => void
  friendRemove: (friend: User) => void
}


export const socket: Socket<ClientToServerEvents, ServerToClientEvents> = io(API_URL)