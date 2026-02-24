'use client';

import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { computeWinRateOverTime } from '@/lib/stats/aggregations';

const chartConfig = {
  winRate: {
    label: 'Win Rate',
    color: 'oklch(0.55 0.2 250)',
  },
} satisfies ChartConfig;

export function WinRateChart() {
  const players = useLiveQuery(() => db.players.toArray()) ?? [];
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [data, setData] = useState<{ game: number; winRate: number }[]>([]);

  const completedCount = useLiveQuery(async () => {
    const sessions = await db.sessions.filter((s) => s.status === 'completed').toArray();
    return sessions.length;
  }) ?? 0;

  // Auto-select first player and fetch data
  const firstPlayerId = players[0]?.id ?? '';
  const effectivePlayer = selectedPlayer || firstPlayerId;
  useEffect(() => {
    if (effectivePlayer && !selectedPlayer) {
      Promise.resolve().then(() => setSelectedPlayer(effectivePlayer));
    }
  }, [effectivePlayer, selectedPlayer]);

  useEffect(() => {
    if (selectedPlayer) {
      computeWinRateOverTime(selectedPlayer).then(setData);
    }
  }, [selectedPlayer, completedCount]);

  if (players.length === 0) return null;

  return (
    <div className="space-y-3">
      <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select player" />
        </SelectTrigger>
        <SelectContent>
          {players.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.avatarEmoji} {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {data.length > 0 ? (
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="game"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(v) => `#${v}`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const item = payload?.[0];
                    return item ? `Game #${item.payload.game}` : '';
                  }}
                  formatter={(value) => [`${value}%`, 'Win Rate']}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="winRate"
              stroke="var(--color-winRate)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">
          Not enough games yet
        </p>
      )}
    </div>
  );
}
