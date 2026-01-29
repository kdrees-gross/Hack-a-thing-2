# Hack-a-thing-2
## Klara Drees-Gross
### CS 98, Winter 2026

## 1) What I Built

### a) Relation To Project Idea

As of now, our idea for the CS98 project is an app that will allow Dartmouth community members to advertise tasks they need assistance with and match students with these jobs. I decided to make a basic version of this app using React Native, in which users can sign up as either “workers” (signing up for tasks) or “posters” (offering a job).

I decided to work individually on this assignment as I have never coded an iOS app before, so I wanted the experience of learning how to do this before launching into a mobile app build with the rest of my group. In addition to learning the fundamentals of setting up a mobile app, I was forced to think about aspects of our CS98 project that hadn’t occurred to me yet. For instance:
* What happens if multiple people apply for the same job?
* Can a job accept multiple workers?
* What happens if a job expires (the time it was offered for passes)? Should it still be displayed, and if so, how should it look?
* How should we notify workers that they have not been selected for a job?

I made decisions regarding these questions for my hack-a-thing-2, but I will need to discuss them with the group for our actual project.

Setting up this marketplace app was a very thought-provoking and educational project. You can read more about what I learned below.

### b) Technologies
The frontend of my project is built using ReactNative (to build an iOS mobile app) and Expo Router (to manage navigation between screens on my app). The backend uses Express.js (a Node.js framework) to set up the server and JWT (JSON Web Tokens) for user authentication. The code is in TypeScript.

### c) App Structure
On the landing page, you can opt to either login or sign up. You are then redirected to a Login or Sign Up page; if it’s Sign Up, you will be prompted to select a user type (Worker or Poster) in addition to setting credentials. If you log into the app as a Worker, you see two pages: Available Jobs (where you can browse and apply) and Profile (where you set your availability and see the status of jobs you have applied to). If you log into the app as a Poster, you also see two pages: Post Job (where you create a new listing) and My Posted Jobs (where you view and approve applications).

### d) Features

**Username and password validation**
* Passwords must be at least 8 characters long and a mix of letters and numbers
* User receives an error message if the password does not meet this requirement, or if the chosen username already exists

**Job posting**
* Posters can create a job (with a title, description, location, pay, date, start/end times)
* Data validation here includes making sure the pay is positive, and that present < start time < end time
* Posters select times from a 15 minute interval dropdown
* Posters can also delete jobs

**Job browsing**
* Workers can view all _available_ jobs (not positions that are filled or expired)
* You can sort jobs by Newest or Oldest
* You can add a filter to show only jobs that match your availability

**Availability matching**
* Workers set weekly availability time blocks
* Data validation: start time < end time
* Workers can then display jobs that fit their schedule, or show all jobs but with a special tag for the matching ones

**Data flow**
* Worker applies to job from list page, and sees pending applications in profile (yellow if pending, red if position filled)
* Poster views applications to the job they have posted, can approve worker applications (only 1 per job), and see all applicant statuses (pending/approved)
* Workers can then see the approved jobs in their profile (green background)

### e) Process
I started by setting up a bare-bones app that just had frontend. Once I had the right pages and buttons and could navigate between them, I added job features and the availability toggle. Then I connected the frontend to a server, which allowed me to store user data and test functionality. I added requirements for unique usernames and strong passwords.

Once all this core functionality was set up, I spent a fair amount of time testing different edge cases and working on data validation (expired jobs, multiple applications, valid dates and times, etc). I also spent a lot of time revising the app’s UI to make the content more digestible and visually appealing: image background on landing page, gradient backgrounds on different pages, color coded job statuses, etc.

## 2) How To Run My Code
To run my code, open two terminals. In one terminal, cd to the “backend” folder and run the command: “npm run dev”. In the other terminal, cd to the “myApp” folder (this is the frontend) and run the command: “npx expo start”. Then press the key “i” to open the project in the iOS simulator. Now you can interact with the native iOS app locally via the simulator. 

## 3) What I Learned
First, this activity reinforced the practical coding skills I developed while working on hack-a-thing-1. Before this term, I had never done full-stack web development; now I feel comfortable setting up frontend and backend and understand how data flows between the two. I have now worked on two projects that store user profiles and allow information sharing between users; hack-a-thing-2 is more complex than the first project though, as there are different types of users and interactions between them. Like hack-a-thing-1, this project made me more comfortable using the Claude extension in VS code. I also refamiliarized myself with Git commands. Before this activity I had not used GitHub for a solo project; this assignment encouraged me to use different branches for different features, making my work cleaner and safer.

From a technical standpoint, I discovered how to set up an iOS app for the first time, and picked up commands like “i” and “r” to dynamically refresh the native iOS app locally via the simulator. I played around with the Expo Router file- and folder-based router to manage navigation between screens on my app. On the backend side, I became comfortable using Express.js for in-memory storage (data is stored in the app’s short term RAM rather than a permanent database) and read about the pros and cons of this storage approach (pros: speed, cons: risk of data loss if server fails, memory limits, not scalable).

Finally, designing this app emphasized for me the need for really detailed product specifications when coding a group project. In this activity, I realized how many decisions go into just a simple app like mine: even choices of buttons, orderings, and display filters change how a user experiences an app. For our final project, we will need to have a very clear approval process for making minor but client-facing decisions like these.

## 4) What Went Well & What Didn't
I really enjoyed working on the functionality and features aspect of this project. The navigation pages, job filtering and sorting, and availability matching were all very interesting to me. I also enjoyed testing the app with sample users and considering what the most compelling visuals would be (ex. ordering jobs by newest, prioritizing matches, greying out expired jobs, etc). It was neat to thing about edge cases as well and try to break my own app in order to identify weak spots or gaps in the logic. The iOS simulator made it very easy for me to test that the job requests and approvals were flowing correctly.

In terms of what didn’t go as well, I was not entirely satisfied with Claude for working with the app’s visuals and design. I often had to go back and forth with endless prompts to get the layout I wanted for a given page. I also struggled to upload all the images I had hoped to use as backgrounds; for some reason, only the landing page image was loading. I decided to go with a gradient background for the rest of the app and prioritize my time elsewhere, working on content rather than display.

## 5) Sources
I referenced this react tutorial ([Building a React Native app - #1 Setting up your first iOS React Native app](https://www.youtube.com/watch?v=fC3paZUTUHk)) and the website https://reactnative.dev/docs/getting-started to get React Native set up on my laptop. I also followed these instructions to ensure I had installed the Claude design plugin on my repo: https://kasata.medium.com/how-to-install-and-use-frontend-design-claude-code-plugin-a-step-by-step-guide-0917d933cc6a.

I used Dartmouth ChatGPT to help set up my laptop with ReactNative and XCode, and to get the frontend of my app running. I also referenced Chat throughout the project for Github guidance. After the basic structure of my app was set up, I found it most useful to use the Claude Extension for VS code, which guided me through the use of previously unfamiliar software and made requested edits directly to my files.

## 6) Screenshots

<img width="300" alt="Simulator Screenshot - iPhone 17 Pro - 2026-01-28 at 23 04 23" src="https://github.com/user-attachments/assets/a3f52236-d0fb-4487-8124-0ea7e84056d8" />

<img width="300" alt="Simulator Screenshot - iPhone 17 Pro - 2026-01-28 at 23 05 06" src="https://github.com/user-attachments/assets/a5db73c9-25e9-410a-bf49-5a2e1ab75f7f" />

<img width="300" alt="Simulator Screenshot - iPhone 17 Pro - 2026-01-28 at 23 06 06" src="https://github.com/user-attachments/assets/7c36c6d4-167a-4420-af6e-9783967977b2" />

<img width="300" alt="Simulator Screenshot - iPhone 17 Pro - 2026-01-28 at 23 07 13" src="https://github.com/user-attachments/assets/34405680-a082-415e-b408-2648d9427241" />

<img width="300" alt="Simulator Screenshot - iPhone 17 Pro - 2026-01-28 at 23 09 15" src="https://github.com/user-attachments/assets/c45b4367-755c-4ea8-9835-620d136e12d3" />

<img width="300" alt="Simulator Screenshot - iPhone 17 Pro - 2026-01-28 at 23 09 43" src="https://github.com/user-attachments/assets/24c6fe4c-4339-4836-825d-9fdab02d2951" />

<img width="300" alt="Simulator Screenshot - iPhone 17 Pro - 2026-01-28 at 23 10 15" src="https://github.com/user-attachments/assets/74c19de8-6157-4fe8-8d57-47620ef5f9da" />

<img width="300" alt="Simulator Screenshot - iPhone 17 Pro - 2026-01-28 at 23 10 19" src="https://github.com/user-attachments/assets/af23e864-b5d3-466d-89d1-ded1d4ca46ec" />

<img width="300" alt="Simulator Screenshot - iPhone 17 Pro - 2026-01-28 at 23 10 22" src="https://github.com/user-attachments/assets/77b5c07b-f9af-433f-a31b-1fa38d60e4d9" />

<img width="300" alt="Simulator Screenshot - iPhone 17 Pro - 2026-01-28 at 23 11 27" src="https://github.com/user-attachments/assets/a101cb03-00cd-4c85-b0e5-8bb4a75627e5" />

<img width="300" alt="Simulator Screenshot - iPhone 17 Pro - 2026-01-28 at 23 11 31" src="https://github.com/user-attachments/assets/df0d0d4b-4e71-4e5b-96b1-4762fa8b27f6" />

<img width="300" alt="Simulator Screenshot - iPhone 17 Pro - 2026-01-28 at 23 12 08" src="https://github.com/user-attachments/assets/87a325fa-a1ae-4161-a9b5-041abe81366f" />

<img width="300" alt="Simulator Screenshot - iPhone 17 Pro - 2026-01-28 at 23 12 13" src="https://github.com/user-attachments/assets/c05fbe92-a3eb-41d7-b664-b5a6492ba44f" />

<img width="300" alt="Simulator Screenshot - iPhone 17 Pro - 2026-01-28 at 23 12 48" src="https://github.com/user-attachments/assets/6766097d-2711-4bea-9cfa-1b4cfc1dc28a" />

<img width="300" alt="Simulator Screenshot - iPhone 17 Pro - 2026-01-28 at 23 12 52" src="https://github.com/user-attachments/assets/ffda6185-8ccd-4b5a-8733-3a9ea39fd2bd" />
