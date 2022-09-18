var citylist = [
    {
        name: "Houston, Texas, US",
        lati: 29.7589382,
        lont: -95.3676974,
    },
    {
        name: "Dallas, Texas, US",
        lati: 32.7762719,
        lont: -96.7968559,
    }
];
var citySeq = 0;

// need to solve 

function loadCitylist(){
    $(".cityBtn").remove();
    citylist=JSON.parse(localStorage.getItem("cityList"));
    if (!citylist){
        citylist ="";
        return;
    }
    console.log(citylist);
    for (var i=0; i < (Math.min(10, citylist.length)); i++ ){
        // debugger;
        var cityEl= document.createElement("button");
        cityEl.classList="cityBtn col-12 mt-3 rounded";
        cityEl.textContent=citylist[citylist.length-1-i].name;
        cityEl.setAttribute("data-lat",citylist[citylist.length-1-i].lati);
        cityEl.setAttribute("data-lon",citylist[citylist.length-1-i].lont); 
        cityEl.setAttribute("data-city",citylist[citylist.length-1-i].name);
        cityEl.setAttribute("data-seq",citySeq);
        $("#cities").append(cityEl);
    }
}

function saveCitylist(){
    localStorage.setItem("cityList",JSON.stringify(citylist));
}

$(".searchBtn").on("click", function(){
    var cityText = $(".searchCity").val().trim();
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityText+"&limit=5&appid=0c83ee7b5026cd0b1fbb61322219f621";
    fetch(apiUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
                var chosenCity= pickCity(data);
                var weather =data.list[0].weather;
                var main=data.list[0].main;
                console.log(weather);
                console.log(main);
                //call function to check city. here if there is a list then modal and choose

            })
        } else {
            alert("Error: City "+ cityText+"Not Found");
        }
    })
})
$(".clearBtn").on("click",function(){
    //need to clean the list
   var clearQ = confirm("Are you sure you want to clear the city list?");
   if (clearQ){
    citylist=""
    saveCitylist();
    loadCitylist();
   }
})

var pickCity=function(data) {
    if (data.length > 1){
        for (var i=0; i<data.length; i++){
            var cityCandiEl=document.createElement("button");
            cityCandiEl.classList="cityCandiBtn col-11 mb-2";
            cityCandiEl.setAttribute("data-seq",i);
            var chosenCity=[];
            chosenCity.name=data[i].name+", "+data[i].state+", "+data[i].country;
                // chosenCity.lat=data[i].lat;
                // chosenCity.lon=data[i].lon;
            cityCandiEl.textContent=chosenCity.name;
            var modalCityList= document.querySelector(".modal-citylist");
            modalCityList.appendChild(cityCandiEl);
        }
        $('#citiesList-modal').modal('show');
        //not function. use click eventlistener
        $(".modal-citylist").on("click", ".cityCandiBtn", function(){
            citySeq=$(this).attr("data-seq");
            console.log(data[0]);
            console.log(citySeq);
            $(".cityCandiBtn").remove();
            $('#citiesList-modal').modal('hide');//no function yet
            var chosenCity=[];
            chosenCity.name=data[citySeq].name+", "+data[citySeq].state+", "+data[citySeq].country;
            chosenCity.lat=data[citySeq].lat;
            chosenCity.lon=data[citySeq].lon;
                console.log(chosenCity);
            getWeather(chosenCity);
            addCity(chosenCity);
        })
        $(".cancelBtn").on("click",function(){
            $('#citiesList-modal').modal('hide');//no function yet
            $('searchCity').trigger("focus");
            return;
        })
    }
    else {
        citySeq=0;
        var chosenCity=[];
        chosenCity.name=data[0].name+","+data[0].state+","+data[0].country;
        chosenCity.lat=data[0].lat;
        chosenCity.lon=lon = data[0].lon;
        console.log(chosenCity);
        getWeather(chosenCity);
        addCity(chosenCity);
        console.log(chosenCity);
        console.log("no click");
    }
}

var getWeather=function(chosenCity) {
    console.log("get weather lat: "+ chosenCity.lat);
    console.log("get weather lon: "+ chosenCity.lon);
    console.log("get weather city: "+ chosenCity.name);
    var currentUrl="https://api.openweathermap.org/data/2.5/weather?lat="+chosenCity.lat+"&lon="+chosenCity.lon+"&units=imperial&appid=9086c76e37dd7754dfe04ec92e3de71d";
    var weathApiUrl="https://api.openweathermap.org/data/2.5/forecast?lat="+chosenCity.lat+"&lon="+chosenCity.lon+"&units=imperial&appid=9086c76e37dd7754dfe04ec92e3de71d";
    // get current weather
    fetch(currentUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
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
                console.log(data);
                displayWeatherForecast(data);

            })
        } else {
            alert("Error: City "+ chosenCity.name+" Not Found");
        }
    });
}

var addCity=function(chosenCity){
    var cityIndex=citylist.indexOf(chosenCity);
    console.log=cityIndex;
    if(cityIndex > -1){
        citylist.splice(index,cityIndex);//issue?
    }
    console.log("addCity button "+ chosenCity.name);
    citylist.push(chosenCity);
    saveCitylist();
    loadCitylist();
}

$("#cities").on("click",".cityBtn", function(){
    chosenCity=[];
    chosenCity.name=$(this).text();
    chosenCity.lat=$(this).attr("data-lat");
    chosenCity.lon=$(this).attr("data-lon");
    console.log(chosenCity);
    getWeather(chosenCity);
})

//function to display current weather
var displayCurrentWeather=function(data) {
    $(".currentlist").remove();
    console.log("display current weather");
    var iconcode=data.weather[0].icon;
    var iconurl="http://openweathermap.org/img/w/" + iconcode + ".png";
    var iconEl=document.createElement("span");
        iconEl.className=("cicon");
        iconEl.setAttribute=("src", iconurl);
        console.log(iconurl);
        console.log(iconEl);
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
}

//function to dispaly 5-day weather forecast 
var displayWeatherForecast=function(data){
    console.log("display weather forecast");

}

// saveCitylist();//temp need to remove later
loadCitylist();
