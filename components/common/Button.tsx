export default function Button({ text, callBack, className }: ButtonProps) {
  return (
    <button type="submit" className={className} onClick={callBack}>
      {text}
    </button>
  );
}
