"use client";

import { useEffect, useState } from "react";

export default function useCheckIds({ data }) {
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isChecked, setIsChecked] = useState([]);

  const handleCheck = (e) => {
    const { value, checked } = e.target;
    setIsChecked((prev) => [...prev, value]);
    if (!checked) {
      setIsChecked((prev) => prev.filter((id) => id !== value));
    }
  };

  const handleCheckAll = (value) => {
    setIsAllChecked(value);
    setIsChecked(data.map((obj) => JSON.stringify(obj.id)));
    if (isAllChecked) {
      setIsChecked([]);
    }
  };

  useEffect(() => {
    const allChecked =
      data.length >= 1 &&
      data.every((obj) => isChecked.includes(JSON.stringify(obj.id)));
    if (allChecked) {
      setIsAllChecked(true);
    } else {
      setIsAllChecked(false);
    }
  }, [data, isChecked]);

  return { isChecked, setIsChecked, isAllChecked, handleCheck, handleCheckAll };
}
