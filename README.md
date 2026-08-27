# 3813ICT - Full Stack Development Assignment
This is an attempt to create a chat app for Phase 1 Assignment for 3813ICT Full Stack Development by Anton Korotkov 5343594, Wendesday 1pm class.

### Due date
Phase 1 – Specification, Design, Prototype (25%)
Due: 5pm Thursday 27 August 2026 (Week 6)

### Info
**Individual Work:** You must complete this assignment individually.
**Presentation:** You must present/demonstrate your work to a teaching team member
  - for phase 1 in the workshop in week 7
  - and for phase 2 in the workshop of week 12.
  - Your work will not be marked if you do not present it.
**Other:** This assignment is a mandatory pass component. You must attain 50% (35/70) (Phases 1 and 2 combined) to be eligible to pass the course.

## Introduction
You are required to build a full stack chat application to the specifications listed within this document and from further specifications elicitation from the client. The chat system will facilitate user communication with each other, passing messages as text and images in real-time. Some users will have elevated privileges to perform administrative functions such as user creation requests, group and channel assignments. The development stack to be used is the MEAN stack: Mongo, Express, Angular (20+), and Node.js. Real-time communication (chat) and other functionality will use socket.io. 

The client for this project is the course convenor. In Week 2, you will have an opportunity to ask the client questions to clarify any uncertainties about the design and functional requirements for the application. This session will be recorded and will provide a source of information for your analysis of the project requirements. The lecture time slot in Week 2 will be used for this client briefing, and it will be an online meeting.

The full specifications of the app will not be defined in this document. You should read this document in conjunction with the recordings from the client meeting (Week 2). If questions are made after the meeting from any student up until August 5th, 5pm (Week 4), clarifying requirements, they will be published on the course website as an announcement and will form part of the project requirements.

### Use of AI
As students in a third-year programming course, you are expected to have a solid understanding of fundamental control flow constructs and commonly used data structures across programming languages. In this context, AI tools can be effectively used to support your development process.

## Phase 1
- elicitation of requirements
- planning/design
- early prototype of the application

Documentation of your implementation is required. All documentation will use appropriate Markdown syntax and be part of your Git Repository called “Phase1.md".


### Documentation Required for Submission

1. **Brief Description of the Project (Overview)**
2. **GIT Strategy:** Outline your strategies for using GIT (branching, etc.) during the development of your solution.
3. **Specifications and Assumptions:** Provide a clear elicitation of specifications and assumptions used for the application (functional requirements).  
   _Table layout preferred._
4. **Data Structures:** Description/listing of data structures used to store and represent data in the application.
5. **Proposed Angular Architecture:** Description of proposed Angular architecture, including components, services, models, routes, etc.  
   _These do not have to be fully implemented but should be defined or considered._
6. **Proposed Server Endpoints:** List of proposed server-based endpoints that may be required.  
   _Not all have to be implemented but should be defined._
7. **Design Documents:** Include design documents, including storyboards using a responsive design methodology.

### What Code is Required

- **Focus for Phase 1:**  
  The main focus is on the UI design of the front end of the application. Backend services will be limited to user management functions.

- **Prototype Implementation:**  
  Provide code implementing a working prototype of the application that displays the required UI for each permissions level. This prototype does not need to be fully functional but should include a clear layout of the UI elements required as per your design documents.

- **User, Group, and Channel Management:**  
  Users, Groups, and Channels should be able to be created, assigned, and persistently stored in a JSON file on the server. (Databases will be introduced in Phase 2.)

- **Mock Data:**  
  Mock data can be used for other functions.

- **Authentication:**  
  Users should complete very basic authentication when logging in (username/password).

## Submission
Submit to the assessment link on Canvas.

- **Requirements:**
  1. A single document (PDF) should include your name/snumber, a link to your GitHub repo, and a copy of the raw markdown document (`phase1.md`). Make sure your teaching staff member has been added as a collaborator to your Git repo before marking.
  2. Any pushes to your repo after the submission date will be ignored.