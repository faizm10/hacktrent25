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
    <div className="flex flex-col gap-3 items-end w-full font-inter">
      {title && (
        <h3
          className="text-xl font-bold self-start tracking-tight"
          style={{ color: "#4A3F35" }}
        >
          {title}
        </h3>
      )}
      <div
        className="w-full max-w-[85%] rounded-2xl rounded-tr-sm px-5 py-4 text-base leading-relaxed shadow-lg"
        style={{
          backgroundColor: "#D4A574",
          color: "#FFFFFF",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          boxShadow:
            "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
          transform: "translateY(-1px)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <p className="whitespace-pre-wrap break-words">{displayText}</p>
      </div>
    </div>
  );
};

export default TranscriptPanel;
