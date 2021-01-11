export function ExposeIfHasPermissionFor(
  permission: string,
): PropertyDecorator {
  return (target, key) => {
    const fields =
      Reflect.getMetadata('exposeIfHasPermissionFor', target) || [];
    if (!fields.includes(key)) {
      fields.push([key, permission]);
    }
    Reflect.defineMetadata('exposeIfHasPermissionFor', fields, target);
  };
}
