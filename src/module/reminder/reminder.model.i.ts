export interface GetDataReminder {
  notificationId?: number;
  userIds: number[];
  Id: number;
  eventId: number;
  notificationTitle: string;
  categoryName: string;
  notificationDescription?: string;
  time_reminder: string;
  status: number;
  created: string;
  modified?: string;
}

export interface Reminder {
  reminderId: number;
  notificationUrl: string;
  eventType: string | number;
  eventId: number;
  eventStartTime: Date;
  eventTitle: string;
  eventDescription: String;
  eventViewPath: string;
  reminders: string;
  beforeMinute?: number;
  isRepeat?: boolean | number;
  expireDate: Date;
  repeatType: string;
  repeatValue?: string;
  eventTypeId?: number;
}

export interface GetParams {
  offset: number;
  limit: number;
}

export interface GetId {
  id: number;
}

export interface AddReminder {
  reminderId: number;
  notificationUrl?: string;
  eventType: number | string;
  eventTypeId?: number;
  eventId: number;
  eventStartTime: Date;
  eventTitle: string;
  eventDescription: string;
  eventViewPath: string;
  reminders: Users[];
  beforeMinute?: number;
  isRepeat?: boolean;
  expireDate?: Date;
  repeatType?: string;
  repeatValue?: string;
}

export interface Users {
  userId: number;
  userName: string;
}
