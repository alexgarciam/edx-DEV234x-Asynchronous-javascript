

document.getElementById("analyse").addEventListener("click",function(){

	var imageUrl=document.getElementById("input").value;
	var imagen = document.getElementById("image");
	imagen.src=imageUrl;

	analyseFace(imageUrl);
});

function analyseFace(imageUrl){
	var url="https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,smile,facialHair,glasses";
	var apiKey="003e4561b3d4415a84a315c167b370ee";
	
	var reqBody = {
		"url" : imageUrl
		//"url" : "http://pngimg.com/upload/face_PNG11761.png"
	};

	var myHeader = new Headers({
		'Content-type':'application/json',
		'Ocp-Apim-Subscription-Key':apiKey
	});

	var initObject = {
		method:'POST',
		body: JSON.stringify(reqBody),
		headers: myHeader
	}

	var request=new Request(url, initObject);

	fetch(request).then(function (response){
		if(response.ok){
			return response.json();
		}else{
			return Promise.reject(new Error(response.statusText));
		}
	}).then(function (result){
		if(result.length>0){
		document.getElementById("age").innerHTML="age: " + result[0].faceAttributes.age;
		document.getElementById("gender").innerHTML="gender: " + result[0].faceAttributes.gender;
		}else{
			document.getElementById("age").innerHTML="No faces Detected!";
			document.getElementById("gender").innerHTML="";
		}
	}).catch(function(err){
		alert(err);
	});
}