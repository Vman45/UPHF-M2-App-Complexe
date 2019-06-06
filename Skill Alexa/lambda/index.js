/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const welcomeMessage = "Bonjour, comment allez vous aujourd'hui ?";
const helpMessage = "êtes vous capable de me répondre ?";

// Load the Kit SDK pour JavaScript
var AWS = require('aws-sdk');

// Set the region 
AWS.config.update({region: 'us-east-1'});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });
var aws = require('aws-sdk');




function compareSlots(slots, value) {
  for (const slot in slots) {
    if (Object.prototype.hasOwnProperty.call(slots, slot) && slots[slot].value !== undefined) {
      if (slots[slot].value.toString().toLowerCase() === value.toString().toLowerCase()) {
        return true;
      }
    }
  }

  return false;
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(welcomeMessage)
      .reprompt(helpMessage)
      .getResponse();
  },
};


const reponseBien = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
        && request.intent.name === 'reponseBien';
  },
  handle(handlerInput) {
  const request = handlerInput.requestEnvelope.request;
  if(compareSlots(handlerInput.requestEnvelope.request.intent.slots, "je suis en pleine forme")) {
    return handlerInput.responseBuilder
      .speak("Vous ête en bonne santé")
      .getResponse();
  }
  else
  {
    return handlerInput.responseBuilder
      .speak("C'est cool")
      .getResponse();
  }
    
  },
};
const contact_help = "Ok, je me charge de contacter un de vos proches";
const repromptSpeech = "Le souhaitez-vous ?"
const reponseMal = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
        && request.intent.name === 'reponseMal';
  },
  handle(handlerInput) {
  const request = handlerInput.requestEnvelope.request;

    
    var eParams = {
        Destination: {
            ToAddresses: ["denovan.lampin@gmail.com"]
        },
        Message: {
            Body: {
                Text: {
                    Data: "Problème"
                }
            },
            Subject: {
                Data: "Il y a un problème"
            }
        },
        Source: "alexaistv@gmail.com"
    };

    console.log('===SENDING EMAIL===');
    var email = ses.sendEmail(eParams, function(err, data){
        if(err) console.log(err);
        else {
            console.log("===EMAIL SENT===");
            console.log(data);


            console.log("EMAIL CODE END");
            console.log('EMAIL: ', email);
            //context.succeed(event);
            

        }
    });

  return handlerInput.responseBuilder
            .speak(contact_help)
            .reprompt(repromptSpeech)
            .getResponse();
    
  },
};
const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Aide")
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};


const SKILL_NAME = 'Contrôle de santé';
const STOP_MESSAGE = 'Je vous en prie';

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    reponseBien,
    reponseMal,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
