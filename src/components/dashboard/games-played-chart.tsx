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
import { computeGamesPerWeek } from '@/lib/stats/aggregations';

const chartConfig = {
  count: {
    label: 'Games',
    color: 'oklch(0.6 0.15 250)',
  },
} satisfies ChartConfig;

export function GamesPlayedChart() {
  const [data, setData] = useState<{ week: string; count: number }[]>([]);

  const completedCount = useLiveQuery(async () => {
    const sessions = await db.sessions.filter((s) => s.status === 'completed').toArray();
    return sessions.length;
  }) ?? 0;

  useEffect(() => {
    computeGamesPerWeek(8).then(setData);
  }, [completedCount]);

  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No games played yet
      </p>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="week"
          tickLine={false}
          axisLine={false}
          fontSize={11}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={12}
          allowDecimals={false}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(label) => `Week of ${label}`}
            />
          }
        />
        <Bar
          dataKey="count"
          fill="var(--color-count)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
