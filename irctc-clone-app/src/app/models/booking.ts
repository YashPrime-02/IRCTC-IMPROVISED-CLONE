import {Train } from '../models/train';
import { User } from './user';
export interface Booking {
  _id: string;
  pnr: string;
  train: Train;
  user: User;
  seats: number;
  date: string;
  createdAt: string;
}
