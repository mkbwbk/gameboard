import { ScoringType } from '@/lib/models/game';

interface FaqEntry {
  q: string;
  a: string;
}

/**
 * Scoring-type-specific FAQ templates.
 * Placeholders: {name}, {target}, {playerRange}, {minPlayers}, {maxPlayers}
 */
export const SCORING_TYPE_FAQS: Record<ScoringType, FaqEntry[]> = {
  [ScoringType.RACE]: [
    {
      q: 'How does scoring work in {name}?',
      a: '{name} uses a race-to-target scoring system. Players accumulate points throughout the game, and the first player to reach the target score wins. Score Door tracks each player\'s running total in real time so everyone can see who\'s in the lead.',
    },
    {
      q: 'What is the target score in {name}?',
      a: 'The standard target score for {name} is {target} points. Score Door comes pre-configured with this target, but you can customise it in the game settings if your group prefers a longer or shorter game.',
    },
    {
      q: 'How do you track points during a game of {name}?',
      a: 'During a {name} game, tap the + or - buttons next to each player\'s name in Score Door to update their score as points are earned. The app highlights who is closest to winning and announces the winner automatically when someone reaches the target.',
    },
    {
      q: 'Can you change the winning score for {name}?',
      a: 'Yes. While the default target for {name} is {target} points, you can set any target score you like when starting a new session in Score Door. This is handy for shorter practice rounds or extended games.',
    },
    {
      q: 'What happens when a player reaches the target in {name}?',
      a: 'When a player hits {target} points (or your custom target), Score Door marks them as the winner and ends the session. The result is saved to your history so you can review it later and track long-term stats.',
    },
  ],

  [ScoringType.ROUND_BASED]: [
    {
      q: 'How does scoring work in {name}?',
      a: '{name} is scored round by round. After each round, players record their scores and Score Door keeps a running total. At the end of all rounds, the player with the highest (or lowest) cumulative score wins.',
    },
    {
      q: 'How do you record scores each round in {name}?',
      a: 'After each round of {name}, enter every player\'s score for that round in Score Door. The app adds it to their running total and updates the standings automatically. You can review the full round-by-round breakdown at any time.',
    },
    {
      q: 'Can you see a round-by-round breakdown of {name} scores?',
      a: 'Yes. Score Door keeps a detailed scorecard showing each player\'s score for every round alongside their running total. This makes it easy to see when someone pulled ahead or fell behind during a {name} game.',
    },
    {
      q: 'How many rounds are in a game of {name}?',
      a: 'The number of rounds in {name} varies depending on the game variant or house rules. Score Door doesn\'t impose a limit — keep adding rounds until your game is finished, then end the session to save the final results.',
    },
    {
      q: 'Does the lowest score win in {name}?',
      a: 'It depends on the variant you\'re playing. Score Door supports both highest-wins and lowest-wins modes. You can configure this in the game settings so the app correctly identifies the winner of your {name} game.',
    },
  ],

  [ScoringType.WIN_LOSS]: [
    {
      q: 'How do you track {name} results?',
      a: '{name} uses win/loss tracking — after each game, simply record who won. Score Door doesn\'t track point totals for {name}; instead it builds detailed win rate, streak, and head-to-head statistics over many games.',
    },
    {
      q: 'Is there a point system in {name}?',
      a: '{name} is tracked as a win or loss rather than by points. The game itself determines the winner, and Score Door records the outcome. Over time you\'ll see win percentages, longest winning streaks, and matchup histories.',
    },
    {
      q: 'How are {name} standings calculated?',
      a: 'Score Door calculates {name} standings based on each player\'s win rate, total wins, and winning streaks. You can also view head-to-head records between any two players to settle debates about who really dominates.',
    },
    {
      q: 'Can {name} end in a draw?',
      a: 'Score Door supports draws if the game allows it. When recording a {name} result, you can mark the outcome as a draw and it will be factored into everyone\'s statistics.',
    },
    {
      q: 'How do you decide who won a game of {name}?',
      a: 'The rules of {name} determine the winner — Score Door simply records the result. After each game, select the winning player (or mark a draw) and the app saves the session with full stats tracking.',
    },
  ],

  [ScoringType.FINAL_SCORE]: [
    {
      q: 'How does scoring work in {name}?',
      a: '{name} uses final score comparison. Each player tallies up their total points at the end of the game and enters them into Score Door. The player with the highest score wins (unless lowest-wins is configured).',
    },
    {
      q: 'How do you calculate your final score in {name}?',
      a: 'At the end of a {name} game, add up each player\'s points from all scoring categories and enter the totals in Score Door. The app compares everyone\'s scores and determines the winner automatically.',
    },
    {
      q: 'What is a good score in {name}?',
      a: 'Scores in {name} vary widely based on experience, player count, and strategy. Score Door tracks your average score over time so you can see how you\'re improving and set personal benchmarks.',
    },
    {
      q: 'Does the lowest score win in {name}?',
      a: 'In most {name} games the highest score wins, but some variants use lowest-wins rules. Score Door lets you configure this per game so the correct winner is always identified.',
    },
    {
      q: 'Can you compare {name} scores across multiple games?',
      a: 'Yes. Score Door stores every {name} session\'s final scores so you can track averages, personal bests, and trends over time. The stats dashboard shows how each player performs across all your recorded games.',
    },
  ],

  [ScoringType.ELO]: [
    {
      q: 'How does the ELO rating system work for {name}?',
      a: 'ELO is a skill-based rating system used for competitive {name}. Each player starts with a base rating. When you win against a higher-rated opponent, your rating increases more than if you beat a lower-rated one. Losses cause your rating to drop.',
    },
    {
      q: 'What is a good ELO rating in {name}?',
      a: 'In Score Door, all players start with a base ELO rating. As you play more {name} games, ratings spread out to reflect relative skill. Track your rating over time to see your improvement — what matters most is the trend, not any single number.',
    },
    {
      q: 'How is ELO calculated after a {name} game?',
      a: 'After each {name} game, Score Door adjusts both players\' ratings based on the result and the difference in their current ratings. An upset win (beating someone rated much higher) causes a bigger rating change than a expected result.',
    },
    {
      q: 'Can {name} games end in a draw for ELO purposes?',
      a: 'Yes, Score Door supports draws in ELO-rated {name} games. A draw causes a small rating adjustment — the lower-rated player gains a little and the higher-rated player loses a little, since the draw was slightly better than expected for the underdog.',
    },
    {
      q: 'Does ELO work with more than two players in {name}?',
      a: '{name} ELO in Score Door is designed for two-player matchups, which is how the ELO system works best. For multiplayer games, consider using win/loss or final score tracking instead.',
    },
  ],

  [ScoringType.COOPERATIVE]: [
    {
      q: 'How do you score a cooperative game like {name}?',
      a: '{name} is a cooperative game where all players work together as a team. There are no individual scores — the team either wins or loses together. Score Door records each session\'s outcome so you can track your group\'s success rate.',
    },
    {
      q: 'Is there individual scoring in {name}?',
      a: 'No. In {name}, everyone wins or loses together as a team. Score Door tracks the team result — win or loss — rather than individual player scores. This keeps the focus on collaboration.',
    },
    {
      q: 'How do you track your {name} win rate?',
      a: 'Score Door records whether your team won or lost each {name} session. Over time, you\'ll see your overall win rate, winning streaks, and how your group\'s performance trends. It\'s a great way to measure improvement.',
    },
    {
      q: 'What counts as a win in {name}?',
      a: 'A win in {name} means the team achieved the game\'s objective before losing. After each session, mark whether the team won or lost in Score Door and the result is saved to your group\'s history.',
    },
    {
      q: 'How many players can play {name}?',
      a: '{name} supports {playerRange} players. Score Door tracks every player who participated in each session, so you can see which team compositions lead to the most wins.',
    },
  ],
};

/**
 * Per-game custom FAQ overrides for high-traffic games.
 * These are appended after the scoring-type FAQs.
 */
export const GAME_CUSTOM_FAQS: Record<string, FaqEntry[]> = {
  'Catan': [
    {
      q: 'How many victory points do you need to win Catan?',
      a: 'The standard Catan game requires 10 victory points to win. You earn points from settlements (1 point each), cities (2 points each), longest road (2 points), largest army (2 points), and certain development cards. Score Door is pre-configured with a target of 10.',
    },
    {
      q: 'What are the different ways to score points in Catan?',
      a: 'In Catan you score from: settlements (1 VP), cities (2 VP), longest road bonus (2 VP), largest army bonus (2 VP), and victory point development cards (1 VP each). Some players also use hidden VP cards as a strategic surprise. Score Door lets you track the running total.',
    },
  ],
  'Monopoly': [
    {
      q: 'How do you decide who wins Monopoly?',
      a: 'Monopoly ends when all but one player have gone bankrupt — the last player standing wins. Alternatively, many groups play a timed version where the wealthiest player (cash plus property value) wins when time is called. Score Door records the winner either way.',
    },
    {
      q: 'What are the Monopoly bankruptcy rules?',
      a: 'When you can\'t pay a debt in Monopoly, you\'re bankrupt and out of the game. If you owe another player, they receive all your properties and cash. If you owe the bank, your properties are auctioned. The last player remaining wins.',
    },
  ],
  'Scrabble': [
    {
      q: 'How are letter scores calculated in Scrabble?',
      a: 'Each Scrabble tile has a point value based on how common the letter is — common letters like E and A are worth 1 point, while rare letters like Q and Z are worth 10 points. Your word score is the sum of all tile values, multiplied by any bonus squares on the board.',
    },
    {
      q: 'What are bonus squares worth in Scrabble?',
      a: 'Scrabble has four types of bonus squares: double letter score (2x one tile), triple letter score (3x one tile), double word score (2x entire word), and triple word score (3x entire word). Landing on the centre star counts as a double word score for the first word.',
    },
  ],
  'Chess': [
    {
      q: 'How does the chess rating system work?',
      a: 'Chess uses the ELO rating system, where your rating changes after each game based on the result and your opponent\'s strength. Beating a higher-rated player earns more points than beating a lower-rated one. Score Door calculates ELO adjustments automatically.',
    },
    {
      q: 'What ELO rating is considered beginner level in chess?',
      a: 'In Score Door, everyone starts with the same base rating and ratings diverge as you play. In official chess, beginners typically range from 400-800, intermediates 800-1400, and advanced players 1400+. Play regularly and watch your Score Door rating climb.',
    },
  ],
  'Wingspan': [
    {
      q: 'What scoring categories are in Wingspan?',
      a: 'Wingspan scores across multiple categories: birds played (point values on cards), bonus cards, end-of-round goals, eggs on cards, food cached on cards, and tucked cards. Add up all categories for each player\'s final total and enter it in Score Door.',
    },
  ],
  'Ticket to Ride': [
    {
      q: 'How do route points work in Ticket to Ride?',
      a: 'In Ticket to Ride, you earn points by claiming routes between cities. Longer routes are worth more: a 1-train route scores 1 point, up to a 6-train route scoring 15 points. You also score (or lose) points for completed (or failed) destination tickets at game end.',
    },
    {
      q: 'How do you calculate your Ticket to Ride final score?',
      a: 'Your Ticket to Ride final score combines points from claimed routes (earned during the game), completed destination tickets (bonus points), failed destination tickets (penalty — subtracted), and the longest route bonus (10 points). Enter each player\'s total in Score Door.',
    },
  ],
  'Darts': [
    {
      q: 'How does scoring work in 501 darts?',
      a: 'In 501 darts, both players start at 501 points and subtract their scores each round. The goal is to reach exactly zero. You must finish on a double (the outer narrow ring) or the bullseye. Score Door tracks each round\'s score and your remaining total.',
    },
    {
      q: 'What is a checkout in darts?',
      a: 'A checkout is the final throw (or combination of throws) needed to reach exactly zero in a darts game. You must finish on a double or the bullseye. For example, if you have 40 remaining, you need double 20. Score Door helps track when players are in checkout range.',
    },
  ],
};
