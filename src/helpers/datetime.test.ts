import { getFractionalYears } from './datetime';

describe('utilities / datetime ops', () => {
  test('correctly measure one month', () => {
    const date1 = new Date(2016, 1, 1);
    const date2 = new Date(2016, 2, 1);
    const delta = getFractionalYears(date1, date2);
    expect(delta).toBe(1 / 12);
  });
  test('correctly measure one week', () => {
    const date1 = new Date(2015, 1, 1);
    const date2 = new Date(2015, 1, 8);
    const delta = getFractionalYears(date1, date2);
    expect(delta).toBe(7 / 365);
  });
  test('correctly measure two days', () => {
    const date1 = new Date(2015, 1, 1);
    const date2 = new Date(2015, 1, 3);
    const delta = getFractionalYears(date1, date2);
    expect(delta).toBe(2 / 365);
  });
  test('correctly measure two years, 15 days', () => {
    const date1 = new Date(2015, 1, 1);
    const date2 = new Date(2017, 1, 16);
    const delta = getFractionalYears(date1, date2);
    expect(delta).toBe(2 + 15 / 365);
  });
});
