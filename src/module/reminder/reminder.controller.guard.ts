import { Injectable } from '@nestjs/common';
import { SchemaUtility } from '../../common/utils/schemavalid';
import { JsonSchemaBasic } from '../../common/utils/schemavalid/validator.i';

@Injectable()
export class ReminderGuard {
  public isPostBody(params: any): Boolean {
    const schema: JsonSchemaBasic = {
      $id: `rest-${ReminderGuard.name}.${this.isPostBody.name}`,
      type: 'object',
      properties: {
        notificationUrl: {
          type: 'string',
          minLength: 1,
        },
        eventType: {
          type: 'string',
          minLength: 1,
        },
        eventTypeId: {
          type: 'integer',
          minLength: 1,
        },
        eventId: {
          type: 'integer',
          minLength: 1,
        },
        eventStartTime: {
          format: 'date-time',
          type: 'string',
        },
        eventTitle: {
          type: 'string',
          minLength: 1,
        },
        eventDescription: {
          type: 'string',
          // minLength: 1,
        },
        eventViewPath: {
          type: 'string',
          minLength: 1,
        },
        reminders: {
          type: 'array',
          items: {
            userId: { type: 'integer' },
            userName: { type: 'string' },
          },
        },
        beforeMinute: {
          type: 'integer',
          minLength: 1,
        },
        isRepeat: {
          type: 'boolean',
        },
        expireDate: {
          format: 'date-time',
          type: 'string',
        },
        repeatType: {
          type: 'string',
          minLength: 1,
        },
        repeatValue: {
          type: 'string',
          minLength: 1,
        },
      },
      required: [
        'notificationUrl',
        // 'eventType',
        // 'eventTypeId',
        'eventId',
        'eventStartTime',
        'eventTitle',
        'eventDescription',
        'eventViewPath',
        'reminders',
      ],
    };
    return SchemaUtility.getSchemaValidator().validate(schema, params);
  }
}
