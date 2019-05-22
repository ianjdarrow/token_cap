import { Grant, Token } from './grant';

export class User {
  email: string;
  grants: Grant[] = [];
  terminated: Date;

  constructor(email: string) {
    this.email = email;
  }

  addGrant(grant: Grant): void {
    this.grants.push(grant);
  }

  // just use a ridiculous vesting date to account for terminated grants
  getTotalGrants(): number {
    return this.getTotalGrantsAtDate(new Date(50000, 0, 1));
  }

  getTotalGrantsAtDate(date: Date): number {
    return this.grants.reduce((acc, grant) => {
      const tokenName = Token[grant.token]; // bizarrely, pulls off the name
      const amount = grant.getVestedAmount(date);
      acc[tokenName] = tokenName in acc ? acc[tokenName] + amount : amount;
      return acc;
    }, {});
  }

  // this is bad, fix
  terminate(date: Date): void {
    this.terminated = date;
    for (let g of this.grants) {
      try {
        g.terminateVesting(date);
      } catch (e) {
        console.log(e);
      }
    }
  }
}
