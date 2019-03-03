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
var topics = {"ncis":0,"csi":0,"friends":0,"charmed":0,"gossip girl":0,"pretty little liars":0,
			  "seven deadly sins":0,"that's so raven":0,"beverly hills 90210":0,"lizzie mcguire":0} //array of topics
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
	 		if (!(topic in topics)) {
	 			topics[topic] = 0
	 			createDynamicButton(topic,1)
	 		} else {
	 			alertMsg(topic+" already exists!")
	 			$("#anInput").val("")
	 		  }
	 	  }
 	})
 	
 	//CREATE INITIAL BUTTONS
 	for (keys in topics) {
 		createDynamicButton(keys,9)
 	}

 	//FOCUS ON THE INPUT
 	$("#anInput").focus()

 	//BUTTONS CLICK 
 	$("#button-divs").on("click", "button", function() {
 		var t = $(this).text()
 		topics[t] += 1
 		var limit = topics[t] * 10
 		sendQuery(limit,t)
 		//console.log(t+": "+topics[t])	
 	})

 	//GIF IMAGES
 	$(".rCont, #favorites").on("click", "img",function() {
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

	$(".favHeader span:last-child").on("click",function(){
		console.log("THIS: "+$(this).text())
		switch($(this).text()) {
			case "Hide":
				$(this).text("Show")
				$("#favorites").hide();
			break;
			case "Show":
				$(this).text("Hide")
				$("#favorites").show();
			break;
		}

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
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : March 02, 2019 PST
 #  REVISION #    : 3
 #  DESCRIPTION   : creates GIF images
 #  PARAMETERS    : json data
 #
 #######################################################################
*/

function createGIFpage(data) {

	$(".rCont").empty().scrollTop();

	for (var i = 0; i < data.data.length; i++) {
		var pdiv = $("<div>")
		pdiv.attr("class","gif float-left container-fluid col-5 col-lg col-md-6 col-sm-6 p-0 ml-lg-3")
		var cdiv = $("<div>")
		var im = $("<img>")
		var sp = $("<span>")
		var sp2 = $("<span>") //for add to favorites and 1-click download
		var b1 = $("<i>") //for add to favorites 
		var b2 = $("<i>") //for 1-click downloads
		//IMAGE - GIF
		im.attr("src",data.data[i].images.original_still.url)
		im.attr("data-still",data.data[i].images.original_still.url)
		im.attr("data-animate",data.data[i].images.original.url)
		im.attr("data-state","still")
		im.attr("class","img-fluid")
		//RATING
		sp.text("Rating: "+data.data[i].rating.toUpperCase())
		cdiv.attr("class","projectTitle")
		cdiv.append(sp)
		cdiv.append("&nbsp;")
		cdiv.append("&nbsp;")
		cdiv.append("&nbsp;")
		// cdiv.append("<br>")
		//FAVORITES
		var queryURL = data.data[i].images.original.url
		var imgArr = queryURL.split("/")
		var iName = imgArr[imgArr.length-2]
		b1.attr("title","Add To Favorites")
		b1.attr("class","fas fa-star")
		b1.attr("onclick","addToFavorites(this)")
		b1.attr("id",i+"-"+iName)
		//1-CLICK DOWNLOAD
		b2.attr("title","Download GIF")
		b2.attr("class","fas fa-file-download")
		b2.attr("onclick","downloadTheImg(this)")
		cdiv.append(b1)
		cdiv.append("&nbsp;")
		cdiv.append("&nbsp;")
		cdiv.append("&nbsp;")
		cdiv.append(b2)
		pdiv.append(im)
		pdiv.append(cdiv)
		$(".rCont").append(pdiv)
	}

	

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : addToFavorites
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 26, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : March 02, 2019 PST
 #  REVISION #    : 1
 #  DESCRIPTION   : adds the selected image/gif to the favorites function
 #  PARAMETERS    : element
 #
 #######################################################################
*/

function addToFavorites(obj) {

	if ($(obj).hasClass("selected")) {
		alertMsg("Selected gif is already in favorites.")
		return;
	}

	$(obj).addClass("selected")
	var ids = $(obj).attr("id")

	var pdiv = $("<div>")
	pdiv.attr("class","gif2 col-5 col-lg col-md-6 col-sm-6 p-0")
	var cdiv = $("<div>")
	var im = $("<img>")
	var sp = $("<div>")
	var b1 = $("<button>") //for remove button
	cdiv.attr("class","projectTitle2")

	//REMOVE BUTTON
	b1.text("Remove")
	b1.attr("class","gifButton")
	b1.attr("onclick","$(this).parent().parent().parent().remove();$('#"+ids+"').removeClass('selected')")
	sp.append(b1)
	//sp.attr("style","margin-top:15px")
	cdiv.append(sp)

	//IMAGE
	var im = $("<img>")
	var src = $(obj).parent().prev().attr("src")
	var dstill = $(obj).parent().prev().attr("data-still")
	var danim = $(obj).parent().prev().attr("data-animate")
	var state = $(obj).parent().prev().attr("data-state")

	im.attr("src",src)
	im.attr("data-still",dstill)
	im.attr("data-animate",danim)
	im.attr("data-state",state)
	im.attr("class","img-fluid")

	pdiv.append(im)
	pdiv.append(cdiv)
	$("#favorites").append(pdiv)

}


/*
 #######################################################################
 #
 #  FUNCTION NAME : downloadTheImg
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : February 26, 2019 PST
 #  MODIFIED BY   : Maricel Louise Sumulong
 #  REVISION DATE : March 02, 2019 PST
 #  REVISION #    : 1
 #  DESCRIPTION   : adds the selected image/gif to the favorites function
 #  PARAMETERS    : element
 #
 #######################################################################
*/

function downloadTheImg(obj) {

	var queryURL = $(obj).parent().prev().attr("data-animate")
	var imgArr = queryURL.split("/")
	var iName = imgArr[imgArr.length-1]

	//FROM https://codepen.io/chrisdpratt/pen/RKxJNo

	$.ajax({
        url: queryURL,
        method: 'GET',
        xhrFields: {
            responseType: 'blob'
        },
        success: function (data) {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(data);
            a.href = url;
            a.download = iName;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    });

}

