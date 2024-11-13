import React, { useEffect, useState, useRef } from 'react';
import '../App.css';

const Grid = ({ rows, cols }) => {
  const [grid, setGrid] = useState([]);
  const dropsRef = useRef([]);
  const [currentColor, setCurrentColor] = useState('red');
  const [colorChangeInterval, setColorChangeInterval] = useState(2000);
  const [colorChangeCount, setColorChangeCount] = useState(0);

  useEffect(() => {
    const createGrid = () => {
      let newGrid = [];
      for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
          row.push({ color: 'black' });
        }
        newGrid.push(row);
      }
      setGrid(newGrid);
    };

    createGrid();
  }, [rows, cols]);

  useEffect(() => {
    const dropRain = () => {
      setGrid(prevGrid => {
        let newGrid = prevGrid.map(row => row.map(cell => ({ ...cell, color: 'black' })));

        for (let i = dropsRef.current.length - 1; i >= 0; i--) {
          const drop = dropsRef.current[i];
          if (drop.row < rows - 1) {
            newGrid[drop.row][drop.col].color = 'black';
            drop.row++;
            newGrid[drop.row][drop.col].color = drop.color;
          } else {
            dropsRef.current.splice(i, 1);
          }
        }

        if (dropsRef.current.every(drop => drop.row > 0) || dropsRef.current.length === 0) {
          const randomCol = Math.floor(Math.random() * cols);
          for (let i = 0; i < 6; i++) {
            const colorDensity = (i / 6);
            const dropColor = `rgba(${Math.floor(colorDensity * 255)}, ${Math.floor(colorDensity * 255)}, ${Math.floor(colorDensity * 255)}, ${colorDensity})`;
            newGrid[i][randomCol].color = dropColor;
            dropsRef.current.push({ row: i, col: randomCol, color: dropColor });
          }
        }

        return newGrid;
      });
    };

    const interval = setInterval(dropRain, 200);
    return () => clearInterval(interval);
  }, [rows, cols, currentColor]);

  useEffect(() => {
    const changeColorInterval = setInterval(() => {
      const newColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
      setCurrentColor(newColor);
      setColorChangeCount(colorChangeCount + 1);
    }, colorChangeInterval);

    return () => clearInterval(changeColorInterval);
  }, [colorChangeInterval]);

  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <div key={colIndex} className="cell" style={{ backgroundColor: cell.color }}></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
