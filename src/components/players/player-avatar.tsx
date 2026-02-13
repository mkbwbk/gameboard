import { cn } from '@/lib/utils';

interface PlayerAvatarProps {
  emoji: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-lg',
  lg: 'h-14 w-14 text-2xl',
};

export function PlayerAvatar({ emoji, color, size = 'md', className }: PlayerAvatarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full shrink-0',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color + '25', borderColor: color, borderWidth: 2 }}
    >
      {emoji}
    </div>
  );
}
