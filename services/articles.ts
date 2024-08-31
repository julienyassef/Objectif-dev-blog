// Fonction pour incrémenter les vues d'un article identifié par son slug
export const incrementArticleViews = async (slug: string) => {
    try {
        const response = await fetch(`/api/increment-views`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ slug })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to increment article views:', error);
        throw error;
    }
};
