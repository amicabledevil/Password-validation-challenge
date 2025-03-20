# Create User Form

This is a React TypeScript component for a user registration form with password validation. It validates user input on the client side and submits the form data to an external API.

## Features
- User registration with username and password fields.
- Client-side password validation.
- API integration for user creation.
- Displays error messages for validation and API response errors.

## Technologies Used
- React (TypeScript)
- Fetch API
- CSS for basic styling

## Installation
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <project-directory>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```

## Usage
- Enter a username and a password.
- The password must meet the following criteria:
  - 10-24 characters long.
  - No spaces.
  - At least one uppercase letter.
  - At least one lowercase letter.
  - At least one number.
- Click the "Create User" button to submit.

## API Endpoint
- The form submits data to:
  ```
  https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup
  ```
- Requires an authentication token.

## Error Handling
- Displays client-side validation errors below the password field.
- Displays API response errors if authentication fails or the password is not allowed.

## License
This project is for educational purposes. Modify and use it as needed.

