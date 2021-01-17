import {
  emailLocal,
  firstHalf,
  fully,
  replaceWith,
  half,
  lastHalf,
  emailLocalHalf,
  emailDomain,
  emailDomainHalf,
} from './redaction';

describe('Redactions', () => {
  describe('using half', () => {
    it('should redact like using firstHalf', () => {
      const result = half('Eddy');

      expect(result).toBe('██dy');
    });

    it('should redact if input is null', () => {
      const result = half(null);

      expect(result).toBe('█');
    });

    it('should redact if input is null', () => {
      const result = half(undefined);

      expect(result).toBe('█');
    });
  });

  describe('using firstHalf', () => {
    it('should redact first half', () => {
      const result = firstHalf('Eddy');

      expect(result).toBe('██dy');
    });

    it('should favor redacting more when input has odd length', () => {
      const result = firstHalf('Edgar');

      expect(result).toBe('███ar');
    });

    it('should redact if input is only one char', () => {
      const result = firstHalf('a');

      expect(result).toBe('█');
    });
  });

  describe('using lastHalf', () => {
    it('should redact last half', () => {
      const result = lastHalf('Eddy');

      expect(result).toBe('Ed██');
    });

    it('should favor redacting more when input has odd length', () => {
      const result = lastHalf('Edgar');

      expect(result).toBe('Ed███');
    });

    it('should redact if input is only one char', () => {
      const result = lastHalf('a');

      expect(result).toBe('█');
    });
  });

  describe('using fully', () => {
    it('should always redact all chars', () => {
      const result = fully('Eddy');

      expect(result).toBe('████');
    });

    it('should redact if input is null', () => {
      const result = fully(null);

      expect(result).toBe('█');
    });

    it('should redact if input is null', () => {
      const result = fully(undefined);

      expect(result).toBe('█');
    });
  });

  describe('using replaceWith', () => {
    it('should redact with as many bars as input length', () => {
      const result = replaceWith('foo')('Eddy');

      expect(result).toBe('foo');
    });

    it('should redact with one bar if input is null', () => {
      const result = replaceWith(null as any)('Eddy');

      expect(result).toBe('█');
    });

    it('should redact with one bar if input is null', () => {
      const result = replaceWith(undefined as any)('Eddy');

      expect(result).toBe('█');
    });
  });

  describe('using emailLocal', () => {
    it('should redact local part of email', () => {
      const result = emailLocal('eddy@example.com');

      expect(result).toBe('████@example.com');
    });

    it('should redact fully if no email provided', () => {
      const result = emailLocal('Eddy');

      expect(result).toBe('████');
    });
  });

  describe('using emailLocalHalf', () => {
    it('should redact local half part of email', () => {
      const result = emailLocalHalf('eddy@example.com');

      expect(result).toBe('██dy@example.com');
    });

    it('should redact local half part of email with odd length', () => {
      const result = emailLocalHalf('edgar@example.com');

      expect(result).toBe('███ar@example.com');
    });

    it('should redact fully if no email provided', () => {
      const result = emailLocalHalf('Eddy');

      expect(result).toBe('████');
    });
  });

  describe('using emailDomain', () => {
    it('should redact domain part of email', () => {
      const result = emailDomain('eddy@e.c');

      expect(result).toBe('eddy@███');
    });

    it('should handle empty domain', () => {
      const result = emailDomain('eddy@');

      expect(result).toBe('eddy@█');
    });

    it('should redact fully if no email provided', () => {
      const result = emailDomain('Eddy');

      expect(result).toBe('████');
    });
  });

  describe('using emailDomainHalf', () => {
    it('should redact half of domain part of email', () => {
      const result = emailDomainHalf('eddy@ab.c');

      expect(result).toBe('eddy@██.c');
    });

    it('should redact half of domain part of email has odd length', () => {
      const result = emailDomainHalf('eddy@a.b');

      expect(result).toBe('eddy@██b');
    });

    it('should handle empty domain', () => {
      const result = emailDomain('eddy@');

      expect(result).toBe('eddy@█');
    });

    it('should redact fully if no email provided', () => {
      const result = emailDomainHalf('Eddy');

      expect(result).toBe('████');
    });
  });
});
