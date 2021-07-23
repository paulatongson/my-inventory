const inputElements = document.querySelector(
  "#contact>.container>.row"
).children;

const submitContactButton = document.querySelector(
  "#contact>.container>.row>div>button"
);

const contactUs = {
  Name: null,
  Subject: null,
  MobileNumber: null,
  EmailAdd: null,
  Comments: null,
};

submitContactButton.addEventListener("click", async (e) => {
  if (!confirm("Are you sure you want send your concern?")) {
    return;
  }

  for (let i = 0; i < inputElements.length - 1; i++) {
    const value = inputElements[i].value;
    const name = inputElements[i].name;

    if (!value.trim()) {
      return alert(`
          You must fill all the input given
          Input ${name} is empty
          `);
    }
    contactUs[name] = value;
  }
  try {
    await axios.post(`/`, contactUs);
    for (let i = 0; i < inputElements.length - 1; i++) {
      inputElements[i].value = "";
    }
  } catch (error) {
    alert("Sorry, your request cannot be processed right now");
  }
});
