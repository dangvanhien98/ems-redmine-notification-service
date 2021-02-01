import { JsonSchema, JsonSchemaBasic } from './validator.i';
// import { GetParams, GetId } from 'src/module/vehcile/vehcile.model.i';
import * as Ajv from 'ajv';
import { GetParams, GetId} from 'src/module/reminder/reminder.model.i';
export class SchemaValidator {
    public static SchemaValidator(
      schema: JsonSchema,
      params: GetParams,
    ): boolean {
      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile(schema);
      const valid = validate(params);
      if (valid) {
        return true;
      } else return false;
    }
  }
  export class SchemaValidatorId {
    public static SchemaValidatorId(
      schema: JsonSchema,
      params: GetId,
    ): boolean {
      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile(schema);
      const valid = validate(params);
      if (valid) {
        return true;
      } else return false;
    }
  }
  export class SchemaValidatorBasic {
    constructor(private ajv: Ajv.Ajv = new Ajv()) { }
    public validate(schema: JsonSchemaBasic, data: any): boolean {
      const valid = this.ajv.validate(schema, data);
      if (!valid) {
        console.log(valid);
        return false;
      }
      return true;
    }
  }
  export class SchemaUtility {
    public static validator: SchemaValidatorBasic | null;
    public static getSchemaValidator(ajv?: Ajv.Ajv) {
      if (!this.validator) {
        this.validator = new SchemaValidatorBasic(ajv);
      }
      return this.validator;
    }
}
