import { useCallback, useState } from 'react';

interface Props {
  inputRef?: React.RefObject<HTMLInputElement>;
}
export const InputText = ({
  inputRef,
  onChange,
  onKeyDown,
  ...restProps
}: Props & React.InputHTMLAttributes<HTMLInputElement>) => {
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.call(e, e);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isTyping || e.key !== 'Enter') {
        return;
      }
      onKeyDown?.call(e, e);
    },
    [isTyping, onKeyDown],
  );

  return (
    <input
      ref={inputRef}
      type="text"
      onCompositionStart={() => setIsTyping(true)}
      onCompositionEnd={() => setIsTyping(false)}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...restProps}
    />
  );
};
