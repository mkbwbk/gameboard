interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <span className="text-4xl mb-3">{icon}</span>}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 max-w-[260px]">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
