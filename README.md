a Results functionality which shows all data associated with a logged in user (except passwords)
a Form/Entry functionality which allows users to add, modify, and delete data items (must be all three!) associated with their user name / account.
Use of at least five Express middleware packages. Explore! One of these five middleware can be a custom function that you write yourself; if you choose to do this, make sure to describe what this function is in your README.
Persistent data storage in between server sessions using mongodb

HTML:

HTML input tags and form fields of various flavors (<textarea>, <input>, checkboxes, radio buttons etc.)
HTML that can display all data for a particular authenticated user. Note that this is different from the last assignnment, which required the display of all data in memory on the server.
Note that it might make sense to have two pages for this assignment, one that handles login / authentication, and one that contains the rest of your application. For example, when visiting the home page for the assignment, users could be presented with a login form. After submitting the login form, if the login is successful, they are taken to the main application. If they fail, they are sent back to the login to try again. For this assignment, it is acceptable to simply create new user accounts upon login if none exist, however, you must alert your users to this fact.

Node.js:

A server using Express, at least five pieces of Express middleware, and a persistent database (mongodb).
General:

Your site should achieve at least 90% on the Performance, Best Practices, Accessibility, and SEO tests using Google Lighthouse (don't worry about the PWA test, and don't worry about scores for mobile devices). Test early and often so that fixing problems doesn't lead to suffering at the end of the assignment.
Deliverables
Do the following to complete this assignment:

Implement your project with the above requirements. A good potential starting point is to use the "hello-express" project template inside of Glitch; this appears as an option when you hit the "New Project" button. Use the work you did in the last assignment as a reference to implement functionality.
If you developed your project locally, deploy your project to Glitch (unless completing the alternative server technical acheivement described below), and fill in the appropriate fields in your package.json file.
Test your project to make sure that when someone goes to your main page on Glitch, it displays correctly.
Ensure that your project has the proper naming scheme a3-yourfirstname-yourlastname so we can find it.
Fork this repository and modify the README to the specifications below.
Create and submit a Pull Request to the original repo. Name the pull request using the following template: a3-firstname-lastname.
Acheivements
Below are suggested technical and design achievements. You can use these to help boost your grade up to an A and customize the assignment to your personal interests, for a maximum twenty additional points and a maximum grade of a 100%. These are recommended acheivements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README, why it was challenging, and how many points you think the achievement should be worth. ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM.

Technical

(10 points) Implement OAuth authentication, perhaps with a library like passport.js. You must either use Github authenticaion or provide a username/password to access a dummy account. Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment. Please contact the course staff if you have any questions about this. THIS IS THE HARDEST ACHEIVEMENT OFFERED IN WEBWARE. You have been warned!
(5 points) Instead of Glitch, host your site on a different service like Heroku or Digital Ocean. Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse?
(5 points) Get 100% (not 98%, not 99%, but 100%) in all four lighthouse tests required for this assignment.
Design/UX

(10 points) Make your site accessible using the resources and hints available from the W3C, Implement/follow twelve tips from their tips for writing, tips for designing, and tips for development. Note that all twelve must require active work on your part. For example, even though your page will most likely not have a captcha, you don't get this as one of your twelve tips to follow because you're effectively getting it "for free" without having to actively change anything about your site. Contact the course staff if you have any questions about what qualifies and doesn't qualify in this regard. List each tip that you followed and describe what you did to follow it in your site.
(5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings. Which element received the most emphasis (contrast) on each page? How did you use proximity to organize the visual information on your page? What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site? How did you use alignment to organize information and/or increase contrast for particular elements. Write a paragraph of at least 125 words for each of four principles (four paragraphs, 500 words in total).
Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
Your Web Application Title
your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

the goal of the application
challenges you faced in realizing the application
what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
what CSS framework you used and why
include any modifications to the CSS framework you made via custom CSS you authored
the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for one (and one alone) middleware please add a little more detail about what it does.
Technical Achievements
Tech Achievement 1: I used OAuth authentication via the GitHub strategy
Design/Evaluation Achievements
Design Achievement 1: I followed the following tips from the W3C Web Accessibility Initiative...