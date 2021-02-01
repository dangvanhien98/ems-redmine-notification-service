SELECT \
       reminder_id as reminderId \
      , notification_url as notificationUrl \
      , event_type as eventType \
      , event_id as eventId \
      , event_start_time as eventStartTime\
      , event_title as eventTitle \
      , event_description as eventDescription \
      , reminders , before_minute as beforeMinute \
      , is_repeat as isRepeat\
      , expire_date as expireDate\
      , repeat_type as repeatType \
      , repeat_value as repeatValue\
      ,event_view_path as eventViewPath \
      FROM ems_reminder.reminder having (DATE_SUB(event_start_time, INTERVAL before_minute MINUTE)) < NOW() FOR UPDATE;
                                                  
