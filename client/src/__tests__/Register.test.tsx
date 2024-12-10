import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Register from "../pages/Register";
import authService from "../services/authService";
import { BrowserRouter } from "react-router-dom";

jest.mock("../services/authService");

describe("Register Component", () => {
  const setup = () => {
    return render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>,
    );
  };

  it("displays validation error if fields are empty", async () => {
    setup();

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(screen.getByText("All fields are required.")).toBeInTheDocument();
    });
  });

  it("shows modal with 'Please enter a valid email address.' for invalid email", async () => {
    setup();
  
    // Fill in valid name and passwords but invalid email
    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });
  
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
  
    // Wait for the modal message to appear
    await waitFor(() => {
      expect(screen.getByTestId("modal-message")).toHaveTextContent(
        "Please enter a valid email address.",
      );
    });
  
    // Ensure register function is NOT called
    expect(authService.register).not.toHaveBeenCalled();
  });
  

  it("displays validation error for mismatched passwords", async () => {
    setup();

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password321" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    });
  });

  it("displays error if the password is too short", async () => {
    setup();

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 6 characters long."),
      ).toBeInTheDocument();
    });
  });

  it("displays error if fields contain only whitespace", async () => {
    setup();

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "   " },
    });
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "   " },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "   " },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(screen.getByText("All fields are required.")).toBeInTheDocument();
    });
  });

  it("displays success message and redirects on successful registration", async () => {
    (authService.register as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (authService.getProfile as jest.Mock).mockReturnValue({
      id: "12345",
    });

    setup();

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(
        screen.getByText("User registered successfully!"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Close"));

    expect(authService.getProfile).toHaveBeenCalled();
  });

  it("displays error message if API returns an empty response", async () => {
    (authService.register as jest.Mock).mockResolvedValue({});

    setup();

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(
        screen.getByText("An error occurred during registration."),
      ).toBeInTheDocument();
    });
  });

  it("displays API error when registration fails", async () => {
    // Mock the API to reject with an error
    (authService.register as jest.Mock).mockRejectedValue(
      new Error("An error occurred during registration.")
    );
  
    setup();
  
    // Fill in valid form fields
    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });
  
    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
  
    // Debug DOM state
    console.log(screen.debug());
  
    // Wait for the modal to appear with the error message
    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes("An error occurred during registration.")
        )
      ).toBeInTheDocument();
    });
  });
  

  it("handles unknown errors gracefully", async () => {
    (authService.register as jest.Mock).mockRejectedValueOnce("Unknown error");

    setup();

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(
        screen.getByText("An unknown error occurred during registration."),
      ).toBeInTheDocument();
    });
  });
});
