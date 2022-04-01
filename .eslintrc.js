module.exports = {
  extends: "next/core-web-vitals",
  rules: {
    "react/display-name": 0,
    "no-trailing-spaces": "error",
    "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
    "object-curly-spacing": ["error", "always"],
    "key-spacing": ["error", { beforeColon: false }],
    "comma-dangle": ["error", {
      arrays: "always-multiline",
      objects: "always-multiline",
      imports: "never",
      exports: "never",
      functions: "never",
    }],
    "array-bracket-spacing": ["error", "never"],
    "react/react-in-jsx-scope": "off",
    indent: [
      "error",
      2,
    ],
    "linebreak-style": [
      "error",
      "unix",
    ],
    quotes: [
      "error",
      "double",
    ],
    semi: [
      "error",
      "never",
    ],
  },
}
