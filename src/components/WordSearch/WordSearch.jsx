import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react"
import { MdDownload } from "react-icons/md"
import charsets from "../../constants/Charsets.js"
const WordSearch = ({ words, size, charset, highlight }) => {

  const [highlighted, setHighlighted] = useState([]); // state to store found words
  const [grid, setGrid] = useState([]); // state to store the word search grid

  // function to generate a word search grid
  function generateGrid(size, words, letters) {
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
          items.push({ "row": y + i * dy, "col": x + i * dx, "letter": word[i].toUpperCase() })

        }
      });
      setHighlighted(JSON.stringify(items))
    }

    // update the state with the new grid
    setGrid(grid);
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
    // Main container for the grid
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        {grid.map((row, rowIndex) => (
          // Container for each row in the grid
          <div key={rowIndex} className="w-screen flex flex-row items-center justify-center">
            {row.map((item, colIndex) => (
              // Container for each cell in the grid
              <div key={colIndex} className={`h-8 w-8 text-center text-black ${highlight ? highlighted.includes(JSON.stringify({ "row": rowIndex, "col": colIndex, "letter": item })) ? 'bg-blue-600' : 'bg-white' : 'bg-white'}`}>
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