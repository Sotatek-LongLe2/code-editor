import { RefObject, useEffect } from 'react';

const useScrollToActiveTab = (selectedTab: string, tabRefs: RefObject<HTMLDivElement>[], tabs: string[]) => {
  useEffect(() => {
    const activeTabElement = tabRefs[tabs.indexOf(selectedTab)]?.current;

    if (activeTabElement) {
      activeTabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }

    return () => {};
  }, [selectedTab, tabRefs, tabs]);
};

export default useScrollToActiveTab;
