// Theme definitions for the flip clock
export const themes = {
    midnight: {
        id: 'midnight',
        name: 'Midnight Blue',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        cardGradientTop: 'linear-gradient(to bottom, #4a5568, #2d3748)',
        cardGradientBottom: 'linear-gradient(to bottom, #2d3748, #1a202c)',
        textColor: '#ffffff',
        textColorBottom: '#e2e8f0',
        glowColor: 'rgba(99, 102, 241, 0.5)',
        accentColor: '#6366f1',
        buttonBg: 'rgba(99, 102, 241, 0.2)',
        buttonHover: 'rgba(99, 102, 241, 0.3)',
    },
    purple: {
        id: 'purple',
        name: 'Purple Haze',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #5b21b6 50%, #7c3aed 100%)',
        cardGradientTop: 'linear-gradient(to bottom, #7c3aed, #6d28d9)',
        cardGradientBottom: 'linear-gradient(to bottom, #6d28d9, #5b21b6)',
        textColor: '#ffffff',
        textColorBottom: '#f3e8ff',
        glowColor: 'rgba(168, 85, 247, 0.6)',
        accentColor: '#a855f7',
        buttonBg: 'rgba(168, 85, 247, 0.2)',
        buttonHover: 'rgba(168, 85, 247, 0.3)',
    },
    emerald: {
        id: 'emerald',
        name: 'Emerald Dream',
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
        cardGradientTop: 'linear-gradient(to bottom, #10b981, #059669)',
        cardGradientBottom: 'linear-gradient(to bottom, #059669, #047857)',
        textColor: '#ffffff',
        textColorBottom: '#d1fae5',
        glowColor: 'rgba(16, 185, 129, 0.6)',
        accentColor: '#10b981',
        buttonBg: 'rgba(16, 185, 129, 0.2)',
        buttonHover: 'rgba(16, 185, 129, 0.3)',
    },
    sunset: {
        id: 'sunset',
        name: 'Sunset Orange',
        background: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #fb923c 100%)',
        cardGradientTop: 'linear-gradient(to bottom, #f97316, #ea580c)',
        cardGradientBottom: 'linear-gradient(to bottom, #ea580c, #c2410c)',
        textColor: '#ffffff',
        textColorBottom: '#ffedd5',
        glowColor: 'rgba(249, 115, 22, 0.6)',
        accentColor: '#f97316',
        buttonBg: 'rgba(249, 115, 22, 0.2)',
        buttonHover: 'rgba(249, 115, 22, 0.3)',
    },
    classic: {
        id: 'classic',
        name: 'Classic Dark',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #0a0a0a 100%)',
        cardGradientTop: 'linear-gradient(to bottom, #4b5563, #374151)',
        cardGradientBottom: 'linear-gradient(to bottom, #374151, #1f2937)',
        textColor: '#ffffff',
        textColorBottom: '#e5e7eb',
        glowColor: 'rgba(156, 163, 175, 0.4)',
        accentColor: '#9ca3af',
        buttonBg: 'rgba(156, 163, 175, 0.2)',
        buttonHover: 'rgba(156, 163, 175, 0.3)',
    },
}

export const getTheme = (themeId) => {
    return themes[themeId] || themes.midnight
}

export const themeList = Object.values(themes)
