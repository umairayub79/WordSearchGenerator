import React, { useEffect, useState } from "react";
import {Button} from "@material-tailwind/react"
import { MdDownload } from "react-icons/md"
import charsets from "../../constants/Charsets.js"
const WordSearch = ({words, size, charset, highlight}) => {
  
  const [highlighted, setHighlighted] = useState([]); // state to store found words
  const [grid, setGrid] = useState([]); // state to store the word search grid
  let textFileURL = '';
  
  // function to generate a word search grid
  function generateGrid(size, words, letters){
    const grid = []
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        // add a random letter to each cell
        row.push(letters[Math.floor(Math.random() * letters.length)]);
      }
      grid.push(row);
    }

    // place the words in the grid (if there are any)
    if (words.length > 0) {
      let items = []
      words.forEach(word => {
        let x, y, dx, dy;
        do {
          // pick a random starting position
          x = Math.floor(Math.random() * size);
          y = Math.floor(Math.random() * size);

          // pick a random direction
          const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
          dx = direction === "horizontal" ? 1 : 0;
          dy = direction === "vertical" ? 1 : 0;

          // check if word fits in the grid from this position and direction
        } while (x + dx * (word.length - 1) >= size || y + dy * (word.length - 1) >= size);

        // place the word in the grid
        for (let i = 0; i < word.length; i++) {
          grid[y + i * dy][x + i * dx] = word[i].toUpperCase();
          items.push({ "row": y + i * dy, "col": x + i * dx, "letter": word[i].toUpperCase()})
          
        }
      });
      setHighlighted(JSON.stringify(items))
      console.log(JSON.stringify(items))
    }

    // update the state with the new grid
    setGrid(grid);
  }

  // function to create a download link for the word search
  function makeTextFile(text) {
    let data = new Blob([text], {type: 'text/plain;charset=utf8'});
    if (textFileURL !== null) {
      URL.revokeObjectURL(textFileURL);
    }
    textFileURL = URL.createObjectURL(data);
    return textFileURL;
  }

  // function to download the word search as a text file
  function download() {
    console.log('download')
    let wordsearchLetters = grid.map(row => row.map(cell => cell));
    let wordsearchString = wordsearchLetters.map(row => row.join(" ")).join("\n");

    let wordsString = words.map(w => w).join("\n");
    let textFileString = wordsearchString + "\n\n" + wordsString;
    let fileName = `wordsearch-${Math.floor(Math.random() * 999)}.txt`
    textFileURL = null
    let url = makeTextFile(textFileString);
    let element = document.createElement("a");
    element.href = url;
    element.download = fileName;
    element.click();
  }

  // generate the word search grid when the component mounts or the props change
  useEffect(() => {
    generateGrid(size, words, charset === 'balochi'? charsets.balochi : charsets.english);
  }, [size, words, charset]);

  // render the word search grid
  return (
  // Main container for the grid
  <div className="flex flex-col items-center justify-center">
    <div className="flex flex-col items-center justify-center">
      {grid.map((row, rowIndex) => (
        // Container for each row in the grid
        <div key={rowIndex} className="w-screen flex flex-row items-center justify-center">
          {row.map((item, colIndex) => (
            // Container for each cell in the grid
            <div key={colIndex} className={`h-8 w-8 text-center text-black ${highlight ? highlighted.includes(JSON.stringify({"row": rowIndex, "col": colIndex, "letter": item}))  ? 'bg-blue-600' : 'bg-white' : 'bg-white'}`}>
              {item.toUpperCase()}
            </div>
          ))}
        </div>
      ))}
    </div>
    <div className="flex flex-col">
    {words.map((word, index) => (
    <div key={index}>{word}</div>
    ))}
    </div>
      <Button className="flex items-center mt-3" onClick={download}>
        <MdDownload  className="h-5 w-5" />
        Download txt File
      </Button>
  </div>
)};

export default WordSearch;