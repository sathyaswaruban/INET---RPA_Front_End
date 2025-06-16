// utils/navCache.ts (you can create this helper file)
export const getCachedNavItems = () => {
  const localNav = localStorage.getItem("navData");
  if (!localNav) return null;

  const parsed = JSON.parse(localNav);
  const now = Date.now();
  const isExpired = now - parsed.timestamp > 30 * 60 * 1000; // 30 minutes

  return isExpired ? null : parsed.data;
};

export const cacheNavItems = (data: any) => {
  localStorage.setItem(
    "navData",
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
};
