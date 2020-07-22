/* Global Variables */
const api_key = "9b948de7776b6493094f6fa1a3b2a939";
const base_url = `http://api.openweathermap.org/data/2.5/forecast?id=524901&units=metric`;

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();

//_______

const onGenerate = () => {
  const zip = document.getElementById("zip").value;
  const url = `${base_url}&zip=${zip}&APPID=${api_key}`;
  let feelings = document.getElementById("feelings").value;

  if (!zip) feelings = "Please enter a zip code for more accurate results..";
  if (!feelings) feelings = "You didn't say how you're feeling..";

  getWeather(url).then((data) => {
    postData("/projectData", {
      date: newDate,
      temp: Math.round(data.list[0].main.temp),
      content: feelings,
      city: data.city.name,
      description: data.list[0].weather[0].description,
    }).then(updateUI("/projectData"));
  });
};

const getWeather = async (url) => {
  const res = await fetch(url);
  if (res.status === 404) {
    document.getElementById("content").innerHTML =
      "Please write a valid zip code!";
  }
  try {
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

const postData = async (url = "", data = {}) => {
  const res = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  try {
    const newData = await res.json();
    console.log(newData);
    return newData;
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

const updateUI = async (url) => {
  const request = await fetch(url);
  try {
    const allData = await request.json();
    document.getElementById("date").innerHTML = `Date: ${allData.date}`;
    document.getElementById(
      "temp"
    ).innerHTML = `Temperature in C°: ${allData.temp}`;
    document.getElementById(
      "content"
    ).innerHTML = `Content: ${allData.content}`;
    document.getElementById("city").innerHTML = `City: ${allData.city}`;
    document.getElementById(
      "description"
    ).innerHTML = `Description: ${allData.description}`;
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

const button = document.getElementById("generate");
button.addEventListener("click", onGenerate);
