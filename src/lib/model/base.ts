import { ModelCore } from './model';
import { SchemaRegistry, BindUtil, Cls, Field } from '@encore/schema';
import { ModelOptions } from '../service';

export abstract class BaseModel implements ModelCore {

  @Field(String)
  _id: string;

  @Field(String)
  _version: string;

  @Field(String)
  _type: string | undefined;

  @Field(Date)
  createdDate: Date;

  @Field(Date)
  updatedDate: Date;

  constructor(data?: Object) {
    let cons: Cls<any> = SchemaRegistry.getCls(this);
    BindUtil.bindSchema(cons, this, data);
    this._type = SchemaRegistry.getClassMetadata<any, ModelOptions>(cons, 'model').discriminator;
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