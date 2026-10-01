import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import Contact from "./Contact";

vi.mock("../../config/site", () => ({
  siteMetadata: {
    email: "",
    contactEndpoint: "https://api.web3forms.com/submit",
    web3FormsAccessKey: "test-key",
  },
  contactIntro: "",
  contactSubjects: [],
}));

afterEach(() => vi.unstubAllGlobals());

function fillMessage() {
  fireEvent.click(screen.getByText("Send a message"));
  fireEvent.change(screen.getByRole("textbox", { name: "Name", exact: true }), { target: { value: "Visitor" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Email", exact: true }), { target: { value: "visitor@example.com" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Message" }), { target: { value: "A production enquiry." } });
  fireEvent.submit(screen.getByRole("button", { name: "Send", exact: true }).closest("form"));
}

test("the compact form sends a complete enquiry and resets after confirmed success", async () => {
  const submit = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, message: "Message sent." }) });
  vi.stubGlobal("fetch", submit);
  render(<Contact compact />);
  expect(screen.queryByRole("link", { name: "Email", exact: true })).not.toBeInTheDocument();
  fillMessage();
  expect(await screen.findByText("Message sent.")).toBeVisible();
  expect(JSON.parse(submit.mock.calls[0][1].body)).toMatchObject({
    name: "Visitor", email: "visitor@example.com", message: "A production enquiry.", subject: "Portfolio enquiry", access_key: "test-key",
  });
  expect(screen.getByRole("textbox", { name: "Name", exact: true })).toHaveValue("");
});

test("an unsuccessful provider response keeps the visitor's message for retry", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false, message: "Please try again." }) }));
  render(<Contact compact />);
  fillMessage();
  expect(await screen.findByText("Please try again.")).toBeVisible();
  expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue("A production enquiry.");
  expect(screen.getByRole("button", { name: "Send", exact: true })).toBeEnabled();
});
