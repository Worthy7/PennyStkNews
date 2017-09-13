

// ideas
//get the price at the time of the report
//compare to the price now
//print the time diff

//for efficiency
//get the feed, store locally with prices at the time
//get a new feed, update the local store version
//occastionally update the price of "now" info for on screen elements.




function main(){
	clearFeed()
	entries = getFeed(function(entries){

		
		notpinkentries = {}
		for (entry in entires){
			if (checkIfPink(entry)) {

			} else {
				notpinkentries[parseId(entry)] = entry
			}
		}

		
		ticker = parseTicker(entry)
		getStockPrices(entry, ticker, function(entry, ticker, prices) {
			if (price < 5.0) {
				displayEntry(entry, ticker, price);
			}	
		})

		}
	)
}

function parseId(entry) {
	val = entry.getElementsByTagName("guid")[0].childNodes[0].nodeValue
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

class feed(){
	currentFeed = ""

	function getUpdatesToFeed(){
		
		getFeed(function(data){
			//compare to current data and return

		})
	}
}

currentFeed = ""
function getFeed(callback){
	$.get('https://s3.amazonaws.com/content.otcmarkets.com/syndicate/rss.xml', function (data) {
	    	callback($(data).find("item"))
    });
};




function getStockPrices(symbols, ticker, callbackinput, date=null){
	// stolen from https://stackoverflow.com/questions/5150040/stock-quotes-with-javascript
    var callback = function(data) {
       callbackinput(entry, ticker, data.query.results.quote.LastTradePriceOnly)
    };

    var callback = function(data) {
       var results = "";
       $.each(data.query.results.quote, function(i, value){
          results += value.Name + ":$" + value.LastTradePriceOnly + " ";
       })
       callbackinput(entry, ticker, results)
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

function parseDateTime(entry) {
	dtime = entry.getElementsByTagName("pink:symbol")[0].childNodes[0].nodeValue
	return dtime
}

function parseTicker(entry) {
	return entry.getElementsByTagName("pink:symbol")[0].childNodes[0].nodeValue
}

function displayEntry(entry, ticker, price){
	console.log("------------------------");
	console.log(entry);
	console.log(ticker);
	console.log(price);
}

//run regularly
//timeout...
main()