import { format } from "date-fns";

export function formatLongDate(date: string) {
  return format(new Date(date), "EEEE, dd MMMM yyyy");
}

export function formatShortDate(date: string) {
  return format(new Date(date), "dd/MM/yyyy");
}

export function formatShortDateStr(date: string) {
  return format(new Date(date), "E, dd MMM yyyy");
}

export function formatDay(date: string) {
  return format(new Date(date), "EEEE");
}

export function formatDateTime(date: string) {
  return format(new Date(date), "dd/MM/yyyy HH:mm:ss");
}

export function formatShortDateTime(date: string) {
  return format(new Date(date), "dd MMM yyyy, HH:mm");
}

export function formatMonthYear(date: string) {
  return format(new Date(date), "LLLL yyyy");
}
