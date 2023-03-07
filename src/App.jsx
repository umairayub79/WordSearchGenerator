import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar/Navbar";
import WordSearch from "./components/WordSearch/WordSearch";
import { Button, Input, Select, Option, Checkbox } from "@material-tailwind/react";

function App() {
  const [words, setWords] = useState([]);
  const [size, setSize] = useState(12);
  const [selectCharset, setCharset] = useState('balochi')
  const [highlight, setHighlight] = useState(false)
  const inputRefSize = useRef(null);
  const inputRefWords = useRef(null);


  const handleClick = () => {
    const words = inputRefWords.current.value;
    const size = inputRefSize.current.value;

    if (size > 1 && size < 55) {
      setSize(size);
    } else {
      setSize(12)
    }
    if (words.length > 0 || words != ['']) {
      setWords(words.split(","));
    }
  };

  return (
    <div className="min-h-[100vh] min-w-[100vw] flex flex-col items-center content-center">
      <Navbar />
      <div className="w-screen p-4">
        <div className="flex w-full flex-col gap-6 rounded-md bg-white bg-clip-border text-gray-700 shadow-md p-5">
          <Input inputRef={inputRefSize} variant="static" label="Size" placeholder="Size" type="number" />
          <Select label="Character set" value={selectCharset} onChange={(e) => setCharset(e)}>
            <Option value="english">English</Option>
            <Option value="balochi">بلوچی</Option>
          </Select>
          <Input inputRef={inputRefWords} variant="standard" label="Add words separated by commas" />

          <Button className="mt-10" onClick={handleClick}>
            Create
          </Button>
          <Checkbox color="blue" label="Highlight words" onChange={(e) => setHighlight(e.target.checked)} checked={highlight} />
        </div>

      </div>
      <div className="flex w-full flex-col rounded-md bg-clip-border text-gray-700 shadow-md m-10 p-5">
        {words.length > 0 ? <WordSearch size={size} words={words} charset={selectCharset} highlight={highlight} /> : <p>Wordsearch not created yet <br /> Choose options and click Create to generate a wordsearch.</p>}
      </div>
    </div>
  );
}

export default App;