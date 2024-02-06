import { useEffect, useState, createRef } from 'react';

const useTabRefs = (tabs: string[]) => {
  const [tabRefs, setTabRefs] = useState<React.RefObject<HTMLDivElement>[]>([]);

  useEffect(() => {
    // Create a ref for each tab
    setTabRefs(tabs.map(() => createRef<HTMLDivElement>()));
  }, [tabs]);

  return tabRefs;
};

export default useTabRefs;
