document.getElementById("analyseButton").addEventListener("click",analyze);

function analyze(){

	var reqBody = {
		"documents" : [
			{
				"language":"en",
				"id":"1",
				"text": document.getElementById("input").value
			}
		]
	};

	var myHeader = new Headers({
		'Content-type':'application/json',
		'Ocp-Apim-Subscription-Key':'fb0edd889e3c41f496ef47a1ecdb73ed'
	});

	var initObject = {
		method:'POST',
		body: JSON.stringify(reqBody),
		headers: myHeader
	}

	var request = new Request('https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases', initObject);

	fetch(request).then(function(response){
		if(response.ok){
			return response.json();
		}else{
			return Promise.reject(new Error(response.statusText));
		}
	}).then(function(response){
		document.getElementById("output").innerHTML="Total key phrases: " + response.documents[0].keyPhrases.length + "</br>" + response.documents[0].keyPhrases;
	}).catch(function(err){
		alert(err);
		document.getElementById("output").innerHTML="";
	});

}