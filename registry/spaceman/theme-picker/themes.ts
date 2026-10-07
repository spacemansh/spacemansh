/**
 * The colour themes the picker offers. Pass the same list to the
 * `ThemeProvider` as `colorThemes` so it can apply and persist the choice.
 *
 * Kept outside the client component so server files, such as the root layout,
 * can import the real array rather than a client reference.
 */
const colorThemes = ['emerald', 'slate', 'azure', 'violet', 'amber']

export { colorThemes }
