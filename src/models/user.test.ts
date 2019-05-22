import { User } from './user';
import { Grant, Token } from './grant';

describe('user tests', () => {
  describe('create user and make grants', () => {
    let user: User;
    beforeEach(() => {
      user = new User('ian@g.co');
      user.addGrant(
        new Grant(Token.Filecoin, 2000, new Date(2015, 0, 1), 48, 12)
      );
      user.addGrant(
        new Grant(Token.Filecoin, 1000, new Date(2016, 1, 1), 36, 0)
      );
    });
    test('can give users grants', () => {
      expect(user.getTotalGrants()).toMatchObject({ Filecoin: 3000 });
    });
    test('initial vesting works', () => {
      expect(user.getTotalGrantsAtDate(new Date(2016, 0, 1))).toMatchObject({
        Filecoin: 500
      });
    });
    test('partial stacked vesting works', () => {
      expect(user.getTotalGrantsAtDate(new Date(2016, 2, 1))).toMatchObject({
        Filecoin: (2000 * 14) / 48 + (1000 * 1) / 36
      });
    });
    test('full stacked vesting works', () => {
      expect(user.getTotalGrantsAtDate(new Date(2020, 2, 1))).toMatchObject({
        Filecoin: 3000
      });
    });
    test('full termination works', () => {
      user.terminate(new Date(2015, 1, 1));
      expect(user.getTotalGrantsAtDate(2020, 1, 1)).toMatchObject({
        Filecoin: 0
      });
    });
    test('partial termination works pt. 1', () => {
      user.terminate(new Date(2016, 0, 1));
      expect(user.getTotalGrantsAtDate(new Date(2020, 1, 1))).toMatchObject({
        Filecoin: 500
      });
    });
    test('partial termination works pt. 2', () => {
      user.terminate(new Date(2016, 3, 1));
      expect(user.getTotalGrantsAtDate(new Date(2020, 1, 1))).toMatchObject({
        Filecoin: (2000 * 15) / 48 + (1000 * 2) / 36
      });
    });
  });
});
