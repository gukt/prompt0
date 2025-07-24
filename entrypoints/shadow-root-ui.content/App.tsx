import { useState } from "react";

export default () => {
  const [count, setCount] = useState(1);
  const increment = () => setCount((count) => count + 1);

  return (
    <div>
      <p style={{ color: 'white' }}>This is React. {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
};
