var env = process.env.NODE_ENV || 'production';
var config = require('../../../config/config')[env];
var rootPath = config.root;

exports.list = function(req, res){
    res.format({
        html: function(){
            res.render(rootPath + '/app/auctions/views/lists', {auctions: []});
        },
        json: function(){
            res.status(200).json({
                "auctions": auctions
            });
        }
    });
}