export default function FormAPIError({ status }) {
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
