import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { useRef } from "react";

function App() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(10);
  const [symbolsAllowd, setSymbolsAllowed] = useState(false);
  const [numbersAllowed, setNumbersAllowed] = useState(true);
  const [uppercaseAllowed, setUppercaseAllowed] = useState(false);
  const [lowercaseAllowed, setLowercaseAllowed] = useState(false);

  const copybtn = useRef(null);

  const generatePassword = useCallback(() => {
    let charList = "";

    if (numbersAllowed) {
      charList += "0123456789";
    }
    if (uppercaseAllowed) {
      charList += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (lowercaseAllowed) {
      charList += "abcdefghijklmnopqrstuvwxyz";
    }
    if (symbolsAllowd) {
      charList += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    }

    let passwordResult = "";
    const charListLength = charList.length;
    for (let i = 0; i < length; i++) {
      const characterIndex = Math.floor(Math.random() * (charListLength - 1));
      passwordResult += charList.charAt(characterIndex);
    }

    setPassword(passwordResult);
  }, [
    length,
    numbersAllowed,
    uppercaseAllowed,
    lowercaseAllowed,
    symbolsAllowd,
    setPassword,
  ]);

  useEffect(() => {
    generatePassword();
  }, [
    length,
    numbersAllowed,
    uppercaseAllowed,
    lowercaseAllowed,
    symbolsAllowd,
  ]);

  return (
    <>
      <div className="w-full h-screen bg-black text-white">
        <div className="w-1/2 mx-auto pt-20">
          <h1 className="text-4xl font-bold text-center">Password Generator</h1>
          <div className="bg-gray-800 p-10 mt-10 rounded-lg">
            <div className="bg-white py-2 px-6 w-full text-black">
              {password}
            </div>

            <button ref={copybtn} onClick={() => {
              navigator.clipboard.writeText(password);
              copybtn.current.innerText = "Copied!";
              setTimeout(() => {
                copybtn.current.innerText = "Copy Password";
              }, 2000);
            }} className="mt-4 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
              Copy Password

            </button>
            
            <div className="mt-6 ">
              <label>Password Length: {length}</label>
              <input
                type="range"
                min="6"
                max="20"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="mt-4">
              <label>
                <input
                  type="checkbox"
                  checked={numbersAllowed}
                  onChange={(e) => setNumbersAllowed(e.target.checked)}
                />
                Include Numbers
              </label>
            </div>

            <div className="mt-4">
              <label>
                <input
                  type="checkbox"
                  checked={uppercaseAllowed}
                  onChange={(e) => setUppercaseAllowed(e.target.checked)}
                />
                Include Uppercase Letters
              </label>
            </div>
            <div className="mt-4">
              <label>
                <input
                  type="checkbox"
                  checked={lowercaseAllowed}
                  onChange={(e) => setLowercaseAllowed(e.target.checked)}
                />
                Include Lowercase Letters
              </label>
            </div>
            <div className="mt-4">
              <label>
                <input
                  type="checkbox"
                  checked={symbolsAllowd}
                  onChange={(e) => setSymbolsAllowed(e.target.checked)}
                />
                Include Symbols
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
