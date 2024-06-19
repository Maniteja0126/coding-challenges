/* eslint-disable react/prop-types */


const Controls = ({ onUndo, onRedo, onReset, hasCircle, hasHistory }) => {
    return (
        <div className="controls"
            onClick={(e) => {
                e.stopPropagation()
            }}
        >
            <button
                disabled={!hasCircle}
                className={hasCircle ? '' : "disabled"}
                onClick={onUndo}
            >Undo</button>
            <button
                disabled={!hasHistory}
                className={hasHistory ? '' : 'disabled'}
                onClick={onRedo}
            >Redo</button>
            <button onClick={onReset}>Reset</button>
        </div>
    )
}

export default Controls