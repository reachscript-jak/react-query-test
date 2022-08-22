import { useAddTodo } from "./hooks/useAddTodo";
import type { Todo } from "./hooks/useAddTodo";
import { ModalDialogInputFile } from "./features/ModalDialogInputFile";

const todo: Todo = {
  id: 1,
  firstname: 'Taro',
  lastname: 'Yamada',
}

export const App = () => {
  const { postAddTodo, isSuccess } = useAddTodo();

  const onSuccess = () => alert('成功！');
  const onError = () => alert('失敗！');

  const onClickButton = () => {
    postAddTodo({ todo, onSuccess, onError });
  }

  return (
    <div>
      <h1>Hello World!!</h1>
      <button onClick={onClickButton}>カスタムフック実行</button>
      <p>{isSuccess ? 'true' : 'false'}</p>
      <hr />
      <ModalDialogInputFile open={true} onFileChange={() => console.log('File Change!')} />
    </div>
  );
}
