F1 Difficulty Calculator
https://f1-difficulty-calculator.herokuapp.com

Goal: This application allows a user to input a laptime that they have set in a time trial in the F1 22 Game at a given circuit and it will display and save the ai difficulty associated with that laptime. This is to help users understand what ai difficulty they should be playing at. The average across all circuits is also shown and there is no difference between the map and list page, just preference.

Challenges: I faced many challenges throughout the creation of this app. The largest and continous challenge was passing data between different pages and languages. Passing data from the server, to js, to ejs, to css. This proved very challenging, and to be honest, a bit janky at some points, but it works. Some other challenges were the map page, and getting authentication the first time, the rest were easy.


Authentication: I have 3 types of authentication. Google, GitHub and username and password. I chose Google because it's so common to have a Google account. I chose GitHub because the assignment said so. I also made a username and password for ease of use, and Im not saving anything very sensitive so an account can be created very easily.

CSS Framework: I used TailwindCSS with DaisyUI because I am familiar with Tailwind and a friend recommended DaisyUI. I started with Material Tailwind, but it was not great, and my experience with DaisyUI is infinitely better. There are many more components, as well as they have themes. As for Tailwind, as I said I have used it before, and I know it's very popular. The website that gave me the inspiration for this actually uses Tailwind.

Custom CSS: The only custom CSS I ended up doing was just for what Im calling the parallax effect on the background image.

Middleware: For middleware, I used serve-favicon to cache the favicon, body-parser parses the body of the request so I can have req.body, express-session to parse cookies, express.static I used twice to serve files from the server, passport.initialize to initialize passport, passport.session which also parses the cookies, and my own custom that redirects the user or lack there of, to the appropriate page if they dont have access to the page they are trying to reach. For example, if you are not signed in, you cannot go to /map, /list, /calculator or any file in the protected folder, and vice versa is true. If you are signed in, you cannot access /login.

Technical Achievements
OAuth: I used OAuth authentication via the GitHub strategy, Google, and my own custom one (Local Strategy)
Heroku: I am hosting my app on Heroku
Lighthouse: My login page gets all 100s, as for the rest I didn't bother, so probably not
