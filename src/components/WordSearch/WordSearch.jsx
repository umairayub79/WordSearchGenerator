import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react"
import { MdDownload } from "react-icons/md"
import charsets from "../../constants/Charsets.js"
const WordSearch = ({ words, size, charset, highlight }) => {

  const [highlighted, setHighlighted] = useState([]); // state to store found words
  const [grid, setGrid] = useState([]); // state to store the word search grid

  // function to generate a word search grid
  function generateGrid(size, words, letters) {
    const grid = Array.from(Array(size), () => new Array(size).fill(null));
    const highlightedItems = []

    // Insert each word into the grid at a random location and orientation
    for (const word of words) {
      const wordLength = word.length;
      const maxIterations = 1000;
      let iterations = 0;

      while (iterations < maxIterations) {
        const orientation = Math.floor(Math.random() * 4); // 0 = horizontal, 1 = vertical, 2 = diagonal up, 3 = diagonal down
        let startRow, startCol, rowStep, colStep;

        if (orientation === 0) {
          // Horizontal
          startRow = Math.floor(Math.random() * size);
          startCol = Math.floor(Math.random() * (size - wordLength + 1));
          rowStep = 0;
          colStep = 1;
        } else if (orientation === 1) {
          // Vertical
          startRow = Math.floor(Math.random() * (size - wordLength + 1));
          startCol = Math.floor(Math.random() * size);
          rowStep = 1;
          colStep = 0;
        } else if (orientation === 2) {
          // Diagonal up
          startRow = Math.floor(Math.random() * (size - wordLength + 1) + wordLength - 1);
          startCol = Math.floor(Math.random() * (size - wordLength + 1));
          rowStep = -1;
          colStep = 1;
        } else {
          // Diagonal down
          startRow = Math.floor(Math.random() * (size - wordLength + 1));
          startCol = Math.floor(Math.random() * (size - wordLength + 1));
          rowStep = 1;
          colStep = 1;
        }

        let validLocation = true;

        // Check if the word fits in the grid at the chosen location and orientation
        for (let i = 0; i < wordLength; i++) {
          const row = startRow + i * rowStep;
          const col = startCol + i * colStep;

          if (grid[row][col] !== null && grid[row][col] !== word[i]) {
            validLocation = false;
            break;
          }
        }

        // If the word fits, insert it into the grid and exit the loop
        if (validLocation) {
          for (let i = 0; i < wordLength; i++) {
            const rowIndex = startRow + i * rowStep;
            const colIndex = startCol + i * colStep;
            const letter = word[i].toUpperCase()
            grid[rowIndex][colIndex] = letter
            highlightedItems.push(JSON.stringify({ rowIndex, colIndex, letter }))
          }
          break;
        }
        iterations++;
      }
    }

    // fill the empty spaces with random letters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] == null) {
          grid[i][j] = letters[Math.floor(Math.random() * letters.length)]
        }
      }
    }

    setHighlighted(highlightedItems)
    setGrid(grid)
  }


  function downloadData(format) {
    let data;
    let contentType;
    let fileExtension;
    if (format === "text") {
      const wordsearchString = grid.map(row => row.join(" ")).join("\n");
      const textFileString = `${wordsearchString}\n\n${words.join("\n")}`;
      data = textFileString;
      contentType = "text/plain;charset=utf-8";
      fileExtension = ".txt";
    } else if (format === "json") {
      data = { grid, words };
      data = JSON.stringify(data, null, 2);
      contentType = "application/json";
      fileExtension = ".json";
    } else {
      console.error(`Invalid format specified: ${format}`);
      return;
    }

    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now
      .getDate()
      .toString()
      .padStart(2, "0")}-${now
        .getHours()
        .toString()
        .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
          .getSeconds()
          .toString()
          .padStart(2, "0")}`;
    const filename = `WordSearch-${timestamp}${fileExtension}`;

    const blob = new Blob([data], { type: contentType });
    const link = document.createElement("a");

    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = [contentType, link.download, link.href].join(":");

    const evt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });

    try {
      link.dispatchEvent(evt);
    } catch (err) {
      console.error(`Error while downloading ${format} file:`, err);
    }
  }


  // generate the word search grid when the component mounts or the props change
  useEffect(() => {
    generateGrid(size, words, charset === 'balochi' ? charsets.balochi : charsets.english);
  }, [size, words, charset]);

  // render the word search grid
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        {grid.map((row, rowIndex) => (
          // Container for each row in the grid
          <div key={rowIndex} className="w-screen flex flex-row items-center justify-center">
            {row.map((letter, colIndex) => (
              // Container for each cell in the grid
              <div key={colIndex} className={`h-8 w-8 text-center text-black ${highlight ? highlighted.includes(JSON.stringify({ rowIndex, colIndex, letter })) ? 'bg-blue-600' : 'bg-white' : 'bg-white'}`}>
                {letter.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {words.map((word, index) => (
          <div key={index}>{word.toUpperCase()}</div>
        ))}
      </div>
      <div className="flex gap-3">
        <Button className="flex items-center mt-3" onClick={() => downloadData("text")}>
          <MdDownload className="h-5 w-5" />
          Download TEXT
        </Button>
        <Button className="flex items-center mt-3" onClick={() => downloadData("json")}>
          <MdDownload className="h-5 w-5" />
          Download JSON
        </Button>
      </div>
    </div>
  )
};

export default WordSearch;