import type { Game } from '@/lib/models/game';
import { Badge } from '@/components/ui/badge';

interface GameCardProps {
  game: Game;
  onClick?: () => void;
  badge?: string;
}

const scoringTypeLabels: Record<string, string> = {
  race: 'Race',
  round_based: 'Rounds',
  win_loss: 'Win/Loss',
  final_score: 'Points',
  elo: 'ELO',
  cooperative: 'Co-op',
};

export function GameCard({ game, onClick, badge }: GameCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
    >
      <span className="text-3xl shrink-0">{game.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{game.name}</p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">
            {game.config.minPlayers}-{game.config.maxPlayers} players
          </p>
          {badge && <p className="text-xs text-muted-foreground">· {badge}</p>}
        </div>
      </div>
      <Badge variant="secondary" className="shrink-0">
        {scoringTypeLabels[game.scoringType] ?? game.scoringType}
      </Badge>
    </button>
  );
}
