/*
 #######################################################################
 #
 #  FUNCTION NAME : 
 #  AUTHOR        : 
 #  DATE          : 
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : 
 #  PARAMETERS    : 
 #
 #######################################################################
*/

/* GLOBAL VARIABLES */
var buttonArr = {"ncis":0,"csi":0,"friends":0,"charmed":0,"gossip girl":0,"pretty little liars":0} //array of topics
var passed = false //initialization flag

$(document).ready(function() {

	//footer
 	var currdate = new Date();
 	var year = currdate.getFullYear();
 	//var canvasTop = "450";
 	var crstr = "&copy; "+year+"<br>";
 	$('footer').empty().append(crstr);

 	//SUBMIT BUTTON
 	$("#form1").submit(function(e) {		
 		e.preventDefault();
 		var topic = $("#anInput").val().toLowerCase()
 		if (topic == "") {
 			alertMsg("Please provide a TV Show.")
 		} else {
	 		if (!(topic in buttonArr)) {
	 			buttonArr[topic] = 0
	 			createDynamicButton(topic,1)
	 		} else {
	 			alertMsg(topic+" already exists!")
	 			$("#anInput").val("")
	 		  }
	 	  }
 	})
 	
 	//CREATE INITIAL BUTTONS
 	for (keys in buttonArr) {
 		createDynamicButton(keys,9)
 	}

 	//FOCUS ON THE INPUT
 	$("#anInput").focus()

 	//BUTTONS CLICK 
 	$("#button-divs").on("click", "button", function() {
 		var t = $(this).text()
 		buttonArr[t] += 1
 		var limit = buttonArr[t] * 10
 		sendQuery(limit,t)
 		//console.log(t+": "+buttonArr[t])	
 	})

})

/*
 #######################################################################
 #
 #  FUNCTION NAME : createDynamicButton
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 23, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : creates buttons dynamically
 #  PARAMETERS    : button name, flag
 #
 #######################################################################
*/

function createDynamicButton(bname,flag) {

	var b = $("<button>")
	b.text(bname)
	b.attr("class","submit btn")
	$("#button-divs").append(b)
	$("#anInput").val("")

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : alertMsg
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 23, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : alerts error message
 #  PARAMETERS    : message
 #
 #######################################################################
*/

function alertMsg(msg) {

	$("#alertModal .modal-body").empty().append(msg)
 	$("#alertModal").modal("show")

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : sendQuery
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 23, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : creates query to get all the giphy img
 #  PARAMETERS    : limit, topic
 #
 #######################################################################
*/

function sendQuery(limit, query) {

	var api_key = "lo9XTKyeNGqUq1UmSWP9brjuzoyO2N1T"
	var queryURL = "https://api.giphy.com/v1/gifs/search?api_key="+api_key+"&q="+query+"&limit="+limit+"&offset=0&rating=&lang=en"

	$.ajax({
        url: queryURL,
        method: "GET",
        //dataType: "jsonP",
        async: false
    }).then(function (data) {
        //data = JSON.stringify(data)
        createGIFpage(data)
    })

    //var xhr = $.get(queryURL);
	//xhr.done(function(data) { console.log("success got data", data); });

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : createGIFpage
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 23, 2019 PST
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : creates GIF images
 #  PARAMETERS    : json data
 #
 #######################################################################
*/

function createGIFpage(data) {

	$(".rCont").empty()

	for (var i = 0; i < data.data.length; i++) {
		var pdiv = $("<div>")
		pdiv.attr("class","gif fleft")
		var cdiv = $("<div>")
		var im = $("<img>")
		var sp = $("<span>")
		im.attr("src",data.data[i].images.original_still.url)
		im.attr("data-still",data.data[i].images.original_still.url)
		im.attr("data-animate",data.data[i].images.original.url)
		im.attr("data-state","still")
		im.attr("class","imgsize")
		sp.text("Rating: "+data.data[i].rating.toUpperCase())
		cdiv.attr("class","projectTitle")
		cdiv.append(sp)
		pdiv.append(im)
		pdiv.append(cdiv)
		$(".rCont").append(pdiv)
	}

	$(".rCont img").on("click",function() {
		var state = $(this).attr("data-state")
		var src;
		switch (state) {
			case "still":
				src = $(this).attr("data-animate")
				$(this).attr("data-state","animate")
			break;
			case "animate":
				src = $(this).attr("data-still")
				$(this).attr("data-state","still")
			break;
		}
		$(this).attr("src",src)
	})

}
