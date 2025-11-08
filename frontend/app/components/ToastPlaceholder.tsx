interface ToastPlaceholderProps {
  message?: string | null;
}

const ToastPlaceholder = ({ message }: ToastPlaceholderProps) => {
  const displayMessage =
    typeof message === "string" && message.trim().length > 0
      ? message
      : "Toasts appear here";

  return (
    <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
      {displayMessage}
    </div>
  );
};

export default ToastPlaceholder;

