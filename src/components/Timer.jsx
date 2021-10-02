import React,{ useEffect, useState }  from 'react'

function Timer(props) {

    const calculateTimeLeft = () => {
        const countdownDate= sessionStorage.getItem("submitTime");
        const difference = countdownDate - +new Date();
        let timeLeft = {};
    
        if (difference > 0) {
          timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
        }
    
        return timeLeft;
      };

      const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    
      useEffect(() => {
        setTimeout(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
      });

      useEffect(()=>{
        if(!timeLeft.minutes && !timeLeft.seconds){
          props.func();
        }
      }, [timeLeft, props])

    return (
        <div className="Timer d-flex justify-content-center">
        <div style={{'fontWeight':'bold'}}>
          <p className="p-0 m-0 text-center" style={{ 'color':timeLeft.minutes?'#000':'#EF2E2E'}}>
            {timeLeft.minutes?(timeLeft.minutes<=9?"0"+timeLeft.minutes:timeLeft.minutes):"00"}
            : 
            {timeLeft.seconds?(timeLeft.seconds<=9?"0"+timeLeft.seconds:timeLeft.seconds):"00"}
          </p>        
        </div>
        </div>
    )
}

export default Timer;
