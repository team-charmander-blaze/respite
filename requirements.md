# Software Requirements

## Vision

### What is the vision of this product?

We’re creating a Virtual Museum Experience for the user, an app that’s aesthetically pleasing and a welcome break from the stresses of daily life. The app will pull fine art exhibits from an art museum API (Artsy/Rijk/Unsplash to be decided) to display to the user. They will be able to swipe through paintings, photographs, and sculptures as if they were visiting the museum in person; a virtual walkthrough if you will.

### What pain point does this project solve?

Since we’re all stuck at home it provides a virtual escape from the mundane, and allows art enthusiasts, creatives, or anyone who just needs a break, to browse a virtual gallery of fine art exhibits from around the world. It is a welcome break from the doom-scrolling that can be found on typical social media apps.

### Why should we care about your product?

It's a simple source of entertainment and escapism for anyone to enjoy.

## Scope

### IN

- The web app will provide access to images/art on request
- The web app will provide quotes for inspiration
- The site will have dynamic colors based on user input
- The user will be able to access hex codes for a color palette

### OUT

- User login will not be a feature
- The app will not include the ability to purchase anything

### Minimum Viable Product

- Site provides user with two color palette display options
- Site pulls images from art API to display to user
- Stores previously received quotes into database

### Stretch

- Animated fortune cookie
- Adding a music player/music API
- Add a gallery slideshow to desktop view
- Delete an image from favorites
- Functionality to save quotes along with specific favorites
- Ability to copy color codes to clipboard
- Mission blurb for the about us page
- Add "hire me" to about us page

## Functional Requirements

- The app will be able to retrieve images from an API
- The app will be able to retrieve colors from an API
- The app will be able to retrieve qutoes from an API
- The site can dynamically change its colors

### Data Flow

Requests will be generated from the user on the front-end to the server. The server will make requests to APIs and to the database. The server will use the responses to that to prepare responses to the front-end for rendering.

## Non-Functional Requirements (301 & 401 only)

- Usability

    - The site needs to be easy to use for the average consumer. It should have a simple interface that's widely accessible.

- Scalability

    - The code base should be stable and dry so that more APIs and features would be easy to layer in if popularity grows. The database will need to be normalized in case it requires expansion for efficiency.

