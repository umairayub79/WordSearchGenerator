import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react"
import { MdDownload } from "react-icons/md"
import charsets from "../../constants/Charsets.js"

const WordSearch = ({ words, size, charset, highlight, title }) => {

  const [highlighted, setHighlighted] = useState([]); // state to store found words
  const [grid, setGrid] = useState([]); // state to store the word search grid
  const [sizeError, setSizeError] = useState(false); // state to store the word search grid
  const [errorMessage, setErrorMessage] = useState("")
  // function to generate a word search grid
  function generateGrid(size, words, letters) {
    const grid = Array.from(Array(size), () => new Array(size).fill(null));
    const highlightedItems = []

    // Insert each word into the grid at a random location and orientation
    for (const word of words) {
      const wordLength = word.length;
      const maxIterations = 1000;
      let iterations = 0;
      if (wordLength > size) {
        setErrorMessage(`Word length must not exceed ${size} characters. Word: ${word}`)
        setSizeError(true)
        return;
      } else {
        setErrorMessage("")
        setSizeError(false)
      }
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

  const getTimeStamp = () => {
    const now = new Date();
    return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now
      .getDate()
      .toString()
      .padStart(2, "0")}-${now
        .getHours()
        .toString()
        .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
          .getSeconds()
          .toString()
          .padStart(2, "0")}`;
  }

  function downloadData(format) {
    let data;
    let contentType;
    let fileExtension;
    if (format === "text") {
      const wordsearchString = grid.map(row => row.join(" ")).join("\n");
      const textFileString = `${title}\n\n${wordsearchString}\n\n${words.join("\n")}`;
      data = textFileString;
      contentType = "text/plain;charset=utf-8";
      fileExtension = ".txt";
    } else if (format === "json") {
      data = { title, grid, words };
      data = JSON.stringify(data, null, 2);
      contentType = "application/json";
      fileExtension = ".json";
    } else {
      console.error(`Invalid format specified: ${format}`);
      return;
    }

    const filename = `WordSearch-${title != "" ? title : getTimeStamp()}${fileExtension}`;

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

  function downloadImage() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let cellWidth, cellHeight, cellTextSize = 0
    switch (size) {
      case 10:
        // code
        cellWidth = 80
        cellHeight = 80
        break;
      case 12:
        cellWidth = 65
        cellHeight = 65
        break;
      case 15:
        cellWidth = 55
        cellHeight = 55
        break;
      case 18:
        cellWidth = 50
        cellHeight = 50
        break;
      case 20:
        cellWidth = 45
        cellHeight = 45
        break;
      case 25:
        cellWidth = 37
        cellHeight = 37
        break;

      default:
        // code
        cellWidth = 6
        cellHeight = 6
    }


    const gridWidth = cellWidth * size;
    const gridHeight = cellHeight * size;
    canvas.width = 1180;
    canvas.height = 1080;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // calculate starting point for grid to center it horizontally
    const gridStartX = 40;
    const gridStartY = 100;
    console.log(gridHeight, gridWidth, canvas.width, canvas.height, gridStartX)
    // draw the grid
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        ctx.fillStyle = "black";
        ctx.strokeRect(
          gridStartX + col * cellWidth,
          gridStartY + row * cellHeight,
          cellWidth,
          cellHeight
        );
        ctx.font = "32px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          grid[row][col],
          gridStartX + col * cellWidth + cellWidth / 2,
          gridStartY + row * cellHeight + cellHeight / 2
        );
      }
    }

    // draw the words below the grid in a table
    ctx.fillStyle = "black";
    ctx.font = "bold 34px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, 120, 60)

    const tableTop = 150;
    const tableLeft = canvas.width - 120;
    const rowHeight = 30;

    ctx.font = "bold 22px sans-serif";
    for (let i = 0; i < words.length; i++) {
      const y = tableTop + (i + 1) * rowHeight;
      ctx.fillText(words[i], tableLeft + 10, y - rowHeight / 2);
    }

    // download the image
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `wordsearch-${title != "" ? title : getTimeStamp()}.png`;
    link.href = dataURL;
    link.click();
  }

  // generate the word search grid when the component mounts or the props change
  useEffect(() => {
    generateGrid(size, words, charset === 'Balochi' ? charsets.balochi : charsets.english);
  }, [size, words, charset]);

  // render the word search grid
  return (
    <div className="w-full max-w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center max-w-full">
        {
          sizeError ? (<p className="text-red-500">{errorMessage}</p>) : (
            grid.map((row, rowIndex) => (
              // Container for each row in the grid
              <div key={rowIndex} className="flex flex-row items-center justify-center max-w-full">
                {row.map((letter, colIndex) => (
                  // Container for each cell in the grid
                  <div
                    key={colIndex}
                    className={`h-6 w-6 border text-center text-black ${highlight
                      ? highlighted.includes(
                        JSON.stringify({ rowIndex, colIndex, letter })
                      )
                        ? 'bg-blue-600'
                        : 'bg-white'
                      : 'bg-white'
                      }`}
                  >
                    {letter.toUpperCase()}
                  </div>
                ))}
              </div>
            ))
          )
        }
      </div>
      <div className="flex flex-wrap gap-3 mt-3">
        {words.map((word, index) => (
          <div key={index}>{word.toUpperCase()}</div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-3 mt-3">
        <Button className="flex items-center mt-3" onClick={() => downloadData("text")}>
          <MdDownload className="h-5 w-5" />
          Download TEXT
        </Button>
        <Button className="flex items-center mt-3" onClick={() => downloadData("json")}>
          <MdDownload className="h-5 w-5" />
          Download JSON
        </Button>
        <Button className="flex items-center mt-3" onClick={() => downloadImage()}>
          <MdDownload className="h-5 w-5" />
          Download IMAGE
        </Button>
      </div>
    </div>
  )
};

export default WordSearch;