//依赖模块
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
//目标网址
var url = 'http://www.doutula.com/';
    
//本地存储目录
var dir = 'images';
    
//创建目录1111
mkdirp(dir, function(err) {
    if(err){
        console.log(err);
    }
});

for(var k=0;k<30;k++){
    //发送请求
    request("http://www.doutula.com/article/list/?page="+k, function(error, response, body) {
            
        if(!error && response.statusCode == 200) {
            var ImgArr=[];
            ImgArr.length=0;
            var $ = cheerio.load(body);
            var len=$('.lazy.image_dtb.img-responsive').length-1;
            $('.lazy.image_dtb.img-responsive').each(function(i) {
                if(/\d$/.test($(this).attr("data-original"))) {
                    len--;
                    return  true
                };
                ImgArr.push("http:"+$(this).attr("data-original").replace(/^https?:/,"").replace(/!dta$/,""));
                if(i==len){
                    ImgArr.map(function(val) {
                        download(val, dir, val.substr(-10));
                    })
                }
            });
        }
    });
}
    // 主要方法，用于下载文件
var download = function(url, dir, filename){
    request.head(url, function(err, res, body){
        request(url).pipe(fs.createWriteStream(dir + "/" + filename));
    });
};

