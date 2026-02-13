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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { computeGameWinDistribution } from '@/lib/stats/game-stats';

const COLORS = [
  'oklch(0.55 0.2 250)',
  'oklch(0.55 0.15 145)',
  'oklch(0.65 0.2 40)',
  'oklch(0.55 0.2 310)',
  'oklch(0.63 0.2 25)',
  'oklch(0.6 0.15 190)',
];

const chartConfig = {
  wins: {
    label: 'Wins',
    color: 'oklch(0.55 0.2 250)',
  },
} satisfies ChartConfig;

interface Props {
  gameId: string;
}

export function GameWinDistributionChart({ gameId }: Props) {
  const [data, setData] = useState<{ name: string; wins: number; color: string }[]>([]);

  const completedCount = useLiveQuery(async () => {
    const sessions = await db.sessions
      .filter((s) => s.status === 'completed' && s.gameId === gameId)
      .toArray();
    return sessions.length;
  }, [gameId]) ?? 0;

  useEffect(() => {
    computeGameWinDistribution(gameId).then(setData);
  }, [gameId, completedCount]);

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No games played yet
      </p>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          fontSize={12}
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
              formatter={(value) => [`${value}`, 'Wins']}
            />
          }
        />
        <Bar dataKey="wins" radius={[4, 4, 0, 0]}>
          {data.map((_entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
