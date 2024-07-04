export default function FormButton({
  label = "Submit",
  loadingLabel = "Submitting...",
  loading = false,
  disabled = false,
  style,
}: {
  label?: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: "primary" | "secondary" | "danger";
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="rounded bg-blue-700 px-4 py-2 text-sm font-bold disabled:cursor-default disabled:opacity-50"
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
