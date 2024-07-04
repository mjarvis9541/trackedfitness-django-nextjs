type Props = {
  status: {
    non_field_errors: [];
  };
};

export default function FormAPIError({ status }: Props) {
  if (!status) return <></>;
  if (Array.isArray(status)) {
    return (
      <>
        {status &&
          status.map((message, i) => (
            <div className="my-2 font-bold text-red-500" key={i}>
              {message}
            </div>
          ))}
      </>
    );
  } else {
    return (
      <>
        <div className="my-2 font-bold text-red-500">{status}</div>
      </>
    );
  }
}
