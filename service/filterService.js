'use strict';
// service to filter data
exports.getFilterdata = (docs , loggedUserEmail) => {
    let friends = {};
    let updatedDocs = docs.find(o => o.email == loggedUserEmail).connectFriends;    
    for (var i =0 ; i < docs.length; i++) {
        friends[docs[i]._id] = docs[i].dist;
    }
    updatedDocs.forEach(function(doc) {
        doc.dist = friends[doc._id]
    })
    updatedDocs.sort(function(a, b){return (1700 *(a.depth) + (a.dist)) - (1700 *(b.depth) + (b.dist))});
    var result = updatedDocs.map((item)=> {
       let sendobj = {
            depth : item.depth+1,
            email : item.email,
            distance : item.dist
        }
        return sendobj;
    })
    return result;
}