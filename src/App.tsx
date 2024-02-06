import { FC } from 'react';

import MonacoEditor from 'components/modules/MonacoEditor';

type TProps = {};

const App: FC<TProps> = () => {
  return (
    <div className='App' data-test-id='app-container'>
      <MonacoEditor />
    </div>
  );
};

export default App;
