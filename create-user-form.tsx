import { useState, type CSSProperties, type Dispatch, type SetStateAction } from "react";

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}

function CreateUserForm({ setUserWasCreated }: CreateUserFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [clientValidationErrors, setClientValidationErrors] = useState<string[]>([]);
  
  const token = "Your Api Cant share mine !!";

  const validatePassword = (password: string): string[] => {
    const errors = [];
    if (password.length < 10) errors.push("Password must be at least 10 characters long");
    if (password.length > 24) errors.push("Password must be at most 24 characters long");
    if (/\s/.test(password)) errors.push("Password cannot contain spaces");
    if (!/\d/.test(password)) errors.push("Password must contain at least one number");
    if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
    return errors;
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setClientValidationErrors(validatePassword(newPassword));
    setError(null);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const validationErrors = validatePassword(password);
    if (!username || validationErrors.length > 0) {
      setClientValidationErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(
        "https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      console.log("API Response:", response.status, data);

      if (response.ok) {
        setUserWasCreated(true);
        return;
      }

      switch (response.status) {
        case 401:
        case 403:
          setError("Not authenticated to access this resource.");
          break;
        case 500:
          setError("Something went wrong, please try again.");
          break;
        default:
          if (data.errors?.includes("not_allowed")) {
            setError("Sorry, the entered password is not allowed, please try a different one.");
          } else if (data.errors?.length) {
            setError(data.errors.join(", "));
          } else {
            setError("Something went wrong, please try again.");
          }
      }
    } catch (error) {
      console.error("Request failed:", error);
      setError("Something went wrong, please try again.");
    }
  };

  return (
    <div style={formWrapper}>
      <form style={form} onSubmit={handleSubmit}>
        <label style={formLabel} htmlFor="username">
          Username
        </label>
        <input
          style={formInput}
          id="username"
          value={username}
          onChange={handleUsernameChange}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "username-error" : undefined}
        />
        {error && <p id="username-error" style={apiErrorStyle}>{error}</p>}

        <label style={formLabel} htmlFor="password">
          Password
        </label>
        <input
          style={formInput}
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
          aria-invalid={clientValidationErrors.length > 0}
          aria-describedby={clientValidationErrors.length > 0 ? "password-error" : undefined}
        />

        {clientValidationErrors.length > 0 && (
          <ul id="password-error" style={errorListStyle}>
            {clientValidationErrors.map((err, index) => (
              <li key={index} style={errorStyle}>
                {err}
              </li>
            ))}
          </ul>
        )}

        <button style={formButton} type="submit" disabled={!username || clientValidationErrors.length > 0}>
          Create User
        </button>
      </form>
    </div>
  );
}
export { CreateUserForm };

const formWrapper: CSSProperties = {
  maxWidth: "500px",
  width: "80%",
  backgroundColor: "#efeef5",
  padding: "24px",
  borderRadius: "8px",
};

const form: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const formLabel: CSSProperties = {
  fontWeight: 700,
};

const formInput: CSSProperties = {
  outline: "none",
  padding: "8px 16px",
  height: "40px",
  fontSize: "14px",
  backgroundColor: "#f8f7fa",
  border: "1px solid rgba(0, 0, 0, 0.12)",
  borderRadius: "4px",
};

const formButton: CSSProperties = {
  outline: "none",
  borderRadius: "4px",
  border: "1px solid rgba(0, 0, 0, 0.12)",
  backgroundColor: "#7135d2",
  color: "white",
  fontSize: "16px",
  fontWeight: 500,
  height: "40px",
  padding: "0 8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "8px",
  alignSelf: "flex-end",
  cursor: "pointer",
};

const errorListStyle: CSSProperties = {
  marginTop: "8px",
  paddingLeft: "20px",
};

const errorStyle: CSSProperties = {
  color: "red",
  fontSize: "14px",
};

const apiErrorStyle: CSSProperties = {
  color: "red",
  marginTop: "8px",
};
