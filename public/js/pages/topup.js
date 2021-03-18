const store = {
  topUpButton: document.querySelector(".topup-button"),
  amountInput: document.querySelector(".amount")
}

;(function attachEvents(){

  addEvent([store.topUpButton], "click", pay)  

})()

function pay(event){

  event.preventDefault()
    
  const handler = PaystackPop.setup({
    key: "pk_test_a902c60eb9b840d5b92be19e20ab9bcf97151682",
    email: "iammadab@gmail.com",
    amount: Number(store.amountInput.value) * 100,
    // transaction id ref:
    onClose: function(event){
      console.log("It closed", event)
    },
    callback: function(response){
      console.log("It worked")
      console.log(response)
    }
  })

  handler.openIframe()

}
