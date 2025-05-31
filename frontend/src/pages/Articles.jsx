import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingIndicator from '../components/LoadingIndicator';
import DashboardLayout from '../components/DashboardLayout';

function Articles() {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetchArticles();
        fetchCategories();
    }, [selectedCategory]);

    const fetchArticles = async () => {
        try {
            let url = '/api/articles/my_articles/';
            if (selectedCategory) {
                url = `/api/articles/by_category/?category=${selectedCategory}`;
            }
            const response = await api.get(url);
            setArticles(response.data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/categories/');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    if (loading) return <LoadingIndicator />;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">My Articles</h1>
                    <Link to="/articles/create">
                        <Button>Create New Article</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <Button 
                                variant={!selectedCategory ? "default" : "outline"}
                                onClick={() => setSelectedCategory(null)}
                            >
                                All
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant={selectedCategory === category.slug ? "default" : "outline"}
                                    onClick={() => setSelectedCategory(category.slug)}
                                >
                                    {category.name}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <Card key={article.id} className="flex flex-col">
                            {article.featured_image && (
                                <img 
                                    src={article.featured_image} 
                                    alt={article.title}
                                    className="w-full h-48 object-cover rounded-t-lg"
                                />
                            )}
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    <Link to={`/articles/${article.slug}`} className="hover:text-blue-600">
                                        {article.title}
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <span>{article.category_name}</span>
                                    <span>•</span>
                                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-700 line-clamp-3">{article.summary}</p>
                            </CardContent>
                            <CardFooter className="mt-auto">
                                <div className="flex justify-between items-center w-full">
                                    <div className={`
                                        px-2 py-1 rounded-full text-sm
                                        ${article.status === 'published'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }
                                    `}>
                                        {article.status}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {article.views_count} views
                                    </span>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {articles.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-8">
                            <p className="text-gray-500 mb-4">No articles found</p>
                            <Link to="/articles/create">
                                <Button>Create Your First Article</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}

export default Articles; 