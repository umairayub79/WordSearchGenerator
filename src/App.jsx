import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar/Navbar";
import WordSearch from "./components/WordSearch/WordSearch";
import { Button, Input, Select, Option, Checkbox } from "@material-tailwind/react";

function App() {
  const [words, setWords] = useState([]);
  const [size, setSize] = useState("12");
  const [selectCharset, setCharset] = useState('balochi');
  const [highlight, setHighlight] = useState(false);
  const [errorWords, setErrorWords] = useState(false);
  const [inputDirection, setInputDirection] = useState("rtl")
  const [errorWordsMessage, setErrorWordsMessage] = useState('')
  const inputRefWords = useRef(null);

  const englishPattern = /^[a-zA-Z,]*$/;
  const balochiPattern = /^[\u0600-\u06FF,]*$/;

  const handleClick = () => {
    const words = inputRefWords.current.value;

    if (words.trim().length === 0) {
      setErrorWordsMessage("Words cannot be empty")
      setErrorWords(true);
      return;
    } else {
      const pattern = selectCharset === 'english' ? englishPattern : balochiPattern;
      if (!pattern.test(words.trim())) {
        if (selectCharset === 'english') {
          setErrorWordsMessage("Words may only contain English letters")
        } else {
          setErrorWordsMessage("Words may only contain Balochi letters")
        }
        setErrorWords(true);
        return;
      }
      setErrorWords(false)
      setWords(words.split(",").map(word => word.trim()));
    }
  };

  const handleChange = (e) => {
    inputRefWords.current.value = "";
    setCharset(e); 
    setWords([]);
    setErrorWordsMessage('');
    setErrorWords(false)
    if (e == "balochi") {
      setInputDirection("rtl")
    } else {
      setInputDirection("ltr")
    }
  }

  return (
    <div className="min-h-[100vh] min-w-[100vw] flex flex-col items-center content-center">
      <Navbar />
      <div className="w-screen p-4">
        <div className="flex w-full flex-col gap-6 rounded-md bg-white bg-clip-border text-gray-700 shadow-md p-5">
          <Select label="Size" value={size} onChange={(e) => { setSize(e) }}>
            <Option value={"10"}>10x10</Option>
            <Option value={"12"}>12x12</Option>
            <Option value={"15"}>15x15</Option>
            <Option value={"18"}>18x18</Option>
            <Option value={"20"}>20x20</Option>
            <Option value={"25"}>25x25</Option>
          </Select>
          <Select label="Character set" value={selectCharset} onChange={handleChange}>
            <Option value="english">English</Option>
            <Option value="balochi">بلوچی</Option>
          </Select>
          <Input dir={inputDirection} inputRef={inputRefWords} variant="standard" label="Add words separated by commas" error={errorWords} />
          {errorWords && <p className="text-sm text-red-500">{errorWordsMessage}</p>}
          <Button className="mt-10" onClick={handleClick}>
            Create
          </Button>
          <Checkbox color="blue" label="Highlight words" onChange={(e) => setHighlight(e.target.checked)} checked={highlight} />
        </div>
      </div>
      <div className="flex w-full flex-col rounded-md bg-clip-border text-gray-700 shadow-md m-10 p-5">
        {words.length > 0 ? <WordSearch size={parseInt(size)} words={words} charset={selectCharset} highlight={highlight} /> : <p>Wordsearch not created yet <br /> Choose options and click Create to generate a wordsearch.</p>}
      </div>
    </div>
  );
}

export default App;