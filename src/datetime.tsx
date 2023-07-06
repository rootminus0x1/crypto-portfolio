
import { useState, useEffect } from 'react';
import dateFormat from 'dateformat';

var defaultFormat = "dd-MMM-yyyy hh:mm:ss";

export function setDateFormat(newFormat: string) {
    const oldFormat = defaultFormat;
    defaultFormat = newFormat;
    return oldFormat;
}

export function format(date: Date) {
    return dateFormat(date, defaultFormat);
}

export function Clock () {
    const [time, setTime] = useState(new Date());
    
    useEffect(() => {
      const intervalID = setInterval(() => { setTime(new Date()) }, 1000);
      return () =>  { clearInterval(intervalID); };
    }, []);
  
    return (
      <div className="Clock">
        {format(time)}
      </div>
    );
  }
  