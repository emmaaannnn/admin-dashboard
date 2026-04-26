export const formatMoney = (value) => {
  const n = Number(value);
  if (!isFinite(n)) return "—";
  return `$${n.toFixed(2)} AUD`;
};

export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));