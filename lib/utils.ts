import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatAmount = (amount: number): string => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
};

export function formUrlQuery({ params, key, value }: { params: string, key: string, value: string | null }) {
  const currentUrl = new URLSearchParams(params);

  if (value && value !== "") {
    currentUrl.set(key, value);
  } else {
    currentUrl.delete(key);
  }

  return `?${currentUrl.toString()}`;
}
