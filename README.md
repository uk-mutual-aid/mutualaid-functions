# mutualaid-functions

## Up and Running

run `docker-compose up`

## Deploying to Firebase

1. Inside `src/functions/`, run `npm run deploy`
2. Then on console.cloud.google.com, go to the function page, and set the environment variable if necessary.
3. If needed, in the firestore, set the current id for volunteers in the `collections-meta` collection in firestore.

## List of Functions

`volunteerSignUp` - where the Google Form will send the form response to; will call createSignUp
`createSignUp` - creates a signUp record, then calls createVolunteer
`createVolunteer` - creates a volunteer document



