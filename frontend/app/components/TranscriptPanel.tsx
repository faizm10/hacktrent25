interface TranscriptPanelProps {
  title: string;
  placeholderText?: string;
}

const TranscriptPanel = ({
  title,
  placeholderText = "Transcript text will appear here once the session begins.",
}: TranscriptPanelProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        <p>{placeholderText}</p>
      </div>
    </div>
  );
};

export default TranscriptPanel;

