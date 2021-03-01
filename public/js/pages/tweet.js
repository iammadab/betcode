const store = {
  unclassifiedSection: document.querySelector("#tweet > .tweets"),
  tweets: []
}

;(async function loadTweets(){
  
  const res = await fetch("/api/tweet/status/unclassified").then(res => res.json())

  if(res.status != 200)
    alert("Failed to load tweets, reload or contact support")

  store.tweets = res.data

  tweetElements = store.tweets.map(tweetToDOM).join("")
  store.unclassifiedSection.innerHTML = tweetElements

})()

function tweetToDOM(tweet){
  return `
    <li data-state="tweet-unclassified" class="hover">
      <a href="#">
        <div class="tweet_header">
          <div class="tweet_details">
            <h6>${tweet.user}</h6>
            <span>2 hours ago</span>
          </div>
          <a class="tweet_add" href="#"><i class="far fa-edit"></i></a>
        </div>
        <div class="tweet_main">
          <p>${tweet.text}</p>
          <div class="tweet_form">
            <div class="form-group">
              <input class="form-control" type="text" placeholder="Booking Code">
            </div>
            <div class="form-group">
              <input class="form-control" type="text" placeholder="Total Odds">
            </div>
            <div class="form-group">
              <select class="custom-select">
                <option>Bookmaker</option>
                <option>Bet9ja</option>
                <option>Betking</option>
                <option>Sportybet</option>
                <option>1Xbet</option>
                <option>22bet</option>
                <option>Msport</option>	
              </select>
            </div>
          </div>
          <div class="s_img">
            ${tweet.images.map(link => "<img src='" + link + "'/>")}
          </div>
        </div>
      </a>
    </li>	
  `
}
