export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="px-4 py-4 pb-24 max-w-lg mx-auto">
      {children}
    </main>
  );
}
