import { SchemaBound, Schema, Class } from '@encore/schema';
import { ModelCore } from './model';
import { ModelOptions, ModelRegistry } from '../service';

@Schema()
export abstract class BaseModel extends SchemaBound implements ModelCore {

  _id: string;
  _version: string;
  _type?: string;
  createdDate: Date;
  updatedDate: Date;

  constructor() {
    super();
    this._type = ModelRegistry.getOptions(this.constructor as Class).discriminator;
  }

  preSave(): this {
    if (!this.createdDate) {
      this.createdDate = new Date();
    }
    this.updatedDate = new Date();
    return this;
  }

  postLoad(): this {
    return this;
  }
}