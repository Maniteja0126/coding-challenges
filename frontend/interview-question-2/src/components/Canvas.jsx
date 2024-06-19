
import { useState } from 'react';
import { COLORS } from '../utils'
import { Circles } from './Circles';
import Controls from './Controls';

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    return COLORS[randomIndex];
}
const Canvas = () => {
    const [circles, setCircles] = useState([]);
    const [history, setHistory] = useState([]);

    const handleClick = (e) => {
        setCircles((prev) => [
            ...prev,
            {
                x: e.clientX,
                y: e.clientY,
                id: +new Date(),
                bgColor: getRandomColor()
            }
        ]);
    };

    const handleUndo = () => {
        // remove the last added circle
        const copy = [...circles]   // ['circle 1' , 'circle 2' , 'circle 3']
        const lastCircle = copy.pop();  // ['circle 3']
        setHistory(prev => [...prev, lastCircle])  //['circle 1' ,'circle 2']
        setCircles(copy);
    }

    const handleRedo = () => {
        const copy = [...history];
        const lastHistory = copy.pop();

        setCircles(prev => [...prev, lastHistory]);
        setHistory(copy)
    }

    const handleReset = () => {
        setCircles([])
        setHistory([])
    }

    return (
        <div
            className='board'
            onClick={handleClick}
        >
            <Controls
                onUndo={handleUndo}
                onRedo={handleRedo}
                onReset={handleReset}
                hasCircle={circles.length > 0}
                hasHistory={history.length > 0}
            />
            <Circles circles={circles} />
        </div>
    )
}

export default Canvas