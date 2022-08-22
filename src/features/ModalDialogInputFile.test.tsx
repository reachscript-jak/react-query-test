import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModalDialogInputFile } from './ModalDialogInputFile';

// モックでアップロードするファイル名
const testFileName = 'hello.png';

test('upload file', () => {
  // モックファイル生成
  const file = new File(['hello'], testFileName, {type: 'image/png'});

  // コンポーネントレンダリング
  render(<ModalDialogInputFile open={true} onFileChange={jest.fn()} />);
  // file input要素を取得するためにtest用のidを指定（コンポーネント側にdata-testidの設定必要）
  const input: any = screen.getByTestId('test-file');
  // ファイルアップロードの実行
  userEvent.upload(input, file);

  // 以下のような確認方法があります（公式サイト参考：https://testing-library.com/docs/ecosystem-user-event/#uploadelement-file--clickinit-changeinit--options）
  expect(input.files[0]).toStrictEqual(file);
  expect(input.files.item(0)).toStrictEqual(file);
  expect(input.files).toHaveLength(1);

  // コンポーネント上で選択したファイル名を表示する仕様であれば以下のような確認方法も可能
  // getBy~は要素が見つからないとエラーになる = ファイルが正しく選択され画面に表示されていることの確認
  screen.getByText(testFileName);

  // 削除ボタンを押下
  const button = screen.getByText('削除');
  userEvent.click(button);

  // 画面上からファイルが削除されいることの確認（ファイル名が画面上に存在しない）
  expect(screen.queryByText(testFileName)).toBeNull();
});
