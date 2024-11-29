# RBAC App for Posts

It is a simple app created using ExpressJS, NodeJS, MongoDB, Mongoose, EJS, CSS.
I used PassportJS for authentication and creating users. It automatically hashes and salts passwords for users. 
I used express-session for session management. Google Passport OAuth for google login and register. 
This simple app features a option to allow registered users to view posts. Only moderators are allowed to add new posts and only admin are allowed to edit and delete any posts. 
There is space for adding additional authentication if users choose for Admin or Moderator role, currently it freely allows them to do so. Google users are automatically registered as viewers.
There is additional option to add Two factor authentication so that only valid email addresses are allowed. Currently it allows any email address. UI is very minimalistic and focus is more on RBAC.
