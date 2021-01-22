import { Action } from '../actions/action';

export function ExposeWithPermission(action: Action): PropertyDecorator {
  return (target, key) => {
    const fields = Reflect.getMetadata('actions', target) || [];
    if (!fields.includes(key)) {
      fields.push([key, action]);
    }
    Reflect.defineMetadata('actions', fields, target);
  };
}
