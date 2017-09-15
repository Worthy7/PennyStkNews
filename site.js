

// ideas
//get the price at the time of the report
//compare to the price now
//print the time diff

//for efficiency
//get the feed, store locally with prices at the time
//get a new feed, update the local store version
//occastionally update the price of "now" info for on screen elements.


function Post (guid, title, pubdate, price, ticker) {

    return {
        guid : guid,
        title : title,
        pubdate: pubdate,
        price : price,
        ticker: ticker
    }
}


stg = new Storage();

function parseId(entry) {
	val = entry.getElementsByTagName("guid")[0].childNodes[0].nodeValue
	return val
}


function parsePubDate(entry) {
	val = new Date(entry.getElementsByTagName("pubDate")[0].childNodes[0].nodeValue)
	return val
}


function parseTag(entry, tag) {
	val = entry.getElementsByTagName(tag)[0].childNodes[0].nodeValue
	return val
}


function xmlParse(entry) {
	parser = new DOMParser();
    xmlDoc = parser.parseFromString(entry, "text/xml");
	return 
}

function clearFeed(){

}

function checkIfPink(entry) {
	val = entry.getElementsByTagName("pink:tier")[0].childNodes[0].nodeValue.search("Pink")
	return (val >=0)

}


function getFeed(callback){
	$.get('https://s3.amazonaws.com/content.otcmarkets.com/syndicate/rss.xml', function (data) {
	    	callback(data)
    });
};

function parseStream(feed) {
    arr = []
    $(feed).find("item").each(function (i, entry) {
        if (!checkIfPink(entry)) // don't save pink stocks
        arr.push(Post(parseId(entry), parseTag(entry, "title"), parsePubDate(entry), 0.0, parseTicker(entry)))
            })
    return arr
}


function parseCsv(data){

}

function getNicePubDate(data){
	return (new moment(parsePubDate(data)).tz('America/New_York').format("YYYY-MM-DD HH:mm:ss"))
}

function getTimedStockPrice(entry, ticker, date, callbackinput){
	//date must be YYYY-MM-DD
	fdate = (new moment(date)).tz('America/New_York').format("YYYY-MM-DD")
	//ticker = "AAPL"
	//fdate = "2017-09-12"
	url = "https://www.google.com/finance/historical?q=OTCMKTS:"+ ticker+ "&startdate="+ fdate + "&enddate=" + fdate + "&output=csv"


    /////disabled for now due to cors issues

    callbackinput(entry, ticker, date, 0.0);

   //$.ajax({
   //     url: url,
   //     type: 'get',
   //     dataType: 'text',
   //     success: function(data) {
   //         //it usually comes here
   //     	try{
	  //      	date = data.split("\n")[1].split(",")[0]
	  //      	price = data.split("\n")[1].split(",")[4]
	  //      	callbackinput(entry, ticker, date, price);
   //     	} catch (err) {
   //     		//google didn't manage to give us the price.
   //     		//alert(err)
   //     	}
   //     },
   //     error: function(jqXHR, textStatus, errorThrow){
   //     	//alert(jqXHR)
   //     }
   // })

}

function getStockPrice(entry, ticker, callbackinput){
	// stolen from https://stackoverflow.com/questions/5150040/stock-quotes-with-javascript
	var symbols= [ticker];
    var callback = function(data) {
       callbackinput(entry, ticker, data.query.results.quote.LastTradePriceOnly)
    };
    
    var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20("
    $.each(symbols, function(j, code){
       url += "%22" + code + "%22";
       if (j < (symbols.length-1)){
          url += "%2C";
       }
    });
    url += ")&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
    $.getJSON(url, callback);
}


function parseTicker(entry) {
	return entry.getElementsByTagName("pink:symbol")[0].childNodes[0].nodeValue
}


function parseFeedDate(data) {
	return new Date($(data).find("lastBuildDate")[0].childNodes[0].nodeValue)
}

function displayEntry(entry, ticker, price){
	console.log("------------------------");
	console.log(entry);
	console.log(ticker);
	console.log(price);
}

function addPrice(entry, price){
	pricetag = document.createElement("price");
	pricenode = document.createTextNode(price);
	entry.appendChild(pricetag);
	entry.getElementsByTagName("price")[0].appendChild(pricenode);
	return entry;
}

function updateFeed(callback){
	getFeed(function(data){
		current_feed_date = new Date(stg.get("feeddate"))
		new_feed_date = parseFeedDate(data)
		if (current_feed_date == null || current_feed_date < new_feed_date) {
			//set the new date
			//get the current feed items
			stream_items = parseStream(data)
			//limit size
			//stream_items = stream_items.slice(0, 10)
			//compare and get the new items
			for (i = 0; i < stream_items.length; i++){
                stg.storePost(stream_items[i])
            }
            stg.set("feeddate", new_feed_date) //we will skip this for now to test
        }
		callback();
	})
}
//run regularly
//timeout...
var ONE_MINUTE = 60 * 1000;
//updateFeed()
