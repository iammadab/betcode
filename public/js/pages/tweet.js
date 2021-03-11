const store = {
  
  // Tweet containers
  unclassifiedSection: document.querySelector("#tweet > .tweets"),
  potentialTipSection: document.querySelector("#ptip > .tweets"),
  tipSection: document.querySelector("#tip > .tweets"),
  
  // Section counts
  unclassifiedCount: document.querySelector(".unclassified-count"),
  potentialTipCount: document.querySelector(".potential-count"),
  tipCount: document.querySelector(".tip-count"),

  // Data
  tweets: {},
  nottips: [],
  ptips: [], // Potential tips
  tips: [],

  // Dom data
  elements: []

}

;(async function loadTweets(){

  // First we load up all the unclassified tips
  // Fetch all the unclassified tips
  const unclassifiedTips = await fetch("/api/tweet/status/unclassified").then(res => res.json())

  if(unclassifiedTips.status != 200)
    alert("Failed to load tweets, reload or contact support")

  store.tweets = objArrayToHashMap(unclassifiedTips.data, "_id")
  store.nottips = Object.keys(store.tweets)

  // Convert all the unclassified tweet ids to tweet elements
  // and insert into the dom
  const tweetElements = store.nottips.map(idToTweetElement).join("")
  store.unclassifiedSection.innerHTML = tweetElements



  // Next we load up all the tips
  // Fetch all the tips
  const tips = await fetch("/api/tweet/status/tip").then(res => res.json())
  if(tips.status != 200)
    alert("Failed to load tips, reload or contact support")

  const tipObjs = objArrayToHashMap(tips.data, "_id")
  store.tweets = Object.assign({}, store.tweets, tipObjs)
  store.tips = Object.keys(tipObjs)

  // Convert all the tips to tweet elements
  const tipElements = store.tips.map(idToTipElement).join("")
  store.tipSection.innerHTML = tipElements



  // Gather all the tweet dom elements
  store.elements = Array.from(document.querySelectorAll(
      "[data-state=tweet-unclassified], [data-state=tweet-ptip], [data-state=tweet-tip]"
    ))
  store.elements = objArrayToHashMap(store.elements, "dataset", "id")

  // Remember the potential tips
  let ptipsIds = window.localStorage.getItem("ptips")
  if(ptipsIds){
    ptipsIds = JSON.parse(ptipsIds)
    ptipsIds.forEach(id => {
      const elem = store.elements[id]
      if(elem)
        moveTweet(elem)
    })
  }

  updateCount()
  attachEvents()

})()

function attachEvents(){
  const nottipElements = Array.from(
    document.querySelectorAll(
       "[data-state=tweet-unclassified], [data-state=tweet-ptip]"
    )
  )
  nottipElements.forEach(elem => {
    elem.addEventListener("click", (event) => {
      moveTweet(elem)
    })
  })

  const clearTweetsButton = document.querySelector(".clear-tweets")
  clearTweetsButton.onclick = clearNottips

  const allTipsButton = document.querySelector(".all-tips")
  allTipsButton.onclick = makeAllTips

  const allPostsButton = document.querySelector(".all-posts")
  allPostsButton.onclick = makeAllPosts

  const addFormButtons = Array.from(document.querySelectorAll(".tweet_add"))
  addFormButtons.forEach(elem => {
    elem.addEventListener("click", event => { 
      const id = elem.dataset.id
      const container = document.querySelector(`.form-container[data-id='${id}']`)
      container.insertAdjacentHTML("beforeend", makePostForm(id))
    })
  })
}

function moveTweet(elem){
  
  const states = {
    "tweet-unclassified": {
      sectionIds: store.nottips,
      otherSectionIds: store.ptips,
      otherSectionContainer: store.potentialTipSection,
      otherSectionState: "tweet-ptip",
    },
    "tweet-ptip": {
      sectionIds: store.ptips,
      otherSectionIds: store.nottips,
      otherSectionContainer: store.unclassifiedSection,
      otherSectionState: "tweet-unclassified"
    }
  }

  const { state, id } = elem.dataset

  // Don't move tip if not in the required state
  if(!states[state])
    return

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
  
  // Update the ptips store
  updateStore("ptips", store.ptips)

  // Update the element and actually move it
  elem.dataset.state = otherSectionState
  otherSectionContainer.appendChild(elem)

  // Update the count
  updateCount()

}

function updateCount(){
  store.unclassifiedCount.innerText = store.nottips.length
  store.potentialTipCount.innerText = store.ptips.length,
  store.tipCount.innerText = store.tips.length
}


function idToTweetElement(tweetId){
  if(!store.tweets[tweetId]) return ""
  return tweetToDOM(store.tweets[tweetId])
}

function idToTipElement(tweetId){
  if(!store.tweets[tweetId]) return ""
  return tweetToDOM(store.tweets[tweetId], "tweet-tip")
}

function tweetToDOM(tweet, state="tweet-unclassified"){
  return `
    <li data-state="${state}" data-id="${tweet._id}" class="hover">
      <a href="#">
        <div class="tweet_header">
          <div class="tweet_details">
            <h6>${tweet.user}</h6>
            <span>2 hours ago</span>
          </div>
            <span data-id="${tweet._id}" class="tweet_add"><i class="far fa-edit"></i></span>
        </div>
        <div class="tweet_main">
          <p>${tweet.text}</p>
          <div data-id="${tweet._id}" class="form-container">
            ${makePostForm(tweet._id)}
          </div>
          <div class="s_img">
            ${tweet.images.map(link => "<img src='" + link + "'/>")}
          </div>
        </div>
      </a>
    </li>	
  `
}

function makePostForm(id){
  return `
  <div data-id="${id}" class="tweet_form">
    <div class="form-group">
      <input class="form-control booking-code" type="text" placeholder="Booking Code">
    </div>
    <div class="form-group">
      <input class="form-control odds" type="text" placeholder="Total Odds">
    </div>
    <div class="form-group">
      <select class="custom-select bookmaker">
        <option value="">Bookmaker</option>
        <option>Bet9ja</option>
        <option>Betking</option>
        <option>Sportybet</option>
        <option>1Xbet</option>
        <option>22bet</option>
        <option>Msport</option>	
      </select>
    </div>
  </div>
  `
}

function objArrayToHashMap(array, ...props){
  const result = {}
  array.forEach(elem => {
    let value = elem
    for(prop of props){
      value = value[prop]
      if(value == undefined)
        break
    }
    if(value)
      result[value] = elem
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
  moveToTab("#ptip")
  
}

async function makeAllTips(event){
  
  const allTipsButton = createButton(".all-tips", "All Tips", "Making tips...")
  allTipsButton()

  const res = await api("/tweet/classify/tip", {
    ids: store.ptips
  })

  if(res.status == 200){
    // Move all the tips to the tip sections
    res.data.forEach(id => {
      const elem = store.elements[id]
      if(elem){
        // Change the state of the element
        elem.dataset.state = "tweet-tip" 

        store.tips.push(id)
        store.tipSection.appendChild(elem)
      }
    })

    store.ptips = []
    updateStore("ptips", store.ptips)
    updateCount()
  }

  allTipsButton("normal")
  moveToTab("#tip")

}


async function makeAllPosts(event){
  // Get all the dom elements for post
  // For each element, we want to convert it to an object representing the post data
  // For each of those post data, make a create post api call and classify the post as a tip

  const postElements = Array.from(document.querySelectorAll("[data-state='tweet-tip'] .tweet_form"))
  const postsData = postElements.map(makePostData).filter(a => a)

  postsData.forEach(async (data) => {
    const response = await api("/post", data).catch(console.log)

    // If successful, remove from dom
    // remove from tip id array
    // update count
    if(response.status == 200){
      store.elements[data.tweet].remove() 
      removeFromArray(store.tips, data.tweet)
      updateCount()
    }
  })

}

function makePostData(postElement){
  const id = postElement.dataset.id
  const code = postElement.querySelector(".booking-code").value
  const odds = postElement.querySelector(".odds").value
  const bookmaker = postElement.querySelector(".bookmaker").value

  if(!code || !odds || !bookmaker)
    return null

  const tweet = store.tweets[id]

  const imageObj = {}

  for(let i = 0; i < tweet.images.length; i++){
    const index = i == 0 ? "" : i
    imageObj[`image${index}`] = tweet.images[i]
  }

  return {
    tipster: tweet.user,
    tweet: id,
    description: tweet.text,
    odds,
    bookmakers: {
      [bookmaker]: code
    },
    ...imageObj
  }

}

function clearNode(elem){
  if(!elem) return
  while(elem.firstChild){
    elem.firstChild.remove()
  }
}

function removeFromArray(array, elem){
  const index = array.indexOf(elem)
  if(index > -1)
    array.splice(index, 1)
}

function moveToTab(tabId){
  const currentTabHeader = document.querySelector(`.nav-link.active`)
  if(currentTabHeader) currentTabHeader.classList.remove("active")

  const currentTabSection = document.querySelector(".tab-pane.active")
  if(currentTabSection) currentTabSection.classList.remove("active")

  const newTabHeader = document.querySelector(`[href='${tabId}']`)
  newTabHeader.classList.add("active")

  const newTabSection = document.querySelector(tabId)
  newTabSection.classList.add("active")
}

function updateStore(name, value){
  window.localStorage.setItem(name, JSON.stringify(value))
}
