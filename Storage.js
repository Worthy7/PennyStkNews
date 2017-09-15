
function Storage() {
    
///getters
    this.get = function (name) {
        return JSON.parse(window.localStorage.getItem(name));
    };

        ///stored in XML, not json
    this.getPosts = function () {
        //not pink, sorted by date - kind of a service function
        
        arra  =[]
        for (var key in localStorage){
            if (key.substr(0, 5) == "post_") {
                post = this.getPost(key.substr(5))
                arra.push(post)
            }
        }
        arra = arra.sort(function (a, b) { return b.pubdate - a.pubdate })
        //debugging 
        for (var i = 0; i < arra.length; i++) {
            console.log(arra[i].pubdate)
        }
        return arra
    };

    this.getPost = function (id) {
        //format dates

        entity = this.get("post_" + id)
        entity.pubdate = new Date(entity.pubdate)
        return entity
    }
///setters

    this.storePost = function (entry) {
        this.set("post_"+entry.guid, entry)
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
