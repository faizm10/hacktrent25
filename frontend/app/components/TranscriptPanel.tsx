interface TranscriptPanelProps {
  title: string;
  placeholderText?: string;
  content?: string;
}

const TranscriptPanel = ({
  title,
  placeholderText = "Transcript text will appear here once the session begins.",
  content,
}: TranscriptPanelProps) => {
  const displayText =
    typeof content === "string" && content.trim().length > 0
      ? content
      : placeholderText;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        <p>{displayText}</p>
      </div>
    </div>
  );
};

export default TranscriptPanel;

