document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  const timeSelect = document.getElementById("time");
  const form = document.getElementById("appointmentForm");

  const weekdayHours = generateTimeSlots("19:30", "22:30", 15);
  const weekendHours = generateTimeSlots("14:00", "20:00", 15);

  function generateTimeSlots(start, end, stepMinutes) {
    const slots = [];
    let [h, m] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    while (h < eh || (h === eh && m <= em)) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      m += stepMinutes;
      if (m >= 60) {
        m -= 60;
        h += 1;
      }
    }
    return slots;
  }

  // Εμφάνιση διαθέσιμων ωρών με βάση την ημέρα
  dateInput.addEventListener("change", () => {
    const day = new Date(dateInput.value).getDay();
    const availableTimes = (day === 0 || day === 6) ? weekendHours : weekdayHours;

    timeSelect.innerHTML = '<option value="">Επέλεξε ώρα</option>';
    availableTimes.forEach(t => {
      const option = document.createElement("option");
      option.value = t;
      option.textContent = t;
      timeSelect.appendChild(option);
    });
  });

  // Όριο ελάχιστης ημερομηνίας
  dateInput.min = new Date().toISOString().split("T")[0];

  // Form υποβολή με fetch
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
      date: form.date.value,
      time: form.time.value
    };

    try {
      const res = await fetch("/send-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      alert(result.message || "Το ραντεβού καταχωρήθηκε!");
      form.reset();
      timeSelect.innerHTML = '<option value="">Επέλεξε ώρα</option>';
    } catch (err) {
      console.error("Error:", err);
      alert("Σφάλμα κατά την αποστολή.");
    }
  });
});
