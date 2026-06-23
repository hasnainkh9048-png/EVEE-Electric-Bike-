let bikes = [];
let currentIndex = -1;

// Load existing data
window.onload = function () {
    loadData();
    updateDashboard();
    generateRecordId();
    setDateTime();
};

// Auto ID
function generateRecordId() {
    document.getElementById("recordId").value = "EVEE-" + Date.now();
}

// Date & Time
function setDateTime() {
    let now = new Date();

    document.getElementById("scanDate").value = now.toISOString().split("T")[0];
    document.getElementById("scanTime").value = now.toTimeString().split(" ")[0].slice(0,5);
}

// Save Record
document.getElementById("saveBtn").addEventListener("click", function () {

    let bike = getFormData();

    if (!bike) return;

    // Duplicate check
    let duplicate = bikes.find(b =>
        b.chassisNumber === bike.chassisNumber ||
        b.motorNumber === bike.motorNumber
    );

    if (duplicate) {
        alert("Duplicate Chassis or Motor Number found!");
        return;
    }

    bikes.push(bike);
    currentIndex = bikes.length - 1;

    saveData();
    updateDashboard();
    clearForm();
    generateRecordId();
    setDateTime();

    alert("Bike Saved Successfully!");
});

// Get form data
function getFormData() {

    let modelName = document.getElementById("modelName").value;
    let batteryType = document.getElementById("batteryType").value;
    let bikeType = document.getElementById("bikeType").value;
    let color = document.getElementById("color").value;
    let chassisNumber = document.getElementById("chassisNumber").value;
    let motorNumber = document.getElementById("motorNumber").value;

    if (!modelName || !bikeType || !chassisNumber || !motorNumber) {
        alert("Please fill required fields!");
        return null;
    }

    return {
        recordId: document.getElementById("recordId").value,
        date: document.getElementById("scanDate").value,
        time: document.getElementById("scanTime").value,
        modelName,
        batteryType,
        bikeType,
        color,
        chassisNumber,
        motorNumber
    };
}

// Save to localStorage
function saveData() {
    localStorage.setItem("bikes", JSON.stringify(bikes));
}

// Load from localStorage
function loadData() {
    let data = localStorage.getItem("bikes");
    if (data) {
        bikes = JSON.parse(data);
    }
}

// Clear form
document.getElementById("clearBtn").addEventListener("click", function () {
    clearForm();
    generateRecordId();
    setDateTime();
});

function clearForm() {
    document.getElementById("modelName").value = "";
    document.getElementById("batteryType").value = "";
    document.getElementById("bikeType").value = "";
    document.getElementById("color").value = "";
    document.getElementById("chassisNumber").value = "";
    document.getElementById("motorNumber").value = "";
}

// Navigation
document.getElementById("nextBtn").addEventListener("click", function () {
    if (currentIndex < bikes.length - 1) {
        currentIndex++;
        showData();
    }
});

document.getElementById("prevBtn").addEventListener("click", function () {
    if (currentIndex > 0) {
        currentIndex--;
        showData();
    }
});

document.getElementById("firstBtn").addEventListener("click", function () {
    if (bikes.length > 0) {
        currentIndex = 0;
        showData();
    }
});

document.getElementById("lastBtn").addEventListener("click", function () {
    if (bikes.length > 0) {
        currentIndex = bikes.length - 1;
        showData();
    }
});

// Show record
function showData() {
    let bike = bikes[currentIndex];

    document.getElementById("recordId").value = bike.recordId;
    document.getElementById("scanDate").value = bike.date;
    document.getElementById("scanTime").value = bike.time;
    document.getElementById("modelName").value = bike.modelName;
    document.getElementById("batteryType").value = bike.batteryType;
    document.getElementById("bikeType").value = bike.bikeType;
    document.getElementById("color").value = bike.color;
    document.getElementById("chassisNumber").value = bike.chassisNumber;
    document.getElementById("motorNumber").value = bike.motorNumber;

    updateDashboard();
}

// Delete
document.getElementById("deleteBtn").addEventListener("click", function () {

    if (currentIndex < 0) return;

    let confirmDelete = confirm("Are you sure you want to delete this record?");

    if (!confirmDelete) return;

    bikes.splice(currentIndex, 1);

    if (currentIndex >= bikes.length) {
        currentIndex = bikes.length - 1;
    }

    saveData();
    updateDashboard();
    clearForm();

    alert("Record Deleted!");
});

// Search
document.getElementById("searchBtn").addEventListener("click", function () {

    let query = document.getElementById("searchInput").value.toLowerCase();

    let index = bikes.findIndex(b =>
        b.chassisNumber.toLowerCase() === query ||
        b.motorNumber.toLowerCase() === query ||
        b.recordId.toLowerCase() === query
    );

    if (index !== -1) {
        currentIndex = index;
        showData();
    } else {
        alert("No record found!");
    }
});

// Dashboard update
function updateDashboard() {
    document.getElementById("totalBikes").innerText = bikes.length;

    let lithium = bikes.filter(b => b.bikeType === "Lithium").length;
    let graphene = bikes.filter(b => b.bikeType === "Graphene").length;

    document.getElementById("lithiumCount").innerText = lithium;
    document.getElementById("grapheneCount").innerText = graphene;

    if (currentIndex >= 0) {
        document.getElementById("recordPosition").innerText =
            (currentIndex + 1) + " / " + bikes.length;
    } else {
        document.getElementById("recordPosition").innerText = "0 / " + bikes.length;
    }
}
