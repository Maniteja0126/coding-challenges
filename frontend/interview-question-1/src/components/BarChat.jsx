/* eslint-disable react/prop-types */
import { useMemo } from "react"
import { motion } from "framer-motion"


const Bar = ({
    name ,
    color,
    ticketCount,
    height
}) =>{
    return(
        <motion.div
            initial={{height : 0}}
            animate = {{ height : `${height}%`}}
            exit={{height : 0}}
            transition={{duration : 0.7}}
            className="bar"
            style={{
                backgroundColor : color,

            }}
        >
            <div className="tooltip">
                {name} - {ticketCount}
            </div>
        </motion.div>
    )
}

const BarChat = ({data}) => {
    const maxTicketCount  = useMemo(()=>{
        return Math.max(...data.map(item => item.ticketCount))
    },[])
  return (
    <motion.div 
        initial={{opacity : 0}}
        animate = {{ opacity : 1}}
        exit={{opacity : 0}}
        transition={{duration : 5}}
        className="chat-container"
        >
        <div className="chart">
            {
                data.map(item =>{
                    return <Bar 
                        key={item.id} 
                        {...item} 
                        height={(item.ticketCount / maxTicketCount) * 100}
                    />
                })
            }
        </div>
        <div className="y-axis-label">Number of tickets</div>
        <div className="x-axis-label">Departments</div>
    </motion.div>
  )
}

export default BarChat