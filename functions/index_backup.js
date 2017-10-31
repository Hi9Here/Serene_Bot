const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
    console.log('Request headers: ' + JSON.stringify(req.headers));
    console.log('Request body: ' + JSON.stringify(req.body));
    // An action is a string used to identify what needs to be done in fulfillment
    let action = req.body.result.action;
    // Parameters are any entites that Dialogflow has extracted from the request.
    const parameters = req.body.result.parameters;
    // Contexts are objects used to track and store conversation state
    const inputContexts = req.body.result.contexts;
    // Get the request source slack/facebook/et
    const requestSource = (req.body.originalRequest) ? req.body.originalRequest.source : undefined;
    // Firestore database
    const db = admin.firestore()
    const actionHandlers = {
            'get.exercise': () => {
                const exercise = parameters['exercise_des'];
                let lengthDes = parameters['length_des'];
                // If there is no value then return the short version
                if (lengthDes === undefined) {
                    lengthDes = 'short';
                    return
                };
                console.log('value of length is', length);
                const exerciseRef = db.collection('exercises').doc(exercise);
                //get using the value using exercise Ref
                exerciseRef.get().then((exercise) => {
                    /// get right information 
                    const data = formatResponse(exercise.data().length)
                    res.json(data)
                }).catch((error) => {
                    console.log('Error is ', error);
                })
            },
            'default': () => {
                const data = formatResponse('Hi. You are an idiot')
            }
        }
        // missing action will call default function. 
    if (!actionHandlers[action]) {
        action = 'default';
    }
    // Call the handler with action type
    actionHandlers[action]();
});
/// Helper to format the response JSON object
function formatResponse(text) {
    return {
        speech: text,
        displayText: text,
        data: {},
        contextOut: [],
        source: '',
        followupEvent: {}
    }
}