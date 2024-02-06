import { useEffect, useState, createRef, RefObject } from 'react';

const useTabRefs = (tabs: string[]) => {
  const [tabRefs, setTabRefs] = useState<RefObject<HTMLDivElement>[]>([]);

  useEffect(() => {
    // Create a ref for each tab
    setTabRefs(tabs.map(() => createRef<HTMLDivElement>()));
  }, [tabs]);

  return tabRefs;
};

export default useTabRefs;
