const API_KEY = '4fcde6391a2b58033c2b5a93e1777d13';

async function getWeatherData(cityName) {
    try {
        const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            console.log('City not found.');
            return;
        }

        const { lat, lon } = geoData[0];

        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const weatherData = await weatherResponse.json();

        const todayData = weatherData.list[0];
        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);
            return `${day}.${month}.${year}`;
        }
        function capitalizeWords(description) {
            return description
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        }
        function getGreeting() {
            const currentHour = new Date().getHours();
        
            if (currentHour >= 5 && currentHour < 12) {
                return "Good Morning";
            } else if (currentHour >= 12 && currentHour < 17) {
                return "Good Afternoon";
            } else if (currentHour >= 17 && currentHour < 21) {
                return "Good Evening";
            } else {
                return "Good Night";
            }
        }
        function getFormattedTime() {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
        
            hours = hours % 12;
            hours = hours ? hours : 12;
        
            return `${hours}:${minutes} ${ampm}`;
        }
        const todayDate = formatDate(todayData.dt_txt);
        const todayWeatherDescription = capitalizeWords(todayData.weather[0].description);
        const todayTemperature = (todayData.main.temp - 273.15).toFixed(0);
        const todayFeelsLike = (todayData.main.feels_like - 273.15).toFixed(1);
        const todayHumidity = todayData.main.humidity;
        const todayWindSpeed = todayData.wind.speed;
        const greeting = getGreeting
        const time = getFormattedTime
        document.getElementById("cityname").innerHTML = cityName
        document.getElementById("date").innerHTML = todayDate
        document.getElementById("degree").innerHTML = todayTemperature+"°"
        document.getElementById("degree1").innerHTML = todayTemperature+"°"
        document.getElementById("desc").innerHTML = todayWeatherDescription
        document.getElementById("desc1").innerHTML = todayWeatherDescription
        document.getElementById("humidity").innerHTML = todayHumidity
        document.getElementById("humidity1").innerHTML = todayHumidity
        document.getElementById("windspeed").innerHTML = todayWindSpeed
        document.getElementById("windspeed1").innerHTML = todayWindSpeed
        document.getElementById("feelslike").innerHTML = "Feels likes " + todayFeelsLike+"°"
        document.getElementById("greeting").innerHTML = greeting()
        document.getElementById("time").innerHTML = time()

        const dailyData = weatherData.list.filter((entry) => entry.dt_txt.includes("12:00:00"));

        const tabsElement = document.getElementById("tabs");
        tabsElement.innerHTML = ''; // Clear any existing content

        dailyData.slice(0, 7).forEach((entry) => {
            function getDayName(dateString) {
                const date = new Date(dateString);
                const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                return daysOfWeek[date.getDay()];
            }
            
            const dayOfWeek = getDayName(entry.dt_txt);
            const weatherDescription = capitalizeWords(entry.weather[0].description);
            const temperature = (entry.main.temp - 273.15).toFixed(0);

            // Create a new card element
            const card = document.createElement('div');
            card.className = 'card';

            // Populate the card with the weather information
            card.innerHTML = `
                <h2>${dayOfWeek}</h2>
                <h1>${temperature}°</h1>
                <h3>${weatherDescription}</h3>
            `;

            // Append the card to the tabs element
            tabsElement.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function getCityWeather() {
    const cityName = document.getElementById("input").value;
    if (cityName) {
        getWeatherData(cityName);
    } else {
        console.log('City name cannot be empty.');
    }
}

document.getElementById("input").addEventListener("change", (() => { getCityWeather() }));

document.querySelector('.container .right .input input').addEventListener('focus', function () {
    this.parentElement.classList.add('focused');
});

document.querySelector('.container .right .input input').addEventListener('blur', function () {
    this.parentElement.classList.remove('focused');
});
