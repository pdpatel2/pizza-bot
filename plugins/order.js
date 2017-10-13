const pizzapi = require('dominos')
var address = ''
var stores = []
var updatedStoresArr = []

module.exports = {
  init: (controller) => {
    controller.hears([/pizza/], ['direct_message', 'direct_mention'], (bot, message) => bot.createConversation(message, setUpConvo))
  }
}

function setUpConvo (err, convo) {
  convo.addQuestion('What\'s your address?', (responseObj) => {
  		address = responseObj.text
  		console.log(address)

			pizzapi.Util.findNearbyStores(address, 'Delivery', (storeData) => {
					var rawStoresArr = storeData.result.Stores
					updatedStoresArr = rawStoresArr.map(function(store) {
							return store.AddressDescription
					})
					convo.setVar('stores', updatedStoresArr)

					console.log(updatedStoresArr)
					convo.gotoThread('thread_2')
			})

			
	  },
	  {},
		'thread_1'
	)

	convo.addMessage(`Here are some nearby pizza stores: {{#vars.stores}}\r\n{{.}} {{/vars.stores}}`, 'thread_2')
	// convo.addMessage('Thanks for the address', 'thread_2')

  convo.activate()
  convo.gotoThread('thread_1')
}
