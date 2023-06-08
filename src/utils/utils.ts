import { Transaction, Transfer } from '../services/services.ts';
import { Protocol } from './available-protocols.ts';

const getTimeAgo = (date: string) => {
  const seconds = (new Date().getTime() - new Date(date).getTime()) / 1000;

  if (seconds < 60) {
    return Math.round(seconds) + '秒钟前';
  }

  const minutes = seconds / 60;
  if (minutes < 60) {
    return Math.round(minutes) + '分钟前';
  }

  const hours = minutes / 60;
  if (hours < 24) {
    return Math.round(hours) + '小时前';
  }

  const days = hours / 24;
  return Math.round(days) + '天前';
};

const countTransactionPeriods = (
  address: string,
  transactions: Transaction[],
  protocol?: Protocol,
): {
  days: number;
  weeks: number;
  months: number;
} => {
  const uniqueDays: Set<string> = new Set();
  const uniqueWeeks: Set<string> = new Set();
  const uniqueMonths: Set<string> = new Set();

  transactions.forEach((transaction) => {
    if (!protocol && transaction.initiatorAddress.toLowerCase() !== address.toLowerCase()) return;
    if (transaction.erc20Transfers.length === 0) return;
    if (
      protocol &&
      protocol.id !== 'zksynceraportal' &&
      !protocol.addresses.includes(transaction.erc20Transfers.sort(sortTransfer)[0].from) &&
      !protocol.addresses.includes(transaction.erc20Transfers.sort(sortTransfer)[0].to)
    )
      return;

    if (protocol && protocol.id === 'zksynceraportal') {
      if (!(transaction.isL1Originated || transaction.data.calldata.startsWith('0x51cff8d9'))) return;
    }

    const timestamp = new Date(transaction.receivedAt);
    const year = timestamp.getFullYear();
    const month = timestamp.getMonth();
    const day = timestamp.getDate();
    const week = getWeekNumber(timestamp);

    uniqueDays.add(`${year}-${month}-${day}`);
    uniqueWeeks.add(`${year}-${week}`);
    uniqueMonths.add(`${year}-${month}`);
  });

  return {
    days: uniqueDays.size,
    weeks: uniqueWeeks.size,
    months: uniqueMonths.size,
  };
};

const getWeekNumber = (date: Date): string => {
  const year = date.getFullYear();
  const oneJan = new Date(year, 0, 1);
  const dayIndex = (date.getDay() + 6) % 7;
  const daysSinceFirstDay = Math.floor((date.getTime() - oneJan.getTime()) / 86400000);
  const weekIndex = Math.floor((daysSinceFirstDay + oneJan.getDay() - dayIndex) / 7);

  return `${year}-${weekIndex}`;
};

const sortTransfer = (a: Transfer, b: Transfer) => {
  const valueA = parseInt(a.amount, 16) * 10 ** -a.tokenInfo.decimals * a.tokenInfo.usdPrice;
  const valueB = parseInt(b.amount, 16) * 10 ** -b.tokenInfo.decimals * b.tokenInfo.usdPrice;

  return valueB - valueA;
};

export { getTimeAgo, countTransactionPeriods, getWeekNumber, sortTransfer };
