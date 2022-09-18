var citylist = ["Houston, Texas, US","Dallas, Texas, US"];
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
        cityEl.textContent=citylist[citylist.length-1-i];
        cityEl.setAttribute("data-city",citylist[citylist.length-1-i]);
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
            var chosenCity=data[i].name+", "+data[i].state+", "+data[i].country;
            cityCandiEl.textContent=chosenCity;
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
            console.log("click works");
            var lat = data[citySeq].lat;
            var lon = data[citySeq].lon;
            chosenCity=data[citySeq].name+", "+data[citySeq].state+", "+data[citySeq].country;
            getWeather(lat,lon,chosenCity);
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
        var lat = data[0].lat;
        var lon = data[0].lon;
        var chosenCity=data[0].name+","+data[0].state+","+data[0].country;
        getWeather(lat,lon,chosenCity);
        addCity(chosenCity);
        console.log(chosenCity);
        console.log("no click");
    }
}

var getWeather=function(lat, lon, chosenCity) {
    console.log("get weather"+ lat);
    console.log("get weather"+ lon);
    console.log("get weather"+ chosenCity);
    var weathApiUrl="https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid=9086c76e37dd7754dfe04ec92e3de71d";
    fetch(weathApiUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
                //call function to display weather

            })
        } else {
            alert("Error: City "+ chosenCity+" Not Found");
        }
    })
}

var addCity=function(chosenCity){
    var cityIndex=citylist.indexOf(chosenCity);
    if(cityIndex > -1){
        citylist.splice(index,cityIndex);//issue?
    }
    console.log("addCity button "+ chosenCity);
    citylist.push(chosenCity);
    saveCitylist();
    loadCitylist();
}

$("#cities").on("click",".cityBtn", function(){
    chosenCity=$(this).text();
    chosenCityArry=chosenCity.split(", ");//split issue??
    console.log(chosenCityArry);
    var latlonUrl="http://api.openweathermap.org/geo/1.0/direct?q="+chosenCityArry[0]+","+chosenCityArry[1]+","+chosenCityArry[2]+"&limit=5&appid=0c83ee7b5026cd0b1fbb61322219f621";
    fetch(latlonUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
                var lat = data[0].lat;
                var lon = data[0].lon;
                getWeather(lat,lon,chosenCityArry);
            })
        } else {
            alert("Error: City "+ chosenCity+"Not Found");
        }
    })

})

//temp need to remove later
loadCitylist();
