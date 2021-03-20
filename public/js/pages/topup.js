const store = {
  topUpButton: document.querySelector(".topup-button"),
  amountInput: document.querySelector(".amount")
}

;(function attachEvents(){

  addEvent([store.topUpButton], "click", pay)  
  addEvent([store.amountInput], "focus, change", () => {
    hideAlert(".alert-danger")
    hideAlert(".alert-success")
  })

})()

const button = createButton(".topup-button", "Top Up", "Updating...")

function pay(event){

  event.preventDefault()

  button()

  const amount = Number(store.amountInput.value)

  if(isNaN(amount))
    return showAlert(".alert-danger", "Please complete the form")
  
  if(amount <= 0)
    return showAlert(".alert-danger", "Please enter a valid amount")

  api("/wallet/fund", { amount, token: getToken()})
    .then(startPaystack)
    
  function startPaystack(response){

    if(response.status != 200)
      return showAlert("Something went wrong, please try again later or contact support")

    const handler = PaystackPop.setup({
      key: "pk_test_a902c60eb9b840d5b92be19e20ab9bcf97151682",
      email: "iammadab@gmail.com",
      amount: amount * 100,
      ref: response.data._id,
      onClose: function(event){
        // Cancel the transaction
        console.log("It closed", event)
        api("/wallet/cancel", { transactionId: response.data._id, token: getToken() })
          .then(r => {
            if(r.status == 200){
              button("normal")
              return showAlert(".alert-success", "Transaction cancelled")
            }
          })
      },

      callback: function(response){

        console.log(response)

        // Wait for 3 seconds then redirect to the home page
        setTimeout(() => {
          let toRedirect = "/home", params = new URLSearchParams(window.location.search)
          toRedirect = params.get("from") ? params.get("from") : toRedirect
          redirect(toRedirect)
        }, 3000)

      }

    })

    handler.openIframe()

  }

}
