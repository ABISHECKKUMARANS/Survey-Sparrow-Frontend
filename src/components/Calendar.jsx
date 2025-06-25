import React, { useState } from "react";
import dayjs from "dayjs";
import Grid from "./Grid";
import eventsData from "../data/events.json";
import "./Calendar.css";
import Title from "./Title";
import { MdHome, MdCalendarToday, MdSettings, MdPerson, MdAdd } from "react-icons/md";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getMonthMatrix(year, month) {
  const firstDay = dayjs(`${year}-${month + 1}-01`);
  const startDay = firstDay.day();
  const daysInMonth = firstDay.daysInMonth();
  let matrix = [];
  let day = 1 - startDay;
  for (let i = 0; i < 5; i++) {
    let week = [];
    for (let j = 0; j < 7; j++, day++) {
      if (day < 1) {
        week.push({
          date: firstDay.subtract(startDay - j, "day"),
          current: false,
        });
      } else if (day > daysInMonth) {
        week.push({ date: firstDay.add(day - 1, "day"), current: false });
      } else {
        week.push({
          date: dayjs(`${year}-${month + 1}-${day}`),
          current: true,
        });
      }
    }
    matrix.push(week);
  }
  return matrix;
}

function getDecadeStart(year) {
  return Math.floor(year / 10) * 10;
}

function Calendar() {
  const today = dayjs();
  const [month, setMonth] = useState(today.month());
  const [year, setYear] = useState(today.year());
  const [yearInput, setYearInput] = useState(today.year());
  const [decadeStart, setDecadeStart] = useState(getDecadeStart(today.year()));
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: today.format("YYYY-MM-DD"),
    startTime: "",
    endTime: "",
  });
  const [viewMode, setViewMode] = useState("month"); // "month" or "year"
  // Use local state for events so new events can be added
  const [events, setEvents] = useState(eventsData);

  const monthMatrix = getMonthMatrix(year, month);

  // Filter events based on selectedDate
  const filteredEvents = selectedDate
    ? events.filter(
        (event) => event.date === dayjs(selectedDate).format("YYYY-MM-DD")
      )
    : events;

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
      setYearInput(year - 1);
      if (year - 1 < decadeStart) setDecadeStart(decadeStart - 10);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
      setYearInput(year + 1);
      if (year + 1 > decadeStart + 9) setDecadeStart(decadeStart + 10);
    } else {
      setMonth(month + 1);
    }
  };

  const handleMonthInput = (e) => {
    const idx = months.indexOf(e.target.value);
    if (idx !== -1) setMonth(idx);
  };

  const handleYearInput = (e) => {
    const val = e.target.value.replace(/\D/, "");
    setYearInput(val);
    if (val.length === 4) {
      setYear(Number(val));
      if (Number(val) < decadeStart || Number(val) > decadeStart + 9) {
        setDecadeStart(getDecadeStart(Number(val)));
      }
    }
  };

  const handleDecadePrev = () => setDecadeStart(decadeStart - 10);
  const handleDecadeNext = () => setDecadeStart(decadeStart + 10);

  const handleDateClick = (date) => {
    if (selectedDate && dayjs(selectedDate).isSame(date, "day")) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  const years = [];
  for (let y = 2000; y <= 2100; y++) years.push(y);

  // Add Event Popup Handlers
  const handleAddEventClick = () => {
    setShowAddPopup(true);
    setNewEvent({
      title: "",
      date: selectedDate
        ? dayjs(selectedDate).format("YYYY-MM-DD")
        : today.format("YYYY-MM-DD"),
      startTime: "",
      endTime: "",
    });
  };

  const handlePopupChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handlePopupClose = () => {
    setShowAddPopup(false);
  };

  const handlePopupSubmit = (e) => {
    e.preventDefault();
    setEvents([
      ...events,
      {
        title: newEvent.title || "New Event",
        date: newEvent.date,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        color: "#43a047"
      }
    ]);
    setShowAddPopup(false);
    setNewEvent({
      title: "",
      date: today.format("YYYY-MM-DD"),
      startTime: "",
      endTime: "",
    });
  };

  const handleViewModeChange = () => {
    setViewMode(viewMode === "month" ? "year" : "month");
  };

  return (
    <div className="calendar-main-layout">
      <nav className="left-nav">
        <div className="nav-bottom">
          <button className="nav-btn active">
            <MdHome size={28} />
          </button>
          <button className="nav-btn">
            <MdCalendarToday size={28} />
          </button>
          <button className="nav-btn">
            <MdSettings size={28} />
          </button>
          <div className="profile-icon">
            <MdPerson size={24} />
          </div>
        </div>
      </nav>
      <div className="sidebar">
        <div className="sidebar-title">Events</div>
        {filteredEvents.length === 0 && <div>No events</div>}
        {filteredEvents.map((event, idx) => (
          <div className="sidebar-event" key={idx}>
            <div className="sidebar-event-title">{event.title}</div>
            <div className="sidebar-event-time">
              {dayjs(event.date).format("MMMM D, YYYY")}
              <br />
              {event.startTime} - {event.endTime}
            </div>
          </div>
        ))}
        <button className="add-event-btn" title="Add Event" onClick={handleAddEventClick}>
          <MdAdd size={22} style={{ verticalAlign: "middle" }} /> Add Event
        </button>
      </div>
      <div className="calendar-container">
        <Title />
        <div className="calendar-header">
          <div className="calendar-header-bar">
            <button onClick={handlePrev}>&lt;</button>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="calendar-select"
              disabled={viewMode === "year"}
            >
              {months.map((m, idx) => (
                <option value={idx} key={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => {
                setYear(Number(e.target.value));
                setYearInput(Number(e.target.value));
              }}
              className="calendar-select"
            >
              {years.map((y) => (
                <option value={y} key={y}>
                  {y}
                </option>
              ))}
            </select>
            <button onClick={handleNext}>&gt;</button>
            <button
              className="toggle-view-btn"
              onClick={() => setViewMode(viewMode === "month" ? "year" : "month")}
            >
              {viewMode === "month" ? "Year View" : "Month View"}
            </button>
          </div>
        </div>
        {viewMode === "year" ? (
          <div className="year-view">
            {months.map((m, idx) => (
              <div className="mini-month" key={m}>
                <div className="mini-month-title">{m}</div>
                <div className="mini-month-grid">
                  {weekdays.map((d) => (
                    <div key={d} className="mini-day-header">{d[0]}</div>
                  ))}
                  {getMonthMatrix(year, idx).flat().map((cell, i) => (
                    <div
                      key={i}
                      className={`mini-day-cell${cell.current ? "" : " mini-day-inactive"}`}
                    >
                      {cell.date.date()}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="calendar-grid">
            {weekdays.map((d) => (
              <div key={d} className="calendar-day-header">
                {d}
              </div>
            ))}
            <Grid
              monthMatrix={monthMatrix}
              today={today}
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
            />
          </div>
        )}
      </div>
      {showAddPopup && (
        <div className="add-event-popup-overlay">
          <div className="add-event-popup">
            <h3>Add Event</h3>
            <form onSubmit={handlePopupSubmit}>
              <label>
                Event Name:
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handlePopupChange}
                  required
                  placeholder="Enter event name"
                />
              </label>
              <label>
                Date:
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handlePopupChange}
                  required
                />
              </label>
              <label>
                Start Time:
                <input
                  type="time"
                  name="startTime"
                  value={newEvent.startTime}
                  onChange={handlePopupChange}
                  required
                />
              </label>
              <label>
                End Time:
                <input
                  type="time"
                  name="endTime"
                  value={newEvent.endTime}
                  onChange={handlePopupChange}
                  required
                />
              </label>
              <div className="popup-actions">
                <button type="submit" className="add-event-btn" style={{margin: 0}}>Add</button>
                <button type="button" className="add-event-btn" style={{background: "#aaa", margin: 0}} onClick={handlePopupClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;