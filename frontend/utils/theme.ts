const colors = {
    primary: "#6200ee",
    secondary: "#4CAF50",
    danger: "#f44336",
    warning: "#ff9800",
    info: "#2196f3",
    light: "#f5f5f5",
    dark: "#333333",
    white: "#ffffff",
    black: "#000000",
    success: "#4CAF50",
    background: "#f8f9fa",
    cardBackground: "#ffffff",
    border: "#e0e0e0",
    textSecondary: "#666666",
    accent: "#03DAC6",
};

const fontSizes = {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
    xxlarge: 32,
};

const spacing = {
    xs: 4,
    small: 8,
    medium: 16,
    large: 24,
    xl: 32,
    xxl: 48,
};

const borderRadius = {
    small: 4,
    medium: 8,
    large: 16,
    xl: 24,
};

const shadows = {
    small: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    large: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
};

export const theme = {
    colors,
    fontSizes,
    spacing,
    borderRadius,
    shadows,
};