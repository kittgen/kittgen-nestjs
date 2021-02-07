import { Action } from '../actions/action';
import { AUTHORIZATION_EXPOSED_WITH_PERMISSION_PROPS } from '../authorization.constants';

export function ExposeWithPermission(action: Action): PropertyDecorator {
  return (target, key) => {
    const props =
      Reflect.getMetadata(
        AUTHORIZATION_EXPOSED_WITH_PERMISSION_PROPS,
        target
      ) || [];
    if (!props.includes(key)) {
      props.push([key, action]);
    }
    Reflect.defineMetadata(
      AUTHORIZATION_EXPOSED_WITH_PERMISSION_PROPS,
      props,
      target
    );
  };
}
