import { Schema, BindUtil, ClassWithSchema, DeepPartial } from '@travetto/schema';
import { ModelCore } from './model';
import { ModelOptions, ModelRegistry } from '../service';
import { Class } from '@travetto/registry';

@Schema()
export abstract class BaseModel implements ModelCore {

  static from: ClassWithSchema<any>['from'];

  id?: string;
  version?: string;
  type?: string;
  createdDate?: Date;
  updatedDate?: Date;

  constructor() {
    const type = ModelRegistry.get(this.constructor as Class).discriminator;
    if (type) {
      this.type = type;
    }
  }

  prePersist() {
    if (!this.createdDate) {
      this.createdDate = new Date();
    }
    this.updatedDate = new Date();
  }

  postLoad() {
  }
}
