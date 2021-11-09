
import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

var defaultFormat = "dd-MMM-yyyy hh:mm:ss";

export function setDateFormat(newFormat) {
    const oldFormat = defaultFormat;
    defaultFormat = newFormat;
    return oldFormat;
}

export function format(date) {
    const dt = new DateTime(date);
    return dt.toFormat(defaultFormat);
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
  