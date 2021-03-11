const store = {
  loading: false,
  moreButton: document.querySelector(".showmore.tips"),
  tips: document.querySelector("ul.tips"),
  tipsters: Array.from(document.querySelectorAll(".tipster-tag")),
  bookmakerDropDownDisplay: document.querySelector(".bookmaker-display"),
  oddsDropDownDisplay: document.querySelector(".odds-display"),
  filter: {
    tipster: "",
    bookmaker: "",
    minOdds: "",
    maxOdds: ""
  }
}

;(function attachEvents(){
  addEvent([store.moreButton], "click", loadPosts)
  addEvent(store.tipsters, "click", filterTipster)
  
  // Bookmaker dropdown
  const bookmakerDropDownElements = Array.from(document.querySelectorAll(".dropdown-item.bookmaker"))
  addEvent(bookmakerDropDownElements, "click", filterBookmaker)

  // Odds dropdown
  const oddsDropDownElements = Array.from(document.querySelectorAll(".dropdown-item.odds"))
  addEvent(oddsDropDownElements, "click", filterOdds)

   
})()

const loadingButton = createButton(".showmore.tips", "SHOW MORE TIPS", "Loading...")

function loadPosts(){

  if(store.loading) return


  store.loading = true

  const lastTip = store.tips.lastElementChild
  console.log(store.tips)
  console.log(lastTip)
  
  const id = lastTip ? lastTip.dataset.id : ""

  if(!id)
    return store.loading = false

  loadingButton()

  api(generatePostUrl(id))
    .then(handleNewPosts)
    .catch(handleError)

  function handleNewPosts(posts){
    posts.data.forEach(post => {
      store.tips.insertAdjacentHTML("beforeend", buildElement(post))
    }) 
    store.loading = false
    loadingButton("normal")
  }

  function handleError(){
    store.loading = false
    loadingButton("normal")
  }

  function buildElement(post){
    return `
     <li data-id="${post._id}" class="hover">
        <a href="/tip/${post._id}">

          <div class="t_header">
            <img src="${post.tipster.picture}" alt="${post.tipster.username}" />
            <div class="t_details">
              <h6>${post.tipster.username}</h6>
              <span>${post.tipDate}</span>
            </div>
          </div>

          <div class="t_main">
            <p>${post.description}</p>
            <div class="t_info">
              <i class="far fa-bookmark"></i> <span>Odds</span> (${post.odds}) 
            </div>
            <div class="t_info">
              <i class="far fa-comment-alt"></i><span>Discussions</span>(${post.comments})
            </div>
          </div>

        </a>
     </li>
    `
  }

}

function filterTipster(event, element){

  const tipsterId = element.dataset.id
  store.filter.tipster = tipsterId

  // Make element active
  // Remove current active
  const currentActive = document.querySelector(".tipster-tag.active")
  if(currentActive)
    currentActive.classList.remove("active")

  // Add to the clicked element
  element.classList.add("active")

}

function filterBookmaker(event, element){
  const bookmaker = element.innerText
  store.bookmakerDropDownDisplay.innerText = bookmaker == "All" ? "Bookmaker" : bookmaker
  store.filter.bookmaker = bookmaker == "All" ? "" : bookmaker
}

function filterOdds(event, element){
  
  const odds = element.innerText
  store.oddsDropDownDisplay.innerText = odds == "All" ? "Odds" : odds

  store.filter.minOdds = element.dataset.minodds
  store.filter.maxOdds = element.dataset.maxodds

}

function generatePostUrl(lastId = ""){
  // Based on the filter and the last id
  // Generate the appropriate post fetch url
 
  const paginationQuery = lastId ? `lastId=${lastId}&` : ""
  const tipsterQuery = store.filter.tipster ? `tipster=${store.filter.tipster}&` : ""
  const bookmakerQuery = store.filter.bookmaker ? `bookmaker=${store.filter.bookmaker}&` : ""
  const minOddsQuery = store.filter.minOdds ? `minOdds=${store.filter.minOdds}&` : ""
  const maxOddsQuery = store.filter.maxOdds ? `maxOdds=${store.filter.maxOdds}&` : ""

  const url = `/post?${paginationQuery}${tipsterQuery}${bookmakerQuery}${minOddsQuery}${maxOddsQuery}`

  return url

}
