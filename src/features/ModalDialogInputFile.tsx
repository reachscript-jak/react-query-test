import React from 'react';
import { useInputFile } from './useInputFile';

type Props = {
  open: boolean;
  onFileChange: (files: File[]) => void;
};

export function ModalDialogInputFile({ open, onFileChange }: Props) {
  const { inputRef, files, addFileClick, addFile, removeFile } = useInputFile({ open });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(addFile(e));
  };

  return (
    <div>
      <label htmlFor="file">
        <button
          type="button"
          onClick={addFileClick}
        >
          ファイル追加
        </button>
        <input
          data-testid="test-file"
          id="file"
          type="file"
          multiple
          ref={inputRef}
          hidden
          onChange={handleFileChange}
        />
      </label>

      {files.map((file, index) => (
        <div
          key={Math.random().toString(32).substring(2)}
          className="flexBox"
        >
          <div>{file.name}</div>

          <div>
            <button type='button' onClick={removeFile(index)}>
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
