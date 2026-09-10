import { useState, useEffect } from 'react';

const useMeetingSchedules = () => {
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    setTimeout(() => {
      setMeetings([
        { id: 1, title: 'Parent-Teacher Meeting', time: '10:00 AM', status: 'scheduled', attendees: 5 },
        { id: 2, title: 'Staff Discussion', time: '02:00 PM', status: 'completed', attendees: 8 },
        { id: 3, title: 'Department Meeting', time: '04:00 PM', status: 'pending', attendees: 12 },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return { meetings, selectedDate, setSelectedDate, loading };
};

export default useMeetingSchedules;
