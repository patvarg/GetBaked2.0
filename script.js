// Workshop Carousel
const workshopSlide = document.querySelector('.carousel .carousel-slide');
const workshopImages = document.querySelectorAll('.carousel .carousel-slide img');
let workshopCounter = 0;

function workshopAutoSlide() {
  workshopCounter = (workshopCounter + 1) % workshopImages.length;
  workshopSlide.style.transform = `translateX(${-workshopCounter * 100}%)`;
}

setInterval(workshopAutoSlide, 3000);

// Reviews Carousel
const reviewsSlide = document.querySelector('.reviews-carousel .carousel-slide');
const reviewImages = document.querySelectorAll('.reviews-carousel .carousel-slide img');
let reviewsCounter = 0;

function reviewsAutoSlide() {
  reviewsCounter = (reviewsCounter + 1) % reviewImages.length;
  reviewsSlide.style.transform = `translateX(${-reviewsCounter * 100}%)`;
}

setInterval(reviewsAutoSlide, 3000);

// WhatsApp Promo Pop-up (ALWAYS APPEARS ON REFRESH)
window.onload = function () {
  const existingPopup = document.getElementById("whatsapp-popup");
  if (existingPopup) existingPopup.remove(); // Remove any old popups (prevents duplicates)

  const popup = document.createElement('div');
  popup.innerHTML = `
    <div id="whatsapp-popup" class="popup-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
      <div class="popup-content" style="background: white; padding: 20px; border-radius: 10px; text-align: center; max-width: 400px;">
        <span class="popup-close" style="cursor: pointer; float: right; font-size: 24px;">&times;</span>
        <p>Message me on <a href='https://wa.me/31613029143' target='_blank'>WhatsApp</a> and get 20% off your booking!</p>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  document.querySelector(".popup-close").addEventListener("click", function () {
    document.getElementById("whatsapp-popup").style.display = "none";
  });
};


// Dropdown for "Learn More About Workshop"
document.querySelector(".dropdown-btn").addEventListener("click", function () {
  const dropdownContent = this.nextElementSibling;
  dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
});

// Legal Disclaimer Toggle (ACTUALLY FIXED THIS TIME)
// Legal Disclaimer Toggle (NOW FIXED!)
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".dropdown-btn").forEach(button => {
      button.addEventListener("click", function () {
          const dropdownContent = this.nextElementSibling;
          if (dropdownContent.classList.contains("active")) {
              dropdownContent.classList.remove("active");
              dropdownContent.style.maxHeight = "0";
              dropdownContent.style.padding = "0";
          } else {
              dropdownContent.classList.add("active");
              dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
              dropdownContent.style.padding = "15px";
          }
      });
  });
});


document.getElementById("book-now").addEventListener("click", function () {
  const selectedDate = document.getElementById("calendar").value;
  const email = document.getElementById("email").value;
  const button = this; // Reference to the button

  if (selectedDate && email) {
      button.disabled = true; // Disable button to prevent double clicks
      button.innerText = "Processing...";
      
      fetch("http://localhost:5000/api/book-class", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: selectedDate, email: email })
      })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
          button.innerText = "Book Now"; // Reset button text
          button.disabled = false; // Re-enable button
      })
      .catch(error => {
          console.error("Error:", error);
          button.innerText = "Book Now";
          button.disabled = false;
      });
  } else {
      alert("Please select a date and enter your email.");
  }
});


document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:5000/api/bookings")
  .then(response => response.json())
  .then(bookedDates => {
      flatpickr("#calendar", {
          enableTime: true,
          dateFormat: "Y-m-d H:i",
          minDate: "today",
          minuteIncrement: 30,
          disable: bookedDates.map(b => b.date),  // Disable booked dates
          theme: "material_blue" // Ensure theme is applied
      });
  });
});


