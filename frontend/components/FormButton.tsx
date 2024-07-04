type FormButtonProps = {
  label?: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
};

export default function FormButton({
  label = "Submit",
  loadingLabel = "Submitting...",
  loading = false,
  disabled = false,
}: FormButtonProps) {
  return (
    <button
      type="submit"
      className="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-400 disabled:bg-gray-300 disabled:text-white disabled:opacity-40"
      disabled={disabled}
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
