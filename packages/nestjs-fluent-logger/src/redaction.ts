export const firstHalf = (string: any) => {
  if (!string || string.length == 1) {
    return '█';
  }
  const cutPoint = Math.ceil(string.length / 2);
  return '█'.repeat(cutPoint) + string.slice(cutPoint);
};

export const lastHalf = (string: any) => {
  if (!string || string.length == 1) {
    return '█';
  }
  const cutPoint = Math.floor(string.length / 2);
  return string.slice(0, cutPoint) + '█'.repeat(string.length - cutPoint);
};

export const half = firstHalf;

export const replaceWith = (replace: string) => (_string: any) => {
  if (!replace) {
    return '█';
  }
  return replace;
};

export const fully = (string: any) => {
  if (!string || string.length == 1) {
    return '█';
  }
  return '█'.repeat(string.length);
};

export const emailLocal = (email: any) => {
  if (!email || email.length == 1) {
    return '█';
  }
  const atIdx = email.indexOf('@');
  if (atIdx > -1) {
    return fully(email.substring(0, atIdx)) + email.slice(atIdx);
  }
  return fully(email);
};

export const emailLocalHalf = (email: any) => {
  if (!email || email.length == 1) {
    return '█';
  }
  const atIdx = email.indexOf('@');
  if (atIdx > -1) {
    return half(email.substring(0, atIdx)) + email.slice(atIdx);
  }
  return fully(email);
};

export const emailDomain = (email: any) => {
  if (!email || email.length == 1) {
    return '█';
  }
  const atIdx = email.indexOf('@');
  if (atIdx > -1) {
    return (
      email.substring(0, atIdx + 1) +
      (email.length > atIdx ? fully(email.slice(atIdx + 1)) : '')
    );
  }
  return fully(email);
};

export const emailDomainHalf = (email: any) => {
  if (!email || email.length == 1) {
    return '█';
  }
  const atIdx = email.indexOf('@');
  if (atIdx > -1) {
    return (
      email.substring(0, atIdx + 1) +
      (email.length > atIdx ? half(email.slice(atIdx + 1)) : '')
    );
  }
  return fully(email);
};
