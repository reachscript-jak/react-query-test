import { useMutation } from "@tanstack/react-query";
import axios from "axios"
import { useCallback, useState } from "react";

export type Todo = {
  id: number;
  firstname: string;
  lastname: string;
}

type NewTodo = {
  id: number;
  fullname: string;
}

export const toRequestModel = (todo: Todo): NewTodo => {
  return {
    id: todo.id,
    fullname: `${todo.lastname} ${todo.firstname}`,
  }
}

export const useAddTodo = () => {
  const { mutate, data, isSuccess: _isSuccess, isError } = useMutation((newTodo: NewTodo) => axios.post('https://jsonplaceholder.typicode.com/posts', newTodo));

  // react-queryの返却するisSuccessではなく別途Stateを定義する意味はある？
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const postAddTodo = useCallback(({
    todo,
    onSuccess,
    onError,
  }: {
    todo: Todo;
    onSuccess: VoidFunction;
    onError: VoidFunction;
  }) => {
    // onSuccessやonErrorを使用するならmutateを使うほうが良さそうです
    // mutateAsyncを使う場合はtry catchで囲む必要がありそうです
    // 参考：https://tanstack.com/query/v4/docs/guides/mutations#promises
    mutate(toRequestModel(todo), { 
      onSuccess: () => {
        setIsSuccess(true);
        onSuccess();
      },
      onError: () => {
        setIsSuccess(false);
        onError();
      },
    });
  }, [mutate]);

  return { postAddTodo, data, isSuccess } 
}
