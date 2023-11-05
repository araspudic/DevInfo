import React from 'react';
import ReactDOM from 'react-dom';

// Get the JSX content from the container
const jsxContainer = document.getElementById('jsx-container');
const jsxContent = jsxContainer.innerHTML;

// Render the JSX content using React
ReactDOM.hydrate(jsxContent, jsxContainer);


const MyComponent = () => {
    return <div>Hello, I am a client-side React component!</div>;
  };
  
  export default MyComponent;