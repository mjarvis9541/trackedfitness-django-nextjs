import DietWeekListHeader from "../diet/DietWeekListHeader";
import DietTargetWeekListFooter from "./TargetWeekListFooter";
import DietTargetWeekListItem from "./TargetWeekListItem";

const DietTargetWeekListContainer = ({
  dateRange,
  username,
  isLoading,
  error,
  data,
  isCheck,
  isCheckAll,
  handleCheck,
  handleCheckAll,
  baseTargetIsLoading,
  baseTargetError,
  baseTargetData,
}) => {
  return (
    <>
      <DietWeekListHeader
        isCheckAll={isCheckAll}
        handleCheckAll={handleCheckAll}
      />
      <DietTargetWeekList
        dateRange={dateRange}
        username={username}
        isLoading={isLoading}
        error={error}
        data={data}
        isCheck={isCheck}
        handleCheck={handleCheck}
        baseTargetIsLoading={baseTargetIsLoading}
        baseTargetError={baseTargetError}
        baseTargetData={baseTargetData}
      />
    </>
  );
};

const DietTargetWeekList = ({
  baseTargetIsLoading,
  baseTargetError,
  baseTargetData,
  dateRange,
  username,
  isLoading,
  error,
  data,
  isCheck,
  handleCheck,
}) => {
  if (isLoading || baseTargetIsLoading)
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

  let merged = [];
  for (let i = 0; i < dateRange.length; i++) {
    const serverData = data?.find((item) => item.date === dateRange[i].date);
    if (!serverData) {
      merged.push({
        date: dateRange[i].date,
        ...baseTargetData,
      });
    } else {
      merged.push({
        ...serverData,
      });
    }
  }

  const macroArr = Object.keys(merged[0]);
  // console.log(Object.keys(merged[0]));
  // method 1:
  const obj = {};
  for (const key of macroArr) {
    obj[key] = 0;
  }

  // method 2:
  const obj2 = macroArr.reduce((o, key) => Object.assign(o, { [key]: 0 }), {});

  // method 3:
  const obj3 = macroArr.reduce((o, key) => ({ ...o, [key]: 0 }), {});

  // const best = merged.reduce((acc, curr) => {
  //   let keys = Object.keys({ ...acc });
  //   for (var j = 0; j < keys.length; j++) {
  //     // console.log(curr);
  //   }
  // });

  // const total = merged.reduce(
  //   (acc, curr) => {
  //     let keys = Object.keys({ ...acc });

  //     for (var j = 0; j < keys.length; j++) {
  //       acc[keys[j]] += Number(curr[keys[j]]);
  //     }
  //     // console.log("acc", acc);
  //     // console.log("curr", curr);
  //     return acc;
  //   },
  //   { ...obj3 }
  // );

  // const filterAllowedObjectProperties = (obj, allowedProperties = []) => {
  //   return Object.keys(obj).reduce((next, key) => {
  //     if (allowedProperties.includes(key)) {
  //       return { ...next, [key]: obj[key] };
  //     } else {
  //       return next;
  //     }
  //   }, {});
  // };

  // const test2 = merged.reduce((arr, curr, i) => {
  //   {
  //     console.log(arr);
  //   }
  // }, 0);

  // const rzz = filterAllowedObjectProperties;

  // // console.log(test2);

  // // console.log(obj3);

  // console.log("1", obj);
  // console.log("2", obj2);
  // console.log("3", obj3);

  const total = merged.reduce((prev, curr) => {
    for (let i = 0; i < dateRange.length; i++) {
      return {
        energy: prev.energy + Number(curr.energy),
        protein: Number(prev.protein) + Number(curr.protein),
        carbohydrate: Number(prev.carbohydrate) + Number(curr.carbohydrate),
        fat: Number(prev.fat) + Number(curr.fat),
        saturates: Number(prev.saturates) + Number(curr.saturates),
        sugars: Number(prev.sugars) + Number(curr.sugars),
        fibre: Number(prev.fibre) + Number(curr.fibre),
        salt: Number(prev.salt) + Number(curr.salt),
        protein_per_kg:
          Number(prev.protein_per_kg) + Number(curr.protein_per_kg),
        carbohydrate_per_kg:
          Number(prev.carbohydrate_per_kg) + Number(curr.carbohydrate_per_kg),
        fat_per_kg: Number(prev.fat_per_kg) + Number(curr.fat_per_kg),
      };
    }
  });

  total.percent_protein = ((total.protein * 4) / total.energy) * 100;
  total.percent_carbohydrate = ((total.carbohydrate * 4) / total.energy) * 100;
  total.percent_fat = ((total.fat * 9) / total.energy) * 100;

  return (
    <>
      {merged.map((data) => (
        <DietTargetWeekListItem
          key={data.date}
          username={username}
          data={data}
          isCheck={isCheck}
          handleCheck={handleCheck}
        />
      ))}
      <DietTargetWeekListFooter
        isLoading={isLoading}
        error={error}
        total={total}
      />
    </>
  );
};

export default DietTargetWeekListContainer;
