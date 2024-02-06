import MonacoEditor from 'components/layout/MonacoEditor';

type TProps = {};

const App: React.FC<TProps> = () => {
  return (
    <div className='App' data-testid='app-container'>
      <MonacoEditor />
    </div>
  );
};

export default App;
