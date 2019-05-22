import {
  getDaysInYear,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  subYears,
  subMonths
} from 'date-fns';

// 1 year = 1.0
// 1 month = 1/12
// 1 day = 1 / (days in month) / 12
export const getFractionalYears = (date1: Date, date2: Date): number => {
  const years = differenceInYears(date2, date1);
  const months = differenceInMonths(subYears(date2, years), date1);
  const date3 = subYears(subMonths(date2, months), years);
  const days = differenceInDays(date3, date1);
  const totalDays = getDaysInYear(date2);
  return years + months / 12 + days / totalDays;
};

// get the number of days remaining after diffing out months and years
const getMarginalDays = (date1: Date, date2: Date): number => {};
