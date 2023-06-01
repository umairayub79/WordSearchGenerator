import { useState, useRef } from "react";
import Navbar from "./components/Navbar/Navbar";
import WordSearch from "./components/WordSearch/WordSearch";
import {
  Button,
  Input,
  Select,
  Option,
  Card,
  CardBody,
  CardFooter,
  Alert,
  Checkbox,
  Chip,
} from "@material-tailwind/react";

function App() {
  const [title, setTitle] = useState("")
  const [words, setWords] = useState([]);
  const [size, setSize] = useState("12");
  const [charset, setCharset] = useState("Balochi");
  const [highlightWords, setHighlightWords] = useState(false);
  const [errorInWords, setErrorInWords] = useState(false);
  const [inputDirection, setInputDirection] = useState("rtl");
  const [errorWordsMessage, setErrorWordsMessage] = useState("");
  const [renderGrid, setRenderGrid] = useState(false);
  const inputRefWords = useRef(null);

  const englishPattern = /^[a-zA-Z,]*$/;
  const balochiPattern = /^[\u0600-\u06FF,]*$/;

  const handleKeyPress = (event) => {
    const value = inputRefWords.current.value.trim().toUpperCase();
    if (event.key === "Enter" && value !== "" && !words.includes(value)) {
      const pattern = charset === "English" ? englishPattern : balochiPattern;
      if (!pattern.test(value)) {
        setErrorWordsMessage(
          `Words may only contain ${charset} letters (No Spaces)`
        );
        setErrorInWords(true);
        return;
      }
      if (value.length > size) {
        setErrorWordsMessage(`The value must not exceed ${size} characters.`);
        setErrorInWords(true);
        return;
      }
      setErrorInWords(false);
      setWords([...words, value.trim()]);
      inputRefWords.current.value = "";
    }
  };

  const handleDelete = (wordToDelete) => {
    setWords(words.filter((word) => word !== wordToDelete));
    if (words.length <= 1) {
      setRenderGrid(false)
    }
  };

  const handleClick = () => {
    if (words.length > 0) {
      setRenderGrid(true);
    } else {
      setRenderGrid(false);
      setErrorWordsMessage("Words cannot be empty");
      setErrorInWords(true);
      return;
    }
  };

  const handleCharsetChange = (e) => {
    inputRefWords.current.value = "";
    setRenderGrid(false);
    setCharset(e);
    setWords([]);
    setErrorWordsMessage("");
    setErrorInWords(false);
    if (e == "Balochi") {
      setInputDirection("rtl");
    } else {
      setInputDirection("ltr");
    }
  };

  return (
    <div className="min-h-[100vh] min-w-[100vw] max-w-[100vw] flex flex-col items-center content-center bg-gray-100">
      <Navbar />
      <div className="flex flex-col lg:flex-row p-4 gap-2 w-screen">
        <Card className="w-full lg:w-1/2 shadow-lg p-5">
          <CardBody className="flex w-full flex-col gap-6">
            <Input
              variant="outlined"
              label="Title"
              onChange={(e) => setTitle(e.target.value)}
            />

            <Select
              label="Size"
              value={size}
              onChange={(e) => {
                setSize(e);
              }}
            >
              <Option value={"10"}>10x10</Option>
              <Option value={"12"}>12x12</Option>
              <Option value={"15"}>15x15</Option>
              <Option value={"18"}>18x18</Option>
              <Option value={"20"}>20x20</Option>
              <Option value={"25"}>25x25</Option>
            </Select>

            <Select
              label="Character set"
              value={charset}
              onChange={handleCharsetChange}
            >
              <Option value={"English"}>English</Option>
              <Option value={"Balochi"}>بلوچی</Option>
            </Select>

            <Input
              dir={inputDirection}
              inputRef={inputRefWords}
              variant="standard"
              label="Type a word and press Enter"
              onKeyPress={handleKeyPress}
              error={errorInWords}
            />
            {errorInWords && (
              <p className="text-sm text-red-500">{errorWordsMessage}</p>
            )}
            <div className="flex flex-wrap">
              {words.map((chip) => (
                <Chip
                  variant="gradient"
                  value={chip}
                  dismissible={{
                    onClose: () => handleDelete(chip),
                  }}
                  className="m-1"
                />
              ))}
            </div>
          </CardBody>
          <CardFooter className="mt-10 p-0">
            <Button
              size="lg"
              className="text-white hover:scale-[1.02] focus:scale-[1.02] active:scale-100"
              ripple={false}
              fullWidth={true}
              onClick={handleClick}
            >
              Create
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-full lg:w-1/2 shadow-lg p-5">
          {renderGrid ? (
            <>
              <Checkbox
                color="blue"
                label="Highlight words"
                onChange={(e) => setHighlightWords(e.target.checked)}
                checked={highlightWords}
              />
              <WordSearch
                size={parseInt(size)}
                words={words}
                charset={charset}
                highlight={highlightWords}
                title={title}
              />
            </>
          ) : (
            <Alert
              color="blue"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            >
              Word search not created yet <br /> Choose options and click Create
              to generate a wordsearch.
            </Alert>
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;
