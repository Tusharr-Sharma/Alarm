// Initial references to HTML elements
let timerRef = document.querySelector(".timer-display"); // Reference to timer display element
const hourInput = document.getElementById("hourInput"); // Reference to hour input element
const minuteInput = document.getElementById("minuteInput"); // Reference to minute input element
const activeAlarms = document.querySelector(".activeAlarms"); // Reference to active alarms container
const setAlarm = document.getElementById("set"); // Reference to set alarm button

// Array to store alarms
let alarmsArray = [];

// Audio element for alarm sound
let alarmSound = new Audio("alarm.mp3"); // Initialize alarm sound

// Initial values
let initialHour = 0,
	initialMinute = 0,
	alarmIndex = 0;

// Function to append zeroes for single-digit numbers
const appendZero = (value) => (value < 10 ? "0" + value : value);

// Function to search for a value in objects
const searchObject = (parameter, value) => {
	let alarmObject,
		objIndex,
		exists = false;
	alarmsArray.forEach((alarm, index) => {
		if (alarm[parameter] == value) {
			exists = true;
			alarmObject = alarm;
			objIndex = index;
			return false;
		}
	});
	return [exists, alarmObject, objIndex];
};

// Function to display time
function displayTimer() {
	// Get current time
	let date = new Date();
	let [hours, minutes, seconds] = [
		appendZero(date.getHours()),
		appendZero(date.getMinutes()),
		appendZero(date.getSeconds()),
	];

	// Display current time
	timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;

	// Check if any alarms match the current time and checkbox is checked
	alarmsArray.forEach((alarm, index) => {
		if (alarm.isActive) {
			if (`${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`) {
				if (
					document.querySelector(
						`[data-id="${alarm.id}"] input[type="checkbox"]:checked`
					)
				) {
					alarmSound.play(); // Play alarm sound
					alarmSound.loop = true;
				}
			}
		}
	});
}

// Function to ensure leading zeroes in input fields
const inputCheck = (inputValue) => {
	inputValue = parseInt(inputValue);
	if (inputValue < 10) {
		inputValue = appendZero(inputValue);
	}
	return inputValue;
};

// Event listeners for input fields
hourInput.addEventListener("input", () => {
	hourInput.value = inputCheck(hourInput.value);
});

minuteInput.addEventListener("input", () => {
	minuteInput.value = inputCheck(minuteInput.value);
});

// Function to create alarm div
const createAlarm = (alarmObj) => {
	// Keys from alarm object
	const { id, alarmHour, alarmMinute } = alarmObj;

	// Alarm division
	let alarmDiv = document.createElement("div");
	alarmDiv.classList.add("alarm");
	alarmDiv.setAttribute("data-id", id);
	alarmDiv.innerHTML = `<span>${alarmHour}: ${alarmMinute}</span>`;

	// Checkbox
	let checkbox = document.createElement("input");
	checkbox.setAttribute("type", "checkbox");
	checkbox.addEventListener("click", (e) => {
		if (e.target.checked) {
			startAlarm(e);
		} else {
			stopAlarm(e);
		}
	});
	alarmDiv.appendChild(checkbox);

	// Delete button
	let deleteButton = document.createElement("button");
	deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
	deleteButton.classList.add("deleteButton");
	deleteButton.addEventListener("click", (e) => deleteAlarm(e));
	alarmDiv.appendChild(deleteButton);
	activeAlarms.appendChild(alarmDiv);
};

// Set Alarm
setAlarm.addEventListener("click", () => {
	alarmIndex += 1;

	// Alarm Object
	let alarmObj = {};
	alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}`;
	alarmObj.alarmHour = hourInput.value;
	alarmObj.alarmMinute = minuteInput.value;
	alarmObj.isActive = false;

	alarmsArray.push(alarmObj);
	createAlarm(alarmObj);
	hourInput.value = appendZero(initialHour);
	minuteInput.value = appendZero(initialMinute);
});

// Function to start alarm
const startAlarm = (e) => {
	let searchId = e.target.parentElement.getAttribute("data-id");
	let [exists, obj, index] = searchObject("id", searchId);
	if (exists) {
		alarmsArray[index].isActive = true;
	}
};

// Function to stop alarm
const stopAlarm = (e) => {
	let searchId = e.target.parentElement.getAttribute("data-id");
	let [exists, obj, index] = searchObject("id", searchId);
	if (exists) {
		alarmsArray[index].isActive = false;
		alarmSound.pause(); // Pause alarm sound
	}
};

// Function to delete alarm
const deleteAlarm = (e) => {
	let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
	let [exists, obj, index] = searchObject("id", searchId);
	if (exists) {
		e.target.parentElement.parentElement.remove();
		alarmsArray.splice(index, 1);
	}
};

// Run timer when the window loads
window.onload = () => {
	setInterval(displayTimer, 1000); // Update timer every second
	initialHour = 0;
	initialMinute = 0;
	alarmIndex = 0;
	alarmsArray = [];
	hourInput.value = appendZero(initialHour);
	minuteInput.value = appendZero(initialMinute);
};
