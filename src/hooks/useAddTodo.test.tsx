import { act, cleanup, renderHook } from '@testing-library/react-hooks';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { toRequestModel, useAddTodo } from './useAddTodo';
import type { Todo } from './useAddTodo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// モックするサーバーの設定
const sever = setupServer(
  rest.post('https://jsonplaceholder.typicode.com/posts', (_req, res, ctx) => {
    return res(
      // 上記のエンドポイントにpostリクエストが来た場合は正常終了としてモックする
      ctx.status(200),
      // 何かダミーで返却するには以下のように設定
      // ctx.json({
      //   id: 1,
      //   fullname: 'hoge',
      // }),
    );
  })
);

// テスト前にサーバー起動
beforeAll(() => sever.listen());

// テストケース毎にきれいな状態に戻す
afterEach(() => {
  sever.resetHandlers();
  cleanup();
});

// テスト後にサーバーを閉じる
afterAll(() => sever.close());

// テスト用データ
const todo: Todo = {
  id: 1,
  firstname: 'Taro',
  lastname: 'Yamada',
}

// react-queryのテストに必要な設定
const queryClient = new QueryClient();
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useAddTodo Test', () => {
  // ※ 正常に実行されていることは↓のonSuccessが実行されていることと同義なので↓とまとめても良いと思います
  test('正しいエンドポイントにPOSTリクエストが実行されていること', async () => {
    // カスタムフックのレンダリング
    const { result, waitForNextUpdate } = renderHook(() => useAddTodo(), { wrapper });
    // API実行
    act(() => {
      result.current.postAddTodo({ todo, onSuccess: jest.fn(), onError: jest.fn() });
    });
    // カスタムフック内のステートの変更を待つ
    await waitForNextUpdate();
    // 実行後に正常終了していることの確認
    expect(result.current.isSuccess).toBeTruthy();
  });

  test('onSuccessが実行されていること', async () => {
    // カスタムフックのレンダリング
    const { result, waitForNextUpdate } = renderHook(() => useAddTodo(), { wrapper });
    // ダミー関数の設定
    const successFn = jest.fn();
    // API実行
    act(() => {
      result.current.postAddTodo({ todo, onSuccess: successFn, onError: jest.fn() });
    });
    // カスタムフック内のステートの変更を待つ
    await waitForNextUpdate();
    // 実行後に成功時の関数が実行されていることの確認(引数として渡した関数が1度実行されているかどうかの確認)
    expect(successFn).toHaveBeenCalledTimes(1);
  });

  test('onErrorが実行されていること', async () => {
    // サーバーの設定を一時的に上書き
    sever.use(
      rest.post('https://jsonplaceholder.typicode.com/posts', (_req, res, ctx) => {
        return res(
          // 異常終了としてモックする
          ctx.status(500),
        );
      })
    );
    // カスタムフックのレンダリング
    const { result, waitForNextUpdate } = renderHook(() => useAddTodo(), { wrapper });
    // ダミー関数の設定
    const errorFn = jest.fn();
    // API実行
    act(() => {
      result.current.postAddTodo({ todo, onSuccess: jest.fn(), onError: errorFn });
    });
    // カスタムフック内のステートの変更を待つ
    await waitForNextUpdate();
    // 実行後に失敗時の関数が実行されていることの確認(引数として渡した関数が1度実行されているかどうかの確認)
    expect(errorFn).toHaveBeenCalledTimes(1);
  });

  test('API実行時にtoRequestModelでのデータ変換が行われていること', async () => {
    // カスタムフックのレンダリング
    const { result, waitForNextUpdate } = renderHook(() => useAddTodo(), { wrapper });
    // API実行
    act(() => {
      result.current.postAddTodo({ todo, onSuccess: jest.fn(), onError: jest.fn() });
    });
    // カスタムフック内のステートの変更を待つ
    await waitForNextUpdate();
    // API実行時に渡されたパラメータとtoRequestModelで変換したものが一致するかどうかの確認
    expect(JSON.parse(result.current.data?.config.data)).toEqual(toRequestModel(todo));
  });
});
