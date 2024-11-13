import { useState } from 'react';
import { Tabs } from '@sk-web-gui/react';
import { EmploymentsTab } from './employments-tab.component';

export const TabsWrapper: React.FC = () => {
  const tabs: {
    label: string;
    content: React.ReactNode;
    disabled: boolean;
  }[] = [
    {
      label: 'Anställning',
      content: <EmploymentsTab />,
      disabled: false,
    },
  ];

  // const [current, setCurrent] = useState<number | undefined>(0);
  // let currentTab = current;
  // NOTE: Above might be needed later when more tabs...

  return (
    <Tabs tabslistClassName="-m-b-12 flex-wrap">
      {tabs.map((tab) => {
        return (
          <Tabs.Item key={tab.label}>
            <Tabs.Button disabled={tab.disabled} className="text-small">
              {tab.label}
            </Tabs.Button>
            <Tabs.Content>{tab.content}</Tabs.Content>
          </Tabs.Item>
        );
      })}
    </Tabs>
  );
};
