//PhantomJS Cloudを使ってランキングページのHTMLを取得するので、PhantomJS Cloudのアカウントをとって45行目のキーに入れてください
//Parserというライブラリを予めGASに読み込んでおいてください。https://www.kutil.org/2016/01/easy-data-scrapping-with-google-apps.html 「GAS Parser」でググれば日本語の解説も見つかります
//GASのTrigger機能つかって定期的に実行する想定です

// Discordに送信する関数
function discord(message) {
    const url        = 'https://discordapp.com/api/webhooks/xxxxxxxxxxxxxxxxxxxxxxxxxxx'; //Discordに投稿したいチャンネルのWebhookURLを入れる
    const channel    = '#xxxxxxxxxxxxxxx'; //投稿するチャンネル名を入れる
    const text       = message;
    const username   = 'bot';
    const parse      = 'full';
    const method     = 'post';

    const payload = {
        'channel'    : channel,
        "content"    : text,
        'username'   : username,
        'parse'      : parse,
    };

    const params = {
        'method' : method,
        'payload' : payload,
        'muteHttpExceptions': true

    };

   response = UrlFetchApp.fetch(url, params);
}

function postMessage() {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth()+1;
  var week = today.getDay();
  var day = today.getDate();
  var yobi= new Array("日","月","火","水","木","金","土");

  var message = "西暦"+year+"年"+month+"月"+day+"日 "+yobi[week]+"曜日のビリビリ総合ランキング\r\r";
  var prop = PropertiesService.getScriptProperties().getProperties();
  
  
  const URL = 'https://www.bilibili.com/ranking/all/0/0/3';//bilibiliのランキングページ　
  var key = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; //phantomJSのキーを入れる
  
  var payload = 
      {url:URL,
       renderType:'HTML',
       outputAsJson:true};
  payload = JSON.stringify(payload);
  payload = encodeURIComponent(payload);
 
  var url = 'https://phantomjscloud.com/api/browser/v2/'+ key +'/?request=' + payload; 
  
  Logger.log(url);
  
  var response = UrlFetchApp.fetch(url);
 
  var json = JSON.parse(response.getContentText()); 
  var source = json["content"]["data"];
  
  source = String(source).replace( '\"', '"' );
  // Logger.log('Source text is ' + source);
  
  var doc = Parser.data(source)
                    .from('<ul class="rank-list">')
                    .to('<div class="num">11</div>')
                    .build();


  
  var rankeditem = Parser.data(doc)
                    .from('<li class="rank-item">')
                    .to('</li>')
                    .iterate();
  
  // Logger.log('rankeditem is ' + rankeditem[0]);
  
  
  var rankedurl = Parser.data(doc)
                    .from('<div class="info"><a href="')
                    .to('" target="_blank" class="title">')
                    .iterate();
  
  // Logger.log('rankedurl is ' + rankedurl[0]);
  
  var rankedtitle = Parser.data(doc)
                            .from('target="_blank" class="title">')
                            .to('</a>')
                            .iterate();
  
  Logger.log('rankedtitle is ' + rankedtitle[0]);
  
  var howmanyplayed = Parser.data(doc)
                              .from('<i class="b-icon play"></i>')
                              .to('</span><span')
                              .iterate();

  for(i=0;i<10;++i){
    var j = i+1;
    message += j + "位：" + rankedtitle[i] + " \r" + rankedurl[i]  + "\r再生数" + howmanyplayed[i] + "　\r\r";
  }
  
  discord(message);
}
