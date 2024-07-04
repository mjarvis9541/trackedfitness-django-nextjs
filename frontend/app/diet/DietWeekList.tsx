import DietWeekListFooter from "./DietWeekListFooter";
import DietWeekListHeader from "./DietWeekListHeader";
import DietWeekListItem from "./DietWeekListItem";

const DietWeekListContainer = ({
  dateRange,
  username,
  isLoading,
  error,
  data,
  isCheck,
  isCheckAll,
  handleCheck,
  handleCheckAll,
}) => {
  return (
    <>
      <DietWeekListHeader
        isCheckAll={isCheckAll}
        handleCheckAll={handleCheckAll}
      />
      <DietWeekList
        dateRange={dateRange}
        username={username}
        isLoading={isLoading}
        error={error}
        data={data}
        isCheck={isCheck}
        handleCheck={handleCheck}
      />
      <DietWeekListFooter isLoading={isLoading} error={error} data={data} />
    </>
  );
};

const DietWeekList = ({
  dateRange,
  username,
  isLoading,
  error,
  data,
  isCheck,
  handleCheck,
}) => {
  if (isLoading)
    return (
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        Error
      </div>
    );

  // method 1:
  let merged = [];
  for (let i = 0; i < dateRange.length; i++) {
    merged.push({
      ...dateRange[i],
      ...data.find((item) => item.date === dateRange[i].date),
    });
  }
  // method 2:
  const merger = dateRange.map((dr) => {
    const obj = data.find((obj) => obj.date === dr.date);
    if (obj) return { ...dr, ...obj };
    return dr;
  });

  return (
    <>
      {merged.map((data) => (
        <DietWeekListItem
          key={data.date}
          username={username}
          data={data}
          isCheck={isCheck}
          handleCheck={handleCheck}
        />
      ))}
    </>
  );
};

export default DietWeekListContainer;
