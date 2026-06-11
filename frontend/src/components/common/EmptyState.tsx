interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ message, actionLabel, onAction }: EmptyStateProps) => (
  <div className="rounded-lg border border-dashed border-stone-300 bg-white/60 p-8 text-center dark:border-stone-700 dark:bg-stone-900/70">
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-honey/20 text-3xl">
      🍽
    </div>
    <p className="text-stone-600 dark:text-stone-300">{message}</p>
    {actionLabel && onAction ? (
      <button
        type="button"
        onClick={onAction}
        className="mt-4 rounded-lg bg-tea px-4 py-2 text-sm font-medium text-white transition hover:bg-tea/90"
      >
        {actionLabel}
      </button>
    ) : null}
  </div>
);
