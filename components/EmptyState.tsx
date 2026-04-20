type EmptyStateProps = {
  title: string;
  body?: string;
};

export function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <div className="exhibitions-empty">
      <div className="exhibitions-empty-title">{title}</div>
      {body && <p className="exhibitions-empty-body">{body}</p>}
    </div>
  );
}
