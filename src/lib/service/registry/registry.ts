import { Cls, ModelCls, ModelConfig } from './types';
import * as mongoose from "mongoose";

const models: { [name: string]: ModelConfig } = {}
export const DEFAULT_VIEW = 'all';

export function getAllProtoypeNames(cls: Cls) {
  const out: string[] = [];
  while (cls && cls.name && models[cls.name]) {
    out.push(cls.name);
    cls = Object.getPrototypeOf(cls) as Cls;
  }
  return out;
}

export function registerViewConf(target: any, view: string) {
  let mconf = getModelConfig(target.constructor);
  let viewConf = mconf.views[view];
  if (!viewConf) {
    viewConf = mconf.views[view] = {
      schema: {},
      fields: []
    }
  }
  return viewConf;
}

export function registerFieldFacet(target: any, prop: string, config: any, view: string = DEFAULT_VIEW) {
  let mconf = getModelConfig(target.constructor);
  let defViewConf = registerViewConf(target, DEFAULT_VIEW);

  if (!defViewConf.schema[prop]) {
    defViewConf.fields.push(prop);
    defViewConf.schema[prop] = {};
  }

  if (view !== DEFAULT_VIEW) {
    let viewConf = registerViewConf(target, view);
    if (!viewConf.schema[prop]) {
      viewConf.schema[prop] = defViewConf.schema[prop];
      viewConf.fields.push(prop);
    }
  }

  Object.assign(defViewConf.schema[prop], config);

  return target;
}

export function getSchema(cls: Cls) {
  let conf = models[cls.name];
  return conf && conf.views[DEFAULT_VIEW].schema;
}

export function getModelConfig<T>(cls: string | ModelCls<T>) {
  let name = typeof cls === 'string' ? cls : cls.name;
  if (!models[name] && name) {
    models[name] = {
      indices: [],
      views: {
        [DEFAULT_VIEW]: {
          schema: {},
          fields: [],
        }
      }
    };
  }
  return models[name];
}

export function registerModelFacet<T>(cls: ModelCls<T>, data: any) {
  let conf = getModelConfig(cls);
  Object.assign(conf, data);
  cls.collection = conf.collection;
  return cls;
}

export function registerModel<T>(cls: ModelCls<T>, schemaOpts: mongoose.SchemaOptions = {}) {
  let names = getAllProtoypeNames(cls);
  let mconf = getModelConfig(cls);

  //Flatten views, fields, schemas
  for (let name of names) {
    for (let v of Object.keys(models[name].views)) {
      let smconf = getModelConfig(name).views[v];
      let viewConf = registerViewConf(cls, v);
      let sViewConf = Object.assign(viewConf.schema, smconf.schema);
      viewConf.fields = viewConf.fields.concat(smconf.fields);
    }
  }

  Object.assign(mconf, { collection: mconf.collection || cls.name, schemaOpts });
  return cls;
}