# Admin UI Style Guide

## Design Direction

Use a minimal, Apple-like interface language: bright surfaces, soft contrast, generous radius, restrained color, and strong spacing discipline.

## Tokens

- Typography: SF Pro style sans stack for headings and controls.
- Surfaces: white or near-white with subtle borders and low-elevation shadows.
- Radius: 18px for controls, 28px for cards.
- Motion: small lift on hover, soft focus ring, no heavy gradients except primary actions.

## Buttons

- `primary-button`: for a single page-level confirmation action.
- `secondary-button`: for alternate actions that still matter.
- `utility-button`: for neutral actions like back, upload, add, filter.
- `utility-button utility-button--danger`: for destructive actions only.

Rules:

- Prefer one primary action per view.
- Keep destructive actions separate from content fields.
- Use pill buttons with subtle borders and minimal fill.

## Inputs

- Use the shared control tokens for all text fields, selects, and number inputs.
- Keep heights visually consistent across forms.
- Avoid isolated one-off input styles when a shared class already exists.

## Containers

- Primary content should sit in soft cards using the shared card surface.
- Avoid stacking too many bordered rows inside another bordered card.
- Use separate cards when content types change: metadata, media, rich text, tabular data.

## Typography

- Titles: compact sans headings with tighter tracking.
- Eyebrows and field labels: uppercase, smaller, lighter contrast.
- Body copy: neutral gray, no heavy decorative type inside workflows.

## Product Page Rules

- Keep metadata compact and high-signal.
- Remove non-essential read-only fields from the edit surface.
- Group related selectors like drop and status in one compact row.
- Keep media as a smaller supporting panel, not the dominant section.
- In tables, headers must use the same column model as the row content.