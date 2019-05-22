import { addMonths, isBefore } from 'date-fns';
import { getFractionalYears } from '../helpers/datetime';

export enum Token {
  Filecoin
}

export class Grant {
  token: Token;
  amount: number;
  grantDate: Date;
  end: Date;
  cliff: Date;
  terminated: Date;

  // duration is the number of months over which the grant vests
  // cliff is the number of months before vesting starts
  constructor(
    token: Token,
    amount: number,
    grantDate: Date,
    duration: number,
    _cliff: number
  ) {
    if (duration < _cliff || _cliff < 0) {
      throw new Error(`Can't have a cliff longer than the vesting period`);
    }
    const end = addMonths(grantDate, duration);
    this.token = token;
    this.amount = amount;
    this.grantDate = grantDate;
    this.end = end;
    this.cliff = addMonths(grantDate, _cliff);
  }

  getVestedAmount(targetDate: Date): number {
    if (isBefore(targetDate, this.cliff)) return 0;
    if (isBefore(this.terminated, this.cliff)) return 0;
    if (this.terminated) targetDate = this.terminated;
    const totalYears = getFractionalYears(this.grantDate, this.end);
    const vestedFraction = Math.min(
      getFractionalYears(this.grantDate, targetDate) / totalYears,
      1
    );
    return vestedFraction * this.amount;
  }

  terminateVesting(date: Date): void {
    this.terminated = date;
  }
}
