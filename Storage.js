

function Storage() {

///getters
    this.get = function (name) {
        return JSON.parse(window.localStorage.getItem(name));
    };

        ///stored in XML, not json
    this.getPosts = function () {
        
        arra  =[]
        for (var key in localStorage){
            if (key.substr(0,5) == "post_"){
                arra.push(this.GetPost(key.substr(5)))
            }
        }
        arra = arra.sort(function(a, b) { return parsePubDate(a) < parsePubDate(b)})
        return arra
    };

    this.GetPost = function(id){
        val = window.localStorage.getItem("post_" + id)
        var oParser = new DOMParser();
        return oParser.parseFromString(val, "text/xml");
    }
///setters

    this.storePost = function (name, entry) {
        var oSerializer = new XMLSerializer();
        var sXML = oSerializer.serializeToString(entry);

        window.localStorage.setItem("post_"+name, sXML)
    };




    this.set = function (name, value) {
        window.localStorage.setItem(name, JSON.stringify(value));
    };

    this.clear = function () {
        window.localStorage.clear();
    };


/// init

    //this.clear()
    
}
