# Online-learning-platform
![](Front-end/src/assets/github-cover.png)


1. Clone the repository or download the zip file to your local machine.
2. Open the project folder in VS Code.
3. Open the terminal in VS Code.
4. Check you have installed node and npm by running:
```
node -v
npm -v
```
5. Navigate to the Back-end folder and run:
``` 
npm install  
```
6. Create .env file.



------------How to Run Your Server-------------

1. Replace the following .env file with your own configuration
```
DB_USER="chalindunisal1998"
DB_PASS="yyT3ugq12wJRc6cK"
ACCESS_SECRET="1e6b54599037a99bb19a44274c966d18b866e2a6c804a3a698fdcfc33dec919fa3602456affe6862f959571c45ab7f06349d0a0d76d65711924a9a341a1d0d27"
PAYMENT_SECRET="sk_test_51OpBUKCmx8hfkpYcz4XfQM6KG8ubeG5dlCKTMxEDjoYZPriKDCeraZNfMHuuERMR2heRDC7xP8dqRuEvDkP4mg2w00ICy7xTzU"
```
To get DB-USER and DB_PASS, you need to go to mongodb.com . Then:
 - create an account
 - create a project(database) 
 - setup the database access and network access
 - deploy your database
 - get the username and pass key.

To get the ACCESS_SECRET, command this:
```
$ node
> require('crypto').randomBytes(64).toString('hex')
```
To get PAYMENT_SECRET, you need to go to stripe.com
 - create an account
 - API key for developers
 - Publishable key (for frontend)
 - Secret key (for backend)


2. To run server locally, you need to command this:
```
npm start
```

3. Create a git repository and push your code on github.com



--------------How to Run Your Client Site/frontend----------

1. Naviagte to Front-end folder and run:
 ``` 
npm install  
```
2. Create  .env.local file
3. Replace the following .env.local file with your own configuration
```
----firebase.init.js file ----

VITE_API_KEY=AIzaSyCZfbxqsit7um5co-FHuvWKX6aO5ARMb-I
VITE_AUTH_DOMAIN=music-cons.firebaseapp.com
VITE_PROJECT_ID=music-cons
VITE_STORAGE_BUCKET=music-cons.appspot.com
VITE_MESSAGING_SENDER_ID=224145904923
VITE_APP_ID=1:224145904923:web:af37627e05613beccf2fbe

---------*****--------
-----ImgBB Website API Key ------

VITE_IMG_TOKEN=14a62cf212b70a050602641edfd090f1

---------*****--------

-----Stripe Secret API Key ------

VITE_STRIPE=pk_test_51OpBUKCmx8hfkpYcu8oQ4qCneGyIcsId88zNDx3FTxDKU1QLJ7MWkSKiHtp8yTq6RgmgJZSRzmyHmbF6nK7uHqrZ00Dy8FF8dA
```
- Firebase website (For authentication process - login/sign-in)
    - Create an account
    - Define a project
    - Find the API key
    - Setup the sign-in methods
        - Enable google login and email/password

- Imgbb.com website (For image uploading process)
    - Sign-in
    - Get API key

- stripe.com website (For run as web app)
    - Obtained at previous step in backend setup
    - Publishable key

4. To run server locally, you need to command this:
```
npm run dev
```

4. Create a git repository and push your code on github.com

5. Use Render or Vercel to deploy your application. 
    - render.com
        - Create an account
        - Create a new web service
        - Connect to github repository (backend repository)
        - Upload the environment variables
        - Get the URL where your app is running

    - vercel.com (For the vercel app)
        - Create an account
        - Connect to github repository (frontend repository)
        - Upload the environment variables
        - Deployment

6. Replace the render URL with your local base URL in Front-end scripts.


References and inspired by: 

(https://github.com/mdalmamunit427/yoga-master-server)
(https://github.com/mdalmamunit427/yoga-master-client-starter-file)

