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
import { PieChart, Pie, Cell } from 'recharts';
import { computeGameTypeDistribution } from '@/lib/stats/aggregations';

const COLORS = [
  'oklch(0.55 0.2 250)',   // blue
  'oklch(0.55 0.15 145)',  // green
  'oklch(0.65 0.2 40)',    // orange
  'oklch(0.55 0.2 310)',   // purple
  'oklch(0.63 0.2 25)',    // red
  'oklch(0.6 0.15 190)',   // teal
  'oklch(0.65 0.18 80)',   // yellow
  'oklch(0.5 0.2 280)',    // indigo
  'oklch(0.6 0.2 350)',    // pink
];

export function GameDistributionChart() {
  const [data, setData] = useState<{ name: string; icon: string; count: number }[]>([]);

  const completedCount = useLiveQuery(async () => {
    const sessions = await db.sessions.filter((s) => s.status === 'completed').toArray();
    return sessions.length;
  }) ?? 0;

  useEffect(() => {
    computeGameTypeDistribution().then(setData);
  }, [completedCount]);

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No games played yet
      </p>
    );
  }

  const chartConfig: ChartConfig = {};
  data.forEach((d, i) => {
    chartConfig[d.name] = {
      label: `${d.icon} ${d.name}`,
      color: COLORS[i % COLORS.length],
    };
  });

  return (
    <div className="space-y-3">
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => {
                  const item = data.find((d) => d.name === name);
                  return [`${value} games`, `${item?.icon ?? ''} ${name}`];
                }}
              />
            }
          />
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs">
            <div
              className="h-2.5 w-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-muted-foreground">
              {entry.icon} {entry.name} ({entry.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
