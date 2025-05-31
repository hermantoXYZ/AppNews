import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import LoadingIndicator from '../components/LoadingIndicator';

function ArticleDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        fetchArticle();
    }, [slug]);

    const fetchArticle = async () => {
        try {
            const response = await api.get(`/api/articles/${slug}/`);
            setArticle(response.data);
            
            // Check if current user is the author
            const userResponse = await api.get('/api/users/me/');
            setIsAuthor(userResponse.data.id === response.data.author.id);
        } catch (error) {
            console.error('Error fetching article:', error);
            toast.error('Failed to load article');
            navigate('/articles');
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        try {
            await api.post(`/api/articles/${slug}/publish/`);
            toast.success('Article published successfully');
            fetchArticle();
        } catch (error) {
            console.error('Error publishing article:', error);
            toast.error('Failed to publish article');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                await api.delete(`/api/articles/${slug}/`);
                toast.success('Article deleted successfully');
                navigate('/articles');
            } catch (error) {
                console.error('Error deleting article:', error);
                toast.error('Failed to delete article');
            }
        }
    };

    if (loading) return <LoadingIndicator />;
    if (!article) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-4xl mx-auto">
                {article.featured_image && (
                    <img 
                        src={article.featured_image} 
                        alt={article.title}
                        className="w-full h-64 object-cover rounded-t-lg"
                    />
                )}
                
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-3xl mb-2">{article.title}</CardTitle>
                            <p className="text-gray-600">
                                By {article.author.username} in {article.category_name} | 
                                {new Date(article.created_at).toLocaleDateString()} | 
                                {article.views_count} views
                            </p>
                        </div>
                        {isAuthor && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/articles/edit/${slug}`)}
                                >
                                    Edit
                                </Button>
                                {article.status === 'draft' && (
                                    <Button onClick={handlePublish}>
                                        Publish
                                    </Button>
                                )}
                                <Button 
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent>
                    {article.summary && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <p className="text-gray-700 italic">{article.summary}</p>
                        </div>
                    )}
                    
                    <div className="prose max-w-none">
                        {article.content.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-4">{paragraph}</p>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ArticleDetail; 