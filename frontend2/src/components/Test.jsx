import React, { useState, useEffect } from 'react';

export default function MyComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("Hello");

  useEffect(() => {
    console.log("useEffect called: count changed or text changed");
    // Perform some effect
    return () => {
      console.log("Cleanup previous effect");
    };
  }, [count, text]);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const changeText = () => {
    setText("Hi");
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementCount}>Increment Count</button>
      <button onClick={changeText}>Change Text</button>
    </div>
  );
}
