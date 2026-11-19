import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatINR(val: number | string | null | undefined): string {
  if (val === null || val === undefined || val === '') return '';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '';
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

export function formatSalaryRange(min: any, max: any, isDisclosed: boolean = true): string {
  if (isDisclosed === false) return 'Salary Confidential';
  if (!min && !max) return 'Competitive / Disclosed on Application';
  const numMin = Number(min);
  const numMax = Number(max);
  if (min && max) {
    if (numMin === numMax) return `${formatINR(min)} per annum`;
    return `${formatINR(min)} - ${formatINR(max)} per annum`;
  }
  if (min) return `From ${formatINR(min)} per annum`;
  if (max) return `Up to ${formatINR(max)} per annum`;
  return 'Competitive';
}
