const store = {
  
  // Tweet containers
  unclassifiedSection: document.querySelector("#tweet > .tweets"),
  tipSection: document.querySelector("#tip > .tweets"),
  
  // Section counts
  unclassifiedCount: document.querySelector(".unclassified-count"),
  tipCount: document.querySelector(".tip-count"),

  // Data
  tweets: {},
  nottips: [],
  tips: []

}

;(async function loadTweets(){
  
  const res = await fetch("/api/tweet/status/unclassified").then(res => res.json())

  if(res.status != 200)
    alert("Failed to load tweets, reload or contact support")

  store.tweets = objArrayToHashMap(res.data, "_id")
  store.nottips = Object.keys(store.tweets)

  // Convert all the unclassified tweet ids to tweet elements
  // and insert into the dom
  const tweetElements = store.nottipElements = store.nottips.map(idToTweetElement).join("")
  store.unclassifiedSection.innerHTML = tweetElements

  updateCount()
  attachEvents()

})()

function attachEvents(){
  const nottipElements = Array.from(document.querySelectorAll("[data-state=tweet-unclassified]"))
  nottipElements.forEach(elem => {
    elem.addEventListener("click", (event) => {
      moveTweet(elem)
    })
  })

  const clearTweetsButton = document.querySelector(".clear-tweets")
  clearTweetsButton.onclick = clearNottips
}

function moveTweet(elem){
  
  const states = {
    "tweet-unclassified": {
      sectionIds: store.nottips,
      otherSectionIds: store.tips,
      otherSectionContainer: store.tipSection,
      otherSectionState: "tweet-tip",
    },
    "tweet-tip": {
      sectionIds: store.tips,
      otherSectionIds: store.nottips,
      otherSectionContainer: store.unclassifiedSection,
      otherSectionState: "tweet-unclassified"
    }
  }

  const { state, id } = elem.dataset
  const { sectionIds, otherSectionIds, otherSectionContainer, otherSectionState } = 
    states[state]
  
  // Remove the id from the current section
  const index = sectionIds.indexOf(id)
  if(index == -1)
    // The id does not belong to the current section
    // Integrity is lost, don't do anything
    return

  sectionIds.splice(index, 1) // Actually removes the id


  // Add the id to the other section
  otherSectionIds.push(id)

  // Update the element and actually move it
  elem.dataset.state = otherSectionState
  otherSectionContainer.appendChild(elem)

  // Update the count
  updateCount()

}

function updateCount(){
  store.unclassifiedCount.innerText = store.nottips.length
  store.tipCount.innerText = store.tips.length
}


function idToTweetElement(tweetId){
  if(!store.tweets[tweetId]) return ""
  return tweetToDOM(store.tweets[tweetId])
}

function tweetToDOM(tweet){
  return `
    <li data-state="tweet-unclassified" data-id="${tweet._id}" class="hover">
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

function objArrayToHashMap(array, prop){
  const result = {}
  array.forEach(elem => {
    result[elem[prop]] = elem
  })
  return result
}








async function clearNottips(event){
  
  const clearButton = createButton(".clear-tweets", "Clear Tweets", "Clearing...")
  clearButton()

  const res = await api("/tweet/classify/nottip", {
    ids: store.nottips
  })

  if(res.status == 200){
    clearNode(store.unclassifiedSection)
    store.nottips = []
    updateCount()
  }

  clearButton("normal")
  
}

function clearNode(elem){
  if(!elem) return
  while(elem.firstChild){
    elem.firstChild.remove()
  }
}
