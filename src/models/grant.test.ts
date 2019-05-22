import { Grant, Token } from './grant';

describe('creating grants', () => {
  test('throws with too long a cliff', () => {
    expect(() => new Grant(Token.Filecoin, new Date(), 1000, 1, 2)).toThrow();
  });
  test('returns correct partial vesting over two years', () => {
    const startDate = new Date(2000, 2, 1);
    const grant = new Grant(Token.Filecoin, 1000, startDate, 48, 0);
    const date2 = new Date(2002, 2, 1);
    const vestedAmount = grant.getVestedAmount(date2);
    expect(vestedAmount).toBe(500);
  });
  test('returns correct zero vesting', () => {
    const startDate = new Date(2012, 1, 1);
    const grant = new Grant(Token.Filecoin, 1000, startDate, 24, 12);
    const date2 = new Date(2013, 0, 30);
    const vestedAmount = grant.getVestedAmount(date2);
    expect(vestedAmount).toBe(0);
  });
  test('returns correct full vesting', () => {
    const startDate = new Date(2007, 11, 18, 6, 15);
    const grant = new Grant(Token.Filecoin, 678, startDate, 36, 12);
    const date2 = new Date(2011, 0, 30);
    const vestedAmount = grant.getVestedAmount(date2);
    expect(vestedAmount).toBe(678);
  });
  test('handles weird vesting schedules', () => {
    const startDate = new Date(2017, 11, 30);
    const grant = new Grant(Token.Filecoin, 1600, startDate, 16, 3);
    const date2 = new Date(2018, 11, 30);
    const vestedAmount = grant.getVestedAmount(date2);
    expect(vestedAmount).toBe(1200);
  });
});

describe('terminating grants', () => {
  test('terminates fully before cliff', () => {
    const startDate = new Date(2000, 2, 1);
    const grant = new Grant(Token.Filecoin, 1000, startDate, 48, 12);
    grant.terminateVesting(new Date(2001, 1, 1));
    const vestedAmount = grant.getVestedAmount(new Date(2004, 1, 1));
    expect(vestedAmount).toBe(0);
  });
  test('terminates partially after cliff', () => {
    const startDate = new Date(2000, 2, 1);
    const grant = new Grant(Token.Filecoin, 1000, startDate, 24, 12);
    grant.terminateVesting(new Date(2001, 2, 1));
    const vestedAmount = grant.getVestedAmount(new Date(2004, 1, 1));
    expect(vestedAmount).toBe(500);
  });
});
