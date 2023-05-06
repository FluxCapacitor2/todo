export const Spinner = () => {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </span>
  );
};
