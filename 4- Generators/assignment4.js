var starships=[{"name":"CR90 Corvette","id":2},{"name":"V-wing","id":75},{"name":"Belbullab","id":22},{"name":"Starfighter","id":74},{"name":"Jedi Interceptor","id":65},{"name":"Star Destroyer","id":3},{"name":"Trade Fedaration Cruiser","id":59},{"name":"Solar Sailer","id":58},{"name":"Republic Attack Cruiser","id":63},{"name":"A-wing","id":28},{"name":"B-wing","id":29},{"name":"Naboo Fighter","id":39},{"name":"Millenium Falcon","id":10}];
var naves= new Array(0);

var select1 = document.getElementById( "starship1" );
var select2 = document.getElementById( "starship2" );

document.getElementById("compareBtn").addEventListener('click',function(){
    populateCompareTable();
})

window.onload = function() {
	/*	
	run(gen).catch(function(err){
        alert(err.message);
    });
    */
    run(gen2).catch(function(err){
        alert(err.message);
    });
	
};

function run(genFunc){
    const genObject= genFunc();                                     //creating a generator object

    function iterate(iteration){                                    //recursive function to iterate through promises
        if(iteration.done)                                          //stop iterating when done and return the final value wrapped in a promise
            return Promise.resolve(iteration.value);
        return Promise.resolve(iteration.value)                     //returns a promise with its then() and catch() methods filled
        .then(x => iterate(genObject.next(x)))                      //calls recursive function on the next value to be iterated
        .catch(x => iterate(genObject.throw(x)));                   //throws an error if a rejection is encountered
    }

    try {
        return iterate(genObject.next());                           //starts the recursive loop
    } catch (ex) {
        return Promise.reject(ex);                                  //returns a rejected promise if an exception is caught
    }
}

//funcion que obtiene todas las naves usando el atributo next
function *gen(){
    //obtener la primera lista de navis
    var filmResponse = yield fetch("http://swapi.co/api/starships/?page=1");
    var film = yield filmResponse.json();
    
    //obtener las naves
    //naves.push(film.results);
    for(let i = 0; i < film.results.length ; i++){
    	naves.push(film.results[i]);
    }
    var next =	film.next;
    
    //obtain all starships with different fetch calls
   	while(film.next!=null){
   		filmResponse = yield fetch(film.next);
    	film = yield filmResponse.json();
    	for(let i = 0; i < film.results.length ; i++){
	    	naves.push(film.results[i]);
	    }
    	next =	film.next;
   	}   

	populateSelects();

    return "ok";

}

//Generator function to obtain only the starships in the array
function *gen2(){
    //obtener la primera lista de naves    
	var url="http://swapi.co/api/starships/";
	var retorno = 0;
	
	/*
	//nota como yield no funcion en este trozo de código al estar dentro de un callback
	starships.forEach(function(currentValue,index,arr) {
	    retorno += currentValue.name + currentValue.id + "\n" ;
	    var naveResponse = yield;
	    var nave = yield ;
	});
	*/

	for(let i = 0; i < starships.length ; i++){
		retorno += starships[i].name + starships[i].id + "\n" ;
	    var naveResponse = yield fetch(url+starships[i].id);
	    var nave = yield naveResponse.json();
    	naves.push(nave);
    }

	console.log(retorno);
	populateSelects();
    
    return "ok";
}

function populateSelects(){
	//populate selects
   	for ( i = 0; i < naves.length; i += 1 ) {
    	
        option1 = document.createElement( 'option' );
        option1.value =  i;
        option1.text =naves[i].name;

        option2 = document.createElement( 'option' );
        option2.value =  i;
        option2.text =naves[i].name;

        select1.add( option1 );
        select2.add( option2);
    }
}

function populateCompareTable(){
	var nave1=naves[select1.options[select1.selectedIndex].value];
	var nave2=naves[select2.options[select2.selectedIndex].value];

	var tabla=document.getElementById("compareTable");
	tabla.rows[1].cells[1].innerHTML=nave1.name;	
	tabla.rows[1].cells[2].innerHTML=nave2.name;
	tabla.rows[2].cells[1].innerHTML=nave1.cost_in_credits;
	tabla.rows[2].cells[1].bgColor=setCellColor(nave1.cost_in_credits,nave2.cost_in_credits);
	tabla.rows[2].cells[2].innerHTML=nave2.cost_in_credits;
	tabla.rows[2].cells[2].bgColor=setCellColor(nave2.cost_in_credits,nave1.cost_in_credits);
	tabla.rows[3].cells[1].innerHTML=nave1.max_atmosphering_speed;
	tabla.rows[3].cells[1].bgColor=setCellColor(nave1.max_atmosphering_speed,nave2.max_atmosphering_speed);
	tabla.rows[3].cells[2].innerHTML=nave2.max_atmosphering_speed;
	tabla.rows[3].cells[2].bgColor=setCellColor(nave2.max_atmosphering_speed,nave1.max_atmosphering_speed);
	tabla.rows[4].cells[1].innerHTML=nave1.cargo_capacity;
	tabla.rows[4].cells[1].bgColor=setCellColor(nave1.cargo_capacity,nave2.cargo_capacity);
	tabla.rows[4].cells[2].innerHTML=nave2.cargo_capacity;
	tabla.rows[4].cells[2].bgColor=setCellColor(nave2.cargo_capacity,nave1.cargo_capacity);
	tabla.rows[5].cells[1].innerHTML=nave1.passengers;
	tabla.rows[5].cells[1].bgColor=setCellColor(nave1.passengers,nave2.passengers);
	tabla.rows[5].cells[2].innerHTML=nave2.passengers;
	tabla.rows[5].cells[2].bgColor=setCellColor(nave2.passengers,nave1.passengers);
}

function setCellColor(value1, value2){
	var val1=parseInt(value1);
	var val2=parseInt(value2);

	if (isNaN(val1) || isNaN(val2) || val1<=val2){		
		return "white";
	}
	return "red";
}