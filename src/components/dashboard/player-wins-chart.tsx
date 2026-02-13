'use client';

import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { computePlayerWinCounts } from '@/lib/stats/aggregations';

const chartConfig = {
  wins: {
    label: 'Wins',
    color: 'oklch(0.55 0.15 145)',
  },
  losses: {
    label: 'Losses',
    color: 'oklch(0.63 0.2 25)',
  },
} satisfies ChartConfig;

export function PlayerWinsChart() {
  const [data, setData] = useState<{ name: string; wins: number; losses: number }[]>([]);

  const completedCount = useLiveQuery(async () => {
    const sessions = await db.sessions.filter((s) => s.status === 'completed').toArray();
    return sessions.length;
  }) ?? 0;

  useEffect(() => {
    computePlayerWinCounts().then(setData);
  }, [completedCount]);

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No games played yet
      </p>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[220px] w-full">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          width={70}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="wins"
          fill="var(--color-wins)"
          radius={[0, 4, 4, 0]}
          stackId="stack"
        />
        <Bar
          dataKey="losses"
          fill="var(--color-losses)"
          radius={[0, 4, 4, 0]}
          stackId="stack"
        />
      </BarChart>
    </ChartContainer>
  );
}
