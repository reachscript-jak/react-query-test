import React from 'react';

type Props = {
  open: boolean;
};

export const useInputFile = ({ open }: Props) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // ダイアログ閉じたときの処理
  const handleClose = React.useCallback(() => {
    setFiles([]);

    // inputのファイルを削除
    if (!inputRef.current?.files) return;
    inputRef.current.value = '';
  }, [setFiles]);

  // 「ファイル追加」ボタン押下時の処理
  const addFileClick = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };

  // inputタグのクリックイベント時の処理
  const addFile: (e: React.ChangeEvent<HTMLInputElement>) => File[] = (e) => {
    if (!e.target.files) return [];

    const file: File = e.target.files[0];
    const result = [...files, file];
    setFiles(result);
    return result;
  };

  // 「削除」ボタン押下時の処理
  const removeFile =
    (index: number) => (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();

      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);

      // inputタグ内のファイルを削除
      if (!inputRef.current?.files) return;
      inputRef.current.value = '';
    };

  React.useEffect(() => {
    if (!open) handleClose();
  }, [open, handleClose]);

  return {
    inputRef,
    files,
    addFileClick,
    addFile,
    removeFile,
  };
};
