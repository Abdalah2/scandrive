import { useEffect, useMemo, useState } from 'react';

export function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function useMockApi(data, options = {}) {
  const { delay = 380, transform = (value) => value } = options;
  const memoizedData = useMemo(() => transform(data), [data, transform]);
  const [state, setState] = useState({ loading: true, data: memoizedData });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setState({ loading: false, data: memoizedData });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [delay, memoizedData]);

  return state;
}