import MonacoEditor from 'components/layout/MonacoEditor';

interface IProps {}

const App: React.FC<IProps> = () => {
  return (
    <div className='App' data-testid='app-container'>
      <MonacoEditor />
    </div>
  );
};

export default App;
