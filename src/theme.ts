import { createTheme, Card } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "dark",
  fontFamily:
    '"Geist", "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  headings: {
    fontFamily:
      '"Geist", "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: "700",
    sizes: {
      h1: { fontWeight: "800" },
      h2: { fontWeight: "700" },
      h3: { fontWeight: "600" },
    },
  },
  defaultRadius: "xl",
  cursorType: "pointer",
  colors: {
    dark: [
      "#eaeaea",
      "#a1a1aa",
      "#71717a",
      "#52525b",
      "#3f3f46",
      "#27272a",
      "#18181b",
      "#0f0f11",
      "#08080a",
      "#000000",
    ],
  },
  shadows: {
    xs: "none",
    sm: "none",
    md: "none",
    lg: "none",
    xl: "none",
  },
  components: {
    Paper: {
      defaultProps: {
        shadow: "none",
        radius: "32px",
      },
    },
    Card: Card.extend({
      defaultProps: {
        radius: "32px",
        withBorder: true,
        shadow: "none",
        padding: "lg",
      },
      vars: (_theme, props) => {
        if (props.padding === "lg" || !props.padding) {
          return {
            root: {
              "--card-padding": "18px 20px",
            },
          };
        }
        return { root: {} };
      },
    }),
    Button: {
      defaultProps: {
        radius: "xl",
        size: "sm",
      },
    },
    Badge: {
      defaultProps: {
        radius: "sm",
        variant: "outline",
      },
    },
  },
});
