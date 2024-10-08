
let currentEventIndex = null; // To track the index of the event being updated

const errorMessageEl = document.querySelector(".error-message");
const addBtn = document.querySelector(".add-btn");

// Set min date to make the events for future dates only
function setMinDate() {
    const today = new Date().toISOString().split("T")[0]; // Today's date
    const eventDate = document.querySelector(".event-date");
    eventDate.min = today; // Set min date to today

    eventDate.addEventListener("input", () => {
        if (eventDate.value < today) {
            errorMessageEl.innerHTML = "Please enter a date from today onwards.";
        } else {
            errorMessageEl.innerHTML = "";
        }
    });
}

  addBtn.addEventListener("click", function addEvent() {
    const eventNameInput = document.querySelector(".event-name").value.trim();
    const eventOrganizerInput = document.querySelector(".event-organizer").value.trim();
    const eventDateInput = document.querySelector(".event-date").value.trim();
    const eventCategoryInput = document.querySelector(".event-category").value.trim();
    // const eventLocationInput = document.querySelector(".event-location").value.trim();

    //make sure each input has a value
    // event.preventDefault();
    let isValid = true;
    if (!eventNameInput) {
        document.querySelector(".eventNameError").innerText = "Please Fill Out This Field.";
        document.querySelector(".event-name").style.borderColor = "red";
        isValid = false;
    }else {
        document.querySelector(".eventNameError").innerText = "";
        document.querySelector(".event-name").style.borderColor = "";
    }
    if (!eventOrganizerInput) {
        document.querySelector(".eventOrganizerError").innerText = "Please Fill Out This Field.";
        document.querySelector(".event-organizer").style.borderColor = "red";
        isValid = false;
    }else {
        document.querySelector(".eventOrganizerError").innerText = "";
        document.querySelector(".event-organizer").style.borderColor = "";
    }
    if (!eventDateInput) {
        document.querySelector(".eventDateError").innerText = "Please Fill Out This Field.";
        document.querySelector(".event-date").style.borderColor = "red";
        isValid = false;
    }else {
        document.querySelector(".eventDateError").innerText = "";
        document.querySelector(".event-date").style.borderColor = "";
    }
    
    if(!isValid) {
        return; // stop the validation if the isValid = false;
    }else {
        showSuccessAlert();
    }
    
    const eventTimeStamp = new Date(eventDateInput).getTime();

    const event = {
        name: eventNameInput,
        organizer: eventOrganizerInput,
        date: eventDateInput,
        time: eventTimeStamp,
        category:eventCategoryInput,
    };

    let events = JSON.parse(localStorage.getItem("events")) || [];

    if (currentEventIndex !== null) {
        // Update existing event
        events[currentEventIndex] = event;
        currentEventIndex = null;
        addBtn.innerHTML = "Add Event"; // Reset button text
    } else {
        // Add new event
        events.push(event);
    }

    localStorage.setItem("events", JSON.stringify(events));

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => (input.value = "")); // Clear inputs after adding/updating

    displayEvents();
});

function displayEvents() {
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const eventsList = document.querySelector(".events-list");
    eventsList.innerHTML = ""; // Clear previous events

    events.forEach((event, index) => {
        const now = new Date().getTime();
        const timeLeft = event.time - now;
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        const countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        eventsList.innerHTML += `
            <div class="event">
                <h3>${event.name}</h3>
                <p><strong>Organizer:</strong> ${event.organizer}</p>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Category:</strong> ${event.category}</p>
                <p><strong>Time left:</strong> ${countdown}</p>
                <div class="event-buttons">
                    <button class="update-btn" onclick="updateEvent(${index})"><i class="fa-solid fa-arrow-up-right-from-square"></i></button>
                    <button class="delete-btn" onclick="deleteEvent(${index})"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `;
    });
}

function updateEvent(index) {
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const event = events[index];

    // Pre-fill the input fields with the selected event details
    document.querySelector(".event-name").value = event.name;
    document.querySelector(".event-organizer").value = event.organizer;
    document.querySelector(".event-date").value = event.date;

    // Set the index of the event being updated
    currentEventIndex = index;
    addBtn.innerHTML = "Update Event"; // Change button text to "Update"

    scroll({ top: 0, behavior: "smooth" }); // Scroll to the top for updating
}

function deleteEvent(index) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.splice(index, 1); // Remove the selected event
    localStorage.setItem("events", JSON.stringify(events)); // Save the updated list
    displayEvents(); // Refresh the events list
}



function eventsLink() {
    
}

function deleteEvent(index) {
    const events = JSON.parse(localStorage.getItem("events"));
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    displayEvents();
};

function showSuccessAlert() {
    Swal.fire({
        title: 'Success!',
        text: 'Your action was successful.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
}

setInterval(displayEvents, 1000);
setMinDate();
addEvent();
