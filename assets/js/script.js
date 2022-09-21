var citylist = [];
var chosenCity=[];

//function loadCitylist add newest city to the top
function loadCitylist(){
    console.log("loadcity function");
    $(".cityBtn").remove();
    citylist=JSON.parse(localStorage.getItem("cityList"));
    if (!citylist){
        citylist =[];
        // return;
    }
    console.log(citylist);
    for (var i=0; i < (Math.min(10, citylist.length)); i++ ){
        
        var cityEl= document.createElement("button");
        cityEl.classList="cityBtn col-12 my-2 rounded";
        cityEl.textContent=citylist[citylist.length-1-i].name;
        cityEl.setAttribute("data-lat",citylist[citylist.length-1-i].lat);
        cityEl.setAttribute("data-lon",citylist[citylist.length-1-i].lon); 
        cityEl.setAttribute("data-city",citylist[citylist.length-1-i].name);
        $("#cities").append(cityEl);
    }
};

//Function saveCitylist
function saveCitylist(){
    console.log("savecitylist function");
    console.log(citylist);
    localStorage.setItem("cityList",JSON.stringify(citylist));
};

//event listener on the search button to search city name with the input
$(".searchBtn").on("click", function(){
    console.log("search button function");
    var cityText = $(".searchCity").val().trim();
    if (!cityText){
        alert("Please make sure you entered the city in the box!");
        return;
    }
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityText+"&limit=5&appid=0c83ee7b5026cd0b1fbb61322219f621";
    fetch(apiUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
                if (data.length===0){
                    $(".searchCity").val('');
                    alert("Error: City "+ cityText+" Not Found");
                    return;
                } else{
                pickCity(data);
                }
            })
        } else {
            $(".searchCity").val('');
            alert("Error: City "+ cityText+" Not Found");
        }
    })
});

//eventlistener on clearlist button 
$(".clearBtn").on("click",function(){
    console.log("clear button function");
    //need to clean the list
   var clearQ = confirm("Are you sure you want to clear the city list?");
   if (clearQ){
    console.log("clear");
    chosenCity=[];
    citylist=[];
    saveCitylist();
    loadCitylist();
   }
});

//function pickCity. to list the candidate cities 
var pickCity=function(data) {
    console.log("pickCity function");
    console.log(data);

    //if more than one cities with the name, let user choose.
    if (data.length > 1){
        $(".cityCandiBtn").remove();
        
        //list all the cities
        for (var i=0; i<data.length; i++){

            var cityCandiEl=document.createElement("button");
            cityCandiEl.classList="cityCandiBtn col-11 mb-2";
            cityCandiEl.setAttribute("data-seq",i);
            cityCandiEl.setAttribute("data-lon",data[i].lon);
            cityCandiEl.setAttribute("data-lat",data[i].lat);
            cityCandiEl.textContent=data[i].name+", "+data[i].state+", "+data[i].country
            var modalCityList= document.querySelector(".modal-citylist");
            modalCityList.appendChild(cityCandiEl);
            console.log(chosenCity);
        }
        //promote modal and let users select one of the citie buttons
        $('#citiesList-modal').modal('show');
        
        //choose one of the city buttons and display the weather details
        $(".modal-citylist").on("click", ".cityCandiBtn", function(){
            console.log(data[0]);
            // $(".cityCandiBtn").remove();
            $('#citiesList-modal').modal('hide');
            $(".searchCity").val('');
            chosenCity.name=$(this).text();
            chosenCity.lat=$(this).attr("data-lat");
            chosenCity.lon=$(this).attr("data-lon");
                console.log(chosenCity);
            addCity(chosenCity);
            getWeather(chosenCity);
            return(chosenCity);
        })
        //cancel button
        $(".cancelBtn").on("click",function(){
            $(".cityCandiBtn").remove();
            $('#citiesList-modal').modal('hide');//no function yet
            $(".searchCity").val('');
            $('searchCity').trigger("focus");
            return("[]");
        })
    }
    else {
        $(".searchCity").val('');
        chosenCity.name=data[0].name+", "+data[0].state+", "+data[0].country;
        chosenCity.lat=data[0].lat;
        chosenCity.lon=lon = data[0].lon;
        console.log(chosenCity);
        getWeather(chosenCity);
        addCity(chosenCity);
        console.log(chosenCity);
    }
};

//funtion getWeather, get current weather and 5day weather forecast
var getWeather=function(chosenCity) {
    console.log("getweather function"+ chosenCity.name);
    var currentUrl="https://api.openweathermap.org/data/2.5/weather?lat="+chosenCity.lat+"&lon="+chosenCity.lon+"&units=imperial&appid=9086c76e37dd7754dfe04ec92e3de71d";
    var weathApiUrl="https://api.openweathermap.org/data/2.5/forecast?lat="+chosenCity.lat+"&lon="+chosenCity.lon+"&units=imperial&appid=9086c76e37dd7754dfe04ec92e3de71d";
    // get current weather
    fetch(currentUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                debugger;
                displayCurrentWeather(data);
            })
        } else {
            alert("Error: City "+ chosenCity.name+" Not Found");
        }
    });

    // get weather forecast
    fetch(weathApiUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                // console.log(data);
                displayWeatherForecast(data);

            })
        } else {
            alert("Error: City "+ chosenCity.name+" Not Found");
        }
    });
};

//function addCity to add new city into the city button list
var addCity=function(chosenCity){
    console.log("add city function ");
    console.log(chosenCity);

    //search the current citylist. if the city already exist, move the city button to the top of the list
    console.log(citylist);
    for (i=0; i<citylist.length; i++){
        if (chosenCity.name === citylist[i].name){
            console.log(i);
            console.log(citylist[i].name);
            citylist.splice(i,1);
            console.log(citylist);
        }
    }
    
    console.log(chosenCity.name);
    var newCityArr=[{name:"test", lat:0,lon:0}];
        newCityArr[0].name=chosenCity.name;
        newCityArr[0].lat=chosenCity.lat;
        newCityArr[0].lon=chosenCity.lon;
    citylist=citylist.concat(newCityArr);
    console.log(chosenCity);
    saveCitylist(citylist);
    loadCitylist();
}

//if user click city button, get the weather of the city.
$("#cities").on("click",".cityBtn", function(){
    console.log("citybutton click");
    console.log(this);
    chosenCity.name=$(this).text();
    chosenCity.lat=parseFloat($(this).attr("data-lat"));
    chosenCity.lon=parseFloat($(this).attr("data-lon"));
    console.log(chosenCity);
    getWeather(chosenCity);
});

//function to display current weather
var displayCurrentWeather=function(data) {
    debugger;
    console.log("displayweather");
    $(".currentlist").remove();
    var iconcode=data.weather[0].icon;
    var iconurl="http://openweathermap.org/img/w/" + iconcode + ".png";
    var iconEl=document.createElement("img");
        iconEl.classList=("cicon currentlist");
        iconEl.setAttribute("src", iconurl);
    var displayCityEl=document.createElement("h3");
    displayCityEl.className="h3cityname mb-3 currentlist";
    displayCityEl.textContent=chosenCity.name+" ("+moment().format("MMM Do YY, dddd")+")";
    
    var curTempEl=document.createElement("p");
        curTempEl.classList=("mb-3 currentlist");
        curTempEl.textContent="Temp: "+ data.main.temp+" °F";
    var curWindEl=document.createElement("p");
        curWindEl.classList=("mb-3 currentlist");
        curWindEl.textContent="Wind: "+ data.wind.speed + " MPH";
    var curHumidityEl=document.createElement("p");
        curHumidityEl.classList=("mb-3 currentlist");
        curHumidityEl.textContent="Humidity: "+ data.main.humidity + "%";
    var currentEl=document.querySelector(".current");
        currentEl.appendChild(displayCityEl);
        currentEl.appendChild(iconEl);
        currentEl.appendChild(curTempEl);
        currentEl.appendChild(curWindEl);
        currentEl.appendChild(curHumidityEl);
};

//function to dispaly 5-day weather forecast 
var displayWeatherForecast=function(data){
    $(".forecastCard").remove();
    var forecastEl = document.querySelector(".forecast");
        forecastEl.textConten=("5-Day Forecast:");

    for (var i=0; i <5; i++) {
        var weatherCardEl = document.createElement("card");
            weatherCardEl.classList=("forecastCard bg-dark text-white col-5 col-sm-5 col-md-4 col-lg-2 m-1 d-flex flex-column");
        var cardDateEL=document.createElement("h5");
            cardDateEL.className="mt-3"
        cardDateEL.textContent=moment().add(i+1,'days').format('ll');

        var t=(1+i)*8-1;

        var iconcode=data.list[t].weather[0].icon;
        var iconurl="http://openweathermap.org/img/w/" + iconcode + ".png";
        var iconEl=document.createElement("img");
            iconEl.className=("cicon");
            iconEl.setAttribute("src", iconurl);
        
        
        var foreTempEl=document.createElement("p");
            foreTempEl.classList=("mb-3 currentlist");
            foreTempEl.textContent="Temp: "+ data.list[t].main.temp+" °F";
        var foreWindEl=document.createElement("p");
            foreWindEl.classList=("mb-3 currentlist");
            foreWindEl.textContent="Wind: "+ data.list[t].wind.speed + " MPH";
        var foreHumidityEl=document.createElement("p");
            foreHumidityEl.classList=("mb-3 currentlist");
            foreHumidityEl.textContent="Humidity: "+ data.list[t].main.humidity + "%";
        weatherCardEl.appendChild(cardDateEL);
        weatherCardEl.appendChild(iconEl);
        weatherCardEl.appendChild(foreTempEl);
        weatherCardEl.appendChild(foreWindEl);
        weatherCardEl.appendChild(foreHumidityEl);
        forecastEl.appendChild(weatherCardEl);
    }
};

//load the citylist when open the page.
loadCitylist();
