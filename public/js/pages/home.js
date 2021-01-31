const store = {
  loading: false,
  moreButton: document.querySelector(".showmore"),
  tips: document.querySelector("ul.tips")
}

;(function attachEvents(){
  addEvent([store.moreButton], "click", loadPosts)
})()

const loadingButton = createButton(".showmore", "SHOW MORE", "Loading...")

function loadPosts(){

  if(store.loading) return


  store.loading = true

  const lastTip = store.tips.lastElementChild
  
  const id = lastTip ? lastTip.dataset.id : ""

  if(!id)
    return store.loading = false

  loadingButton()

  api(`/post?lastId=${id}`)
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
            <img src="${post.tipster.image}" alt="${post.tipster.name}" />
            <div class="t_details">
              <h6>${post.tipster.name}</h6>
              <span>${post.tipDate}</span>
            </div>
          </div>

          <div class="t_main">
            <p>${post.description} ${post.tipDate}</p>
            <div class="t_info">
              <i class="far fa-bookmark"></i> ${post.odds} <span>Odds</span>
            </div>
            <div class="t_info">
              <i class="far fa-comment-alt"></i>${post.comments}<span>Discussions</span>
            </div>
          </div>

        </a>
     </li>
    `
  }


}
