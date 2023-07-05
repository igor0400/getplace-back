import { Periods } from 'src/stats/types/periods';

export const getPeriodValues = (
  period: Periods,
  fromInit?: Date,
  tillInit?: Date,
) => {
  const from = fromInit ? new Date(fromInit) : new Date();
  const till = tillInit ? new Date(tillInit) : new Date();

  switch (period) {
    case 'day':
      from.setUTCHours(0, 0, 0, 0);
      till.setUTCHours(23, 59, 59, 999);
      break;
    case 'week':
      const curr = new Date();
      const first = curr.getUTCDate() - curr.getUTCDay() + 1;
      const last = first + 6;

      from.setUTCDate(first);
      till.setUTCDate(last);
      from.setUTCHours(0, 0, 0, 0);
      till.setUTCHours(23, 59, 59, 999);
      break;
    case 'month':
      from.setUTCDate(1);
      till.setUTCMonth(till.getUTCMonth() + 1, 1);
      from.setUTCHours(0, 0, 0, 0);
      till.setUTCHours(0, 0, 0, 0);
      break;
    case 'year':
      from.setUTCHours(0, 0, 0, 0);
      till.setUTCHours(0, 0, 0, 0);
      from.setUTCMonth(0, 1);
      till.setUTCMonth(0, 1);
      till.setUTCFullYear(till.getUTCFullYear() + 1);
      break;
    case 'allTime':
      from.setTime(0);
      till.setUTCFullYear(till.getUTCFullYear() + 1000);
      break;
  }

  return {
    from,
    till,
  };
};
