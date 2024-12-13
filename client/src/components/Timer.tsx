/**
 * Timer Component
 *
 * A countdown timer that calculates and displays the remaining time until a specified target date.
 * The timer dynamically updates every second, providing real-time feedback to the user.
 *
 * ============================
 * **Core Features**
 * ============================
 * 1. **Dynamic Countdown**:
 *    - Calculates and displays the time remaining until the `targetDate`.
 *    - Breaks down the remaining time into days, hours, minutes, and seconds.
 *
 * 2. **Real-Time Updates**:
 *    - Uses `setInterval` to update the countdown every second.
 *    - Automatically stops updating when the countdown reaches zero.
 *
 * 3. **Responsive Design**:
 *    - Displays the time units in a visually appealing grid layout.
 *    - Each unit (days, hours, minutes, seconds) is styled as a card with dynamic data.
 *
 * ============================
 * **Implementation Details**
 * ============================
 * - **State Management**:
 *   - `timeLeft`: Stores the remaining days, hours, minutes, and seconds.
 *
 * - **Lifecycle Management**:
 *   - The `useEffect` hook starts the countdown when the component mounts and clears the interval when the component unmounts.
 *
 * - **Time Calculation**:
 *   - Calculates the difference between the current time (`now`) and the `targetDate`.
 *   - Derives days, hours, minutes, and seconds from the difference.
 *   - Stops the timer when the difference reaches or goes below zero.
 *
 * ============================
 * **Component Props**
 * ============================
 * - `targetDate` (string): The target date in ISO format (`"YYYY-MM-DDTHH:mm:ss"`).
 *
 * ============================
 * **Design**
 * ============================
 * - Each time unit is displayed in a card with:
 *   - A large, bold number representing the remaining value.
 *   - A label for the unit (e.g., "DAYS", "HOURS").
 * - The component uses TailwindCSS for styling.
 *
 * ============================
 * **Example Usage**
 * ============================
 * ```tsx
 * import Timer from "./Timer";
 *
 * const App = () => {
 *   return (
 *     <div className="flex justify-center items-center min-h-screen bg-gray-900">
 *       <Timer targetDate="2024-12-31T23:59:59" />
 *     </div>
 *   );
 * };
 *
 * export default App;
 * ```
 *
 * ============================
 * **Future Enhancements**
 * ============================
 * - Add support for displaying a custom message when the countdown ends.
 * - Allow customization of the timer's appearance via props.
 * - Integrate sound or visual alerts when the countdown reaches zero.
 */

import React, { useState, useEffect } from "react";

interface TimerProps {
  targetDate: string; // The target date in the format "YYYY-MM-DDTHH:mm:ss"
}

const Timer: React.FC<TimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div
          key={unit}
          className="flex flex-col items-center bg-gray-800 rounded-lg p-4 shadow-lg"
        >
          <span className="text-4xl font-bold text-secondary">{value}</span>
          <span className="text-sm text-gray-400">{unit.toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
};

export default Timer;
