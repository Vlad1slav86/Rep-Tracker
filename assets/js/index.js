// Get the containers for the app and the past challenges
const appContainer = document.getElementById("app");
const pastChallengesContainer = document.getElementById("past-challenges");

// Define the exercise and rep goal
let exercise = "";
let repGoal = 0;

// Define the state of the app
let reps = Array(31).fill(0); // Array to store reps for each day of the month
let totalReps = 0; // Total number of reps for the month

// Define the list of past challenges
let pastChallenges = [];

// Load data from local storage
function loadFromLocalStorage() {
  const storedExercise = localStorage.getItem("exercise");
  const storedRepGoal = localStorage.getItem("repGoal");
  const storedReps = localStorage.getItem("reps");
  const storedTotalReps = localStorage.getItem("totalReps");
  const storedPastChallenges = localStorage.getItem("pastChallenges");

  if (storedExercise) exercise = storedExercise;
  if (storedRepGoal) repGoal = parseInt(storedRepGoal);
  if (storedReps) reps = JSON.parse(storedReps);
  if (storedTotalReps) totalReps = parseInt(storedTotalReps);
  if (storedPastChallenges) pastChallenges = JSON.parse(storedPastChallenges);
}

// Save data to local storage
function saveToLocalStorage() {
  localStorage.setItem("exercise", exercise);
  localStorage.setItem("repGoal", repGoal.toString());
  localStorage.setItem("reps", JSON.stringify(reps));
  localStorage.setItem("totalReps", totalReps.toString());
  localStorage.setItem("pastChallenges", JSON.stringify(pastChallenges));
}

// Create the app UI

// Create the app UI
function render() {
    // Get the current month and year
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
  
    // Get the number of days in the current month
    const numberOfDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  
    // Create a Date object for the first day of the current month
    const firstDay = new Date(currentYear, currentMonth, 1);
  
    // Determine the index of the first day in the week (0 = Sunday, 1 = Monday, ...)
    const firstDayIndex = firstDay.getDay();
  
    // Define an array of day names
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
    // Define the app HTML structure
    const appHtml = `
      <h2>${currentMonth + 1}/${currentYear}</h2>
      <table>
        <thead>
          <tr>
            ${daysOfWeek.map((day) => `<th>${day}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${generateCalendarRows(numberOfDays, firstDayIndex)}
        </tbody>
      </table>
      <div class="total">Total reps: ${totalReps}</div>
      <button onclick="saveToPastChallenges()">Save to Past Challenges</button>
      <button onclick="refreshCurrentChallenge()">Refresh Challenge</button>
    `;
  
    // Render the app UI
    appContainer.innerHTML = appHtml;
  
    // Render the past challenges
    renderPastChallenges();
  }
  
  // Generate the calendar rows
  function generateCalendarRows(numberOfDays, firstDayIndex) {
    let calendarHtml = "";
  
    // Calculate the number of rows needed to display the calendar
    const numRows = Math.ceil((numberOfDays + firstDayIndex) / 7);
  
    // Loop through each row
    for (let row = 0; row < numRows; row++) {
      calendarHtml += "<tr>";
  
      // Loop through each day in the row
      for (let day = 0; day < 7; day++) {
        const dayIndex = row * 7 + day;
        const dayNumber = dayIndex - firstDayIndex + 1;
  
        // Check if the day is within the current month
        if (dayIndex >= firstDayIndex && dayNumber <= numberOfDays) {
          calendarHtml += `
            <td>
              <div class="calendar-day">${dayNumber}</div>
              <input type="number" value="${reps[dayNumber - 1]}" onchange="updateRep(${dayNumber - 1}, this.value)" placeholder="Enter reps">
            </td>
          `;
        } else {
          calendarHtml += "<td></td>"; // Empty cell for days outside the current month
        }
      }
  
      calendarHtml += "</tr>";
    }
  
    return calendarHtml;
  }

// Update the rep count for a specific day
function updateRep(dayIndex, newRep) {
  const oldRep = reps[dayIndex];
  reps[dayIndex] = Number(newRep);
  totalReps += Number(newRep) - oldRep;
  saveToLocalStorage();
  render();
}

// Save the current challenge to the list of past challenges
function saveToPastChallenges() {
  const pastChallenge = {
    exercise,
    repGoal,
    reps,
    totalReps,
    date: new Date().toISOString(),
  };
  pastChallenges.push(pastChallenge);
  saveToLocalStorage();
  renderPastChallenges();
}

// Render the past challenges
function renderPastChallenges() {
    // Clear the past challenges container
    pastChallengesContainer.innerHTML = "";
  
    // Iterate over each past challenge and render it
    pastChallenges.forEach((pastChallenge, index) => {
      const { exercise, repGoal, reps, totalReps, date } = pastChallenge;
  
      // Create a container for the past challenge
      const challengeContainer = document.createElement("div");
      challengeContainer.classList.add("past-challenge");
  
      // Create a heading for the past challenge
      const heading = document.createElement("h3");
      heading.textContent = `Challenge ${index + 1} - ${exercise} (${repGoal} reps)`;
  
      // Create a paragraph for the total reps and date
      const infoParagraph = document.createElement("p");
      infoParagraph.innerHTML = `Total reps: ${totalReps}<br>Date: ${date}`;
  
      // Create a button to view the reps of the past challenge
      const viewButton = document.createElement("button");
      viewButton.textContent = "View Reps";
      viewButton.addEventListener("click", () => {
        viewPastChallengeReps(reps);
      });
  
      // Append the elements to the past challenge container
      challengeContainer.appendChild(heading);
      challengeContainer.appendChild(infoParagraph);
      challengeContainer.appendChild(viewButton);
  
      // Append the past challenge container to the past challenges container
      pastChallengesContainer.appendChild(challengeContainer);
    });
  }
  
  // View the reps of a past challenge
  function viewPastChallengeReps(reps) {
    const repString = reps.join(", ");
    alert(`Reps: ${repString}`);
  }
  
// ...

// Delete a past challenge
function deletePastChallenge(index) {
    pastChallenges.splice(index, 1);
    saveToLocalStorage();
    renderPastChallenges();
  }
  
  // Refresh the current challenge
  function refreshCurrentChallenge() {
    reps = Array(31).fill(0);
    totalReps = 0;
    saveToLocalStorage();
    render();
  }
  
  // ...
  
  // Render the past challenges
  function renderPastChallenges() {
    // Clear the past challenges container
    pastChallengesContainer.innerHTML = "";
  
    // Iterate over each past challenge and render it
    pastChallenges.forEach((pastChallenge, index) => {
      const { exercise, repGoal, reps, totalReps, date } = pastChallenge;
  
      // Create a container for the past challenge
      const challengeContainer = document.createElement("div");
      challengeContainer.classList.add("past-challenge");
  
      // Create a heading for the past challenge
      const heading = document.createElement("h3");
      heading.textContent = `Challenge ${index + 1} - ${exercise} (${repGoal} reps)`;
  
      // Create a paragraph for the total reps and date
      const infoParagraph = document.createElement("p");
      infoParagraph.innerHTML = `Total reps: ${totalReps}<br>Date: ${date}`;
  
      // Create a button to view the reps of the past challenge
      const viewButton = document.createElement("button");
      viewButton.textContent = "View Reps";
      viewButton.addEventListener("click", () => {
        viewPastChallengeReps(reps);
      });
  
      // Create a button to delete the past challenge
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        deletePastChallenge(index);
      });
  
      // Append the elements to the past challenge container
      challengeContainer.appendChild(heading);
      challengeContainer.appendChild(infoParagraph);
      challengeContainer.appendChild(viewButton);
      challengeContainer.appendChild(deleteButton);
  
      // Append the past challenge container to the past challenges container
      pastChallengesContainer.appendChild(challengeContainer);
    });
  }
  
  // ...
  
  // Load data from local storage
  loadFromLocalStorage();
  
  // Render the app UI
  render();
  

  // Load data from local storage
  loadFromLocalStorage();
  
  // Render the app UI
  render();
  
