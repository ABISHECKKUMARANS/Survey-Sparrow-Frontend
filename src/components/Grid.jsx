import dayjs from "dayjs";
import eventsData from "../data/events.json";;
import "./Grid.css";
import "./Calendar.css";
function getEventsForDate(date) {
  return eventsData.filter(
    (event) => dayjs(event.date).isSame(date, "day")
  );
}

export default function Grid({ monthMatrix, today, selectedDate, onDateClick }) {
  return (
    <>
      {monthMatrix.flat().map(({ date, current }, idx) => {
        const isToday = date.isSame(today, "day");
        const isSelected = selectedDate && date.isSame(selectedDate, "day");
        const events = getEventsForDate(date);
        return (
          <div
            key={idx}
            className={
              "calendar-cell" +
              (current ? "" : " calendar-cell--inactive") +
              (isToday ? " calendar-cell--today" : "") +
              (isSelected ? " selected" : "")
            }
            onClick={() => onDateClick(date)}
          >
            <div className="calendar-date">{date.date()}</div>
            <div className="calendar-events">
              {events.map((event, i) => (
                <span
                  key={i}
                  className={
                    "calendar-event-dot" +
                    (i === 0 ? " orange" : i === 1 ? " yellow" : "")
                  }
                  title={event.title}
                ></span>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}