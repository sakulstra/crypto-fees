import { FeeData } from './feeData';
import { getBlockDaysAgo } from './time-lib';
import { query } from './graph';

export async function getTornadoData(): Promise<FeeData> {
  const graphQuery = `query fees($today: Int!, $yesterday: Int!, $weekAgo: Int!){
    now: tornado(id: "1", block: {number: $today}) {
      totalFeesUSD
    }
    yesterday: tornado(id: "1", block: {number: $yesterday}) {
      totalFeesUSD
    }
    weekAgo: tornado(id: "1", block: {number: $weekAgo}) {
      totalFeesUSD
    }
  }`;
  const data = await query(
    'dmihal/tornado-cash',
    graphQuery,
    {
      today: getBlockDaysAgo(0),
      yesterday: getBlockDaysAgo(1),
      weekAgo: getBlockDaysAgo(7),
    },
    'fees'
  );

  return {
    id: 'tornado',
    name: 'Tornado Cash',
    category: 'app',
    sevenDayMA: (parseFloat(data.now.totalFeesUSD) - parseFloat(data.weekAgo.totalFeesUSD)) / 7,
    oneDay: parseFloat(data.now.totalFeesUSD) - parseFloat(data.yesterday.totalFeesUSD),
  };
}
