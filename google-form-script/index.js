function onSubmit() {
  const activeForm = FormApp.getActiveForm();
  const formResponses = activeForm.getResponses();
  let responseObject = {}

  // gets the latest form response
  var formResponse = formResponses[formResponses.length - 1];
  
  var itemResponses = formResponse.getItemResponses();

  
  for (var j = 0; j < itemResponses.length; j++) {
    
    var itemResponse = itemResponses[j];
    let title = itemResponse.getItem().getTitle()
    let response = itemResponse.getResponse()

    if (Array.isArray(response)) {
      Logger.log('triggered')
      response = response.toString()
    }
    
    Logger.log(title, typeof response, response)
    
    responseObject[title] = response
    
    
  }
  

  var url = "https://us-central1-dev-mutualaid.cloudfunctions.net/volunteerSignUp";
  var options = {
    "method": "get",
    "payload": responseObject
  };
  var response = UrlFetchApp.fetch(url, options);
  for(i in response) {
    Logger.log(i + ": " + response[i]);
  }
}